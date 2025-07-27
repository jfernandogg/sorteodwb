"use server";

import { RaffleFormValues, createRaffleFormSchema } from '@/schemas';
import { headers } from 'next/headers';
import { drive } from '@/lib/googleDrive';
import { Readable } from 'stream';
import { sendMail } from '@/lib/nodemailer';
import { getDatabase } from '@/lib/firebaseServer';
import { ObjectId } from 'mongodb';

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
    const db = await getDatabase();

    // Validar datos
    const RaffleFormSchema = createRaffleFormSchema((key: string) => key);
    const validatedData = RaffleFormSchema.safeParse(data);
    if (!validatedData.success) {
      // Create a more readable error message from Zod's error object
      const errorMessages = Object.entries(validatedData.error.flatten().fieldErrors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      return { success: false, message: 'Datos inválidos: ' + errorMessages };
    }

    const headersList = await headers();
    const clientIp = headersList.get('x-forwarded-for') || headersList.get('remote-addr');

    // Verificar duplicados
    const dup = await db.collection('raffleTickets').findOne({
      email: validatedData.data.email,
      receiptName: receipt.name,
    });
    if (dup) {
      return { success: false, message: 'Ya existe una participación con este correo y nombre de comprobante.' };
    }

    // Generar número de ticket único
    const counter = await db.collection('meta').findOneAndUpdate(
      { _id: new ObjectId('000000000000000000000001') },
      { $inc: { ticketCounter: 1 } },
      { returnDocument: 'after', upsert: true }
    );
    const ticketNumber = counter?.value?.ticketCounter || 1;

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

    // Guardar datos en MongoDB
    const { receipt: _omitReceipt, ...plainData } = validatedData.data;
    await db.collection('raffleTickets').insertOne({
      ...plainData,
      ticketNumber,
      receiptDriveId: driveRes.data.id,
      receiptName: receipt.name,
      receiptMimeType: receipt.type,
      receiptSize: receipt.size,
      receiptUrl,
      createdAt: new Date(),
      clientIp,
      pagoVerificado: false,
    });

    // Enviar correo de notificación
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
        text: `¡Gracias por participar en la rifa!\nTu número único de registro es: ${ticketNumber}\n\nDatos registrados:\n${Object.entries(plainData).map(([k,v])=>`${k === 'stars' ? 'Participaciones Adquiridas' : k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n')}\nComprobante: ${receiptUrl}`,
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
