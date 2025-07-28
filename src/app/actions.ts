"use server";

import { RaffleFormValues, createRaffleFormSchema } from '@/schemas';
import { headers } from 'next/headers';
import { sendMail } from '@/lib/nodemailer';
import { getDatabase } from '@/lib/firebaseServer';
import { ObjectId } from 'mongodb';
import { uploadReceipt } from '@/lib/googleDrive';

export type SubmitRaffleResult = {
  success: boolean;
  message: string;
  ticketNumber?: number;
  receiptUrl?: string;
};

// Server action que registra la participación en MongoDB
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

    // Primero intentamos subir el archivo a Google Drive
    let driveFileId: string | undefined;
    let receiptUrl: string | undefined;
    
    try {
      const uploadResult = await uploadReceipt(receipt);
      driveFileId = uploadResult.fileId ?? undefined;
      receiptUrl = uploadResult.webViewLink ?? undefined;
    } catch (uploadError: any) {
      console.error('Error al subir el comprobante:', uploadError);
      return { 
        success: false, 
        message: uploadError.message || 'Error al subir el comprobante. Por favor, inténtalo de nuevo.'
      };
    }

    // Solo si la subida fue exitosa, guardamos en MongoDB
    const { receipt: _omitReceipt, ...plainData } = validatedData.data;
    await db.collection('raffleTickets').insertOne({
      ...plainData,
      ticketNumber,
      receiptName: receipt.name,
      receiptMimeType: receipt.type,
      receiptSize: receipt.size,
      createdAt: new Date(),
      clientIp,
      pagoVerificado: false,
      driveFileId,
      receiptUrl
    });

    // Ya no necesitamos este bloque porque la subida del archivo se maneja antes

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
        html: `<p>¡Gracias por participar en la rifa!</p><p>Tu número único de registro es: <b>${ticketNumber}</b></p><p>Datos registrados:</p>${formHtml}`,
        text: `¡Gracias por participar en la rifa!\nTu número único de registro es: ${ticketNumber}\n\nDatos registrados:\n${Object.entries(plainData).map(([k,v])=>`${k === 'stars' ? 'Participaciones Adquiridas' : k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n')}`,
      });
    } catch (mailErr) {
      console.error('Error enviando correo de notificación:', mailErr);
    }

    return {
      success: true,
      message: '¡Gracias por tu participación! Tu comprobante ha sido enviado.',
      ticketNumber,
    };
  } catch (error) {
    console.error('Error submitting raffle ticket:', error);
    return { success: false, message: 'Ocurrió un error al procesar tu participación. Por favor, inténtalo de nuevo.' };
  }
}
