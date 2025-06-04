"use server";

import { RaffleFormValues, RaffleFormSchema } from '@/schemas';
import { headers } from 'next/headers';

export type SubmitRaffleResult = {
  success: boolean;
  message: string;
  ticketNumber?: number;
  receiptUrl?: string;
};

// This is a mock implementation. In a real scenario, this would interact with:
// 1. A Cloud Function to check for duplicates in Firestore.
// 2. A Cloud Function to:
//    - Generate ticketNumber (incremental counter in Firestore).
//    - Upload receipt to Google Drive.
//    - Save raffle ticket data to Firestore.
//    - Send confirmation email via Gmail API.

export async function submitRaffleTicket(
  data: RaffleFormValues,
  fileName: string,
  fileType: string,
  fileSize: number
): Promise<SubmitRaffleResult> {
  try {
    const validatedData = RaffleFormSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, message: "Datos inválidos: " + validatedData.error.flatten().fieldErrors };
    }

    const clientIp = headers().get('x-forwarded-for') || headers().get('remote-addr');

    // Mock duplicate check (email + fileName)
    // In reality, call a Cloud Function: e.g., checkDuplicate(validatedData.data.email, fileName)
    const isDuplicate = false; // Replace with actual check
    if (isDuplicate) {
      return { success: false, message: 'Ya existe una participación con este correo y nombre de comprobante.' };
    }

    // Mock processing: ticket generation, Drive upload, Firestore save, email
    // In reality, call a Cloud Function: e.g., processRaffleTicket(validatedData.data, fileInfo, clientIp)
    console.log('Submitting raffle ticket for:', validatedData.data.email);
    console.log('Receipt info:', { fileName, fileType, fileSize });
    console.log('Client IP:', clientIp);

    // Mock successful submission
    const mockTicketNumber = Math.floor(Math.random() * 100000) + 1;
    const mockReceiptUrl = `https://fake-drive.com/receipts/${fileName}`;

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      message: '¡Gracias por tu participación! Tu comprobante ha sido enviado.',
      ticketNumber: mockTicketNumber,
      receiptUrl: mockReceiptUrl,
    };
  } catch (error) {
    console.error('Error submitting raffle ticket:', error);
    return { success: false, message: 'Ocurrió un error al procesar tu participación. Por favor, inténtalo de nuevo.' };
  }
}
