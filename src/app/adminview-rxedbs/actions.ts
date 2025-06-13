
"use server";

import { firestore } from '@/lib/firebaseServer';
// @ts-ignore - Firestore Timestamp type might not be globally available for client
import type { Timestamp } from 'firebase-admin/firestore'; 
import { RaffleFormValues } from '@/schemas'; // Assuming this base structure

// Define the structure of a raffle entry as stored in Firestore
// This should match the structure used in src/app/actions.ts when submitting
export interface RaffleEntry extends Omit<RaffleFormValues, 'receipt'> {
  id: string; // Firestore document ID
  ticketNumber: number;
  receiptDriveId?: string;
  receiptName?: string;
  receiptMimeType?: string;
  receiptSize?: number;
  receiptUrl?: string;
  createdAt: Timestamp; // Firestore Timestamp
  clientIp?: string;
}

interface AuthFetchResult {
  success: boolean;
  entries?: RaffleEntry[];
  message?: string;
}

export async function authenticateAndFetchEntries(password: string): Promise<AuthFetchResult> {
  const adminPassword = process.env.ADMIN_VIEW_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_VIEW_PASSWORD no está configurado en las variables de entorno.");
    return { success: false, message: "Error de configuración del servidor." };
  }

  if (password !== adminPassword) {
    return { success: false, message: "Contraseña incorrecta." };
  }

  try {
    const snapshot = await firestore.collection('raffleTickets').orderBy('ticketNumber', 'desc').get();
    const entries: RaffleEntry[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<RaffleEntry, 'id'>),
    }));
    return { success: true, entries };
  } catch (error) {
    console.error("Error al obtener las entradas de la rifa:", error);
    return { success: false, message: "Error al obtener los datos de las participaciones." };
  }
}
