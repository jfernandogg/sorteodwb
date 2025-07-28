"use server";

import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/firebaseServer';
import type { RaffleFormValues } from '@/schemas';

// Interface for the serializable timestamp
interface SerializableTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Define the structure of a raffle entry as it will be passed to the client
export interface ClientRaffleEntry extends Omit<RaffleFormValues, 'receipt'> {
  id: string; // MongoDB document ID
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

// Original MongoDB entry structure (used internally in this server action)
interface MongoRaffleEntry extends Omit<RaffleFormValues, 'receipt'> {
  id: string;
  ticketNumber: number;
  receiptDriveId?: string;
  receiptName?: string;
  receiptMimeType?: string;
  receiptSize?: number;
  receiptUrl?: string;
  createdAt: Date; // MongoDB Date
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
    const db = await getDatabase();
    const entriesCursor = db.collection('raffleTickets').find().sort({ ticketNumber: -1 });
    const entriesArray = await entriesCursor.toArray();

    const entries: ClientRaffleEntry[] = entriesArray.map((doc: any) => {
      return {
        id: doc._id.toString(),
        nombre: doc.nombre || '',
        apellidos: doc.apellidos || '',
        email: doc.email || '',
        telefono: doc.telefono || '',
        stars: doc.stars || 0,
        ticketNumber: doc.ticketNumber || 0,
        receiptDriveId: doc.receiptDriveId || '',
        receiptName: doc.receiptName || '',
        receiptMimeType: doc.receiptMimeType || '',
        receiptSize: doc.receiptSize || 0,
        receiptUrl: doc.receiptUrl || '',
        createdAt: {
          seconds: doc.createdAt?.getTime() / 1000 || 0,
          nanoseconds: 0,
        },
        clientIp: doc.clientIp || '',
        pagoVerificado: doc.pagoVerificado || false,
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
  const adminPassword = process.env.ADMIN_VIEW_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_VIEW_PASSWORD no está configurado.");
    return { success: false, message: "Error de configuración del servidor." };
  }

  if (!entryId) {
    return { success: false, message: "ID de entrada no proporcionado." };
  }

  try {
    const db = await getDatabase();
    await db.collection('raffleTickets').updateOne(
      { _id: new ObjectId(entryId) },
      { $set: { pagoVerificado: pagoVerificado } }
    );
    return { success: true, message: "Estado de pago verificado actualizado." };
  } catch (error) {
    console.error("Error al actualizar el estado de pago verificado:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return { success: false, message: `Error al actualizar: ${errorMessage}` };
  }
}
