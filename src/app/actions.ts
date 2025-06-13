
"use server";

import { RaffleFormValues, RaffleFormSchema } from '@/schemas';
import { headers } from 'next/headers';
import { firestore } from '@/lib/firebaseServer';
import { drive } from '@/lib/googleDrive';
import { Readable } from 'stream';
import { sendMail } from '@/lib/nodemailer';
// @ts-ignore - firebase-admin types may not be installed in all environments
import type { FirebaseFirestore } from 'firebase-admin/firestore';

export type SubmitRaffleResult = {
  success: boolean;
  message: string;
  ticketNumber?: number;
  receiptUrl?: string;
};

// Server action that registra la participación en Firestore y
// sube el comprobante a Google Drive usando las credenciales del
// servicio configuradas en las variables de entorno.

export async function submitRaffleTicket(
  data: RaffleFormValues,
  receipt: File
): Promise<SubmitRaffleResult> {
  try {
    const validatedData = RaffleFormSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, message: 'Datos inválidos: ' + validatedData.error.flatten().fieldErrors };
    }

    // const headersList = headers() as any;
    const headersList = await headers();
    const clientIp = headersList.get('x-forwarded-for') || headersList.get('remote-addr');

    // Verificar duplicados por email y nombre del archivo
    console.log('Consultando duplicados en raffleTickets...');
    const dup = await firestore
      .collection('raffleTickets')
      .where('email', '==', validatedData.data.email)
      .where('receiptName', '==', receipt.name)
      .limit(1)
      .get();
      console.log('Resultado de consulta de duplicados:', dup);
    if (!dup.empty) {
      return { success: false, message: 'Ya existe una participación con este correo y nombre de comprobante.' };
    }

    // Generar consecutivo de ticket
    let ticketNumber = 0;
    const counterRef = firestore.collection('meta').doc('counters');
    await firestore.runTransaction(async (tx: FirebaseFirestore.Transaction) => {
      const snap = await tx.get(counterRef);
      ticketNumber = (snap.data()?.ticketCounter || 0) + 1;
      tx.set(counterRef, { ticketCounter: ticketNumber }, { merge: true });
    });

    // Subir comprobante a Google Drive
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      throw new Error('GOOGLE_DRIVE_FOLDER_ID not set');
    }
    const buffer = Buffer.from(await receipt.arrayBuffer());
    const driveRes = await drive.files.create({
      requestBody: { name: `${ticketNumber}_${receipt.name}`, parents: [folderId] },
      media: { mimeType: receipt.type, body: Readable.from(buffer) },
      fields: 'id, webViewLink',
    });
    const receiptUrl = driveRes.data.webViewLink || '';

    // Guardar datos en Firestore
    // Excluir el campo 'receipt' si existe en validatedData.data
    const { receipt: _omitReceipt, ...plainData } = validatedData.data;
    await firestore.collection('raffleTickets').add({
      ...plainData,
      ticketNumber,
      receiptDriveId: driveRes.data.id,
      receiptName: receipt.name, // Se guarda el nombre del archivo
      receiptMimeType: receipt.type,
      receiptSize: receipt.size,
      receiptUrl,
      createdAt: new Date(),
      clientIp,
    });

    // Enviar correo de notificación al usuario
    try {
      const formHtml = Object.entries(plainData)
        .map(([key, value]) => {
          const label = key === 'stars' ? 'Participaciones Adquiridas' : key;
          return `<b>${label.charAt(0).toUpperCase() + label.slice(1)}:</b> ${value}<br>`;
        }) 
        .join('');

      await sendMail({
        to: plainData.email,
        subject: `¡Registro recibido! Ticket #${ticketNumber} - Rifa Solidaria Living Center Medellín`,
        html: `<p>¡Gracias por participar en la rifa!</p><p>Tu número único de registro es: <b>${ticketNumber}</b></p><p>Datos registrados:</p>${formHtml}<p>Puedes ver tu comprobante <a href="${receiptUrl}">aquí</a>.</p>`,
        text: `¡Gracias por participar en la rifa!\nTu número único de registro es: ${ticketNumber}\n\nDatos registrados:\n${Object.entries(plainData).map(([k,v])=>`${k === 'stars' ? 'Participaciones Adquiridas' : k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n')}\nComprobante: ${receiptUrl}`
      });
    } catch (mailErr) {
      console.error('Error enviando correo de notificación:', mailErr);
    }

    return {
      success: true,
      message: '¡Gracias por tu participación! Tu comprobante ha sido enviado.',
      ticketNumber,
      receiptUrl,
    };
  } catch (error) {
    console.error('Error submitting raffle ticket:', error);
    return { success: false, message: 'Ocurrió un error al procesar tu participación. Por favor, inténtalo de nuevo.' };
  }
}
