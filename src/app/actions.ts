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
  receipt: File,
  locale: string = 'es'
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
    // Inicializar contador si no existe
    const counterDoc = {
      _id: new ObjectId('000000000000000000000001'),
      initialized: new Date()
    };
    
    // Inicializar contador si no existe e incrementarlo atómicamente
    const counter = await db.collection('meta').findOneAndUpdate(
      { _id: counterDoc._id },
      { $inc: { ticketCounter: 1 }, $setOnInsert: counterDoc },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    if (!counter) {
      throw new Error('Failed to initialize or increment ticket counter');
    }
    
    console.log('Counter document:', JSON.stringify(counter, null, 2));
    const ticketNumber = counter.ticketCounter;

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
      // Cargar mensajes según el locale
      const messages = require(`../../messages/${locale}.json`);
      const raffleMessages = messages.RaffleEmail || {};
      
      const formHtml = Object.entries(plainData)
        .map(([key, value]) => {
          const label = raffleMessages[key] || key;
          return `<tr>
            <td style="padding: 5px 10px;text-align:left;border-bottom:1px solid #eee"><b>${label}</b></td>
            <td style="padding: 5px 10px;text-align:left;border-bottom:1px solid #eee">${value}</td>
          </tr>`;
        })
        .join('');

      await sendMail({
        to: plainData.email,
        subject: `${raffleMessages.subject} #${ticketNumber} - ${raffleMessages.eventName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#333">${raffleMessages.eventName}</h2>
            <p>${raffleMessages.thanks}</p>
            <p>${raffleMessages.yourTicketNumber}: <strong>${ticketNumber}</strong></p>
            
            <h3 style="margin-top:20px">${raffleMessages.registeredData}</h3>
            <table style="width:100%;border-collapse:collapse;margin-top:10px">
              ${formHtml}
            </table>
            
            <p style="margin-top:20px">¡Mucha suerte!</p>
          </div>
        `,
        text: `
          ${raffleMessages.eventName}
          ${raffleMessages.thanks}
          ${raffleMessages.yourTicketNumber}: ${ticketNumber}
          
          ${raffleMessages.registeredData}:
          ${Object.entries(plainData).map(([k,v]) =>
            `${raffleMessages[k] || k}: ${v}`
          ).join('\n')}
        `,
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
