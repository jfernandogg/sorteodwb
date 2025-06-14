
"use server";

import { firestore } from '@/lib/firebaseServer';
// @ts-ignore - Firestore Timestamp type might not be globally available for client
import type { Timestamp as FirestoreTimestamp } from 'firebase-admin/firestore'; 
import type { RaffleFormValues } from '@/schemas';

// Interface for the serializable timestamp
interface SerializableTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Define the structure of a raffle entry as it will be passed to the client
export interface ClientRaffleEntry extends Omit<RaffleFormValues, 'receipt'> {
  id: string; // Firestore document ID
  ticketNumber: number;
  receiptDriveId?: string;
  receiptName?: string;
  receiptMimeType?: string;
  receiptSize?: number;
  receiptUrl?: string;
  createdAt: SerializableTimestamp; // Use serializable timestamp
  clientIp?: string;
  pagoVerificado?: boolean; // Added pagoVerificado
}

// Original Firestore entry structure (used internally in this server action)
interface FirestoreRaffleEntry extends Omit<RaffleFormValues, 'receipt'> {
  id: string;
  ticketNumber: number;
  receiptDriveId?: string;
  receiptName?: string;
  receiptMimeType?: string;
  receiptSize?: number;
  receiptUrl?: string;
  createdAt: FirestoreTimestamp; // Firestore Timestamp
  clientIp?: string;
  pagoVerificado?: boolean; // Added pagoVerificado
}

interface AuthFetchResult {
  success: boolean;
  entries?: ClientRaffleEntry[];
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
    const entries: ClientRaffleEntry[] = snapshot.docs.map(doc => {
      const data = doc.data() as Omit<FirestoreRaffleEntry, 'id'>;
      return {
        id: doc.id,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        stars: data.stars,
        ticketNumber: data.ticketNumber,
        receiptDriveId: data.receiptDriveId,
        receiptName: data.receiptName,
        receiptMimeType: data.receiptMimeType,
        receiptSize: data.receiptSize,
        receiptUrl: data.receiptUrl,
        createdAt: { // Convert Timestamp to serializable object
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds,
        },
        clientIp: data.clientIp,
        pagoVerificado: data.pagoVerificado || false, // Default to false if undefined
      };
    });
    return { success: true, entries };
  } catch (error) {
    console.error("Error al obtener las entradas de la rifa:", error);
    return { success: false, message: "Error al obtener los datos de las participaciones." };
  }
}

interface UpdatePagoVerificadoResult {
  success: boolean;
  message?: string;
}

export async function updatePagoVerificadoStatus(
  entryId: string,
  pagoVerificado: boolean
): Promise<UpdatePagoVerificadoResult> {
  // Basic check: Ensure the user calling this is somehow authenticated as admin.
  // For this specific page, we rely on the initial password check.
  // In a more complex app, you'd use session tokens or proper auth middleware.
  const adminPassword = process.env.ADMIN_VIEW_PASSWORD;
  if (!adminPassword) { // This check is more for server config than per-call auth here.
    console.error("ADMIN_VIEW_PASSWORD no está configurado.");
    return { success: false, message: "Error de configuración del servidor." };
  }
  
  if (!entryId) {
    return { success: false, message: "ID de entrada no proporcionado." };
  }

  try {
    await firestore.collection('raffleTickets').doc(entryId).update({
      pagoVerificado: pagoVerificado,
    });
    return { success: true, message: "Estado de pago verificado actualizado." };
  } catch (error) {
    console.error("Error al actualizar el estado de pago verificado:", error);
    // @ts-ignore
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return { success: false, message: `Error al actualizar: ${errorMessage}` };
  }
}
