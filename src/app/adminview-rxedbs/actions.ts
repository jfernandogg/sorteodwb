"use server";

import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/firebaseServer';
import type { RaffleFormValues } from '@/schemas';

// Interface for the serializable timestamp
interface SerializableTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Define the structure of a raffle entry as it will be passed to the client
export interface ClientRaffleEntry extends RaffleFormValues {
  id: string; // MongoDB document ID
  ticketNumber: number;
  createdAt: SerializableTimestamp; // Use serializable timestamp
  clientIp?: string;
  pagoVerificado?: boolean; // Always true now, kept for compatibility
  participaEnSorteo: boolean; // New field for raffle participation status
}

// Original MongoDB entry structure (used internally in this server action)
interface MongoRaffleEntry extends RaffleFormValues {
  id: string;
  ticketNumber: number;
  createdAt: Date; // MongoDB Date
  clientIp?: string;
  pagoVerificado?: boolean; // Always true now, kept for compatibility
  participaEnSorteo: boolean; // New field for raffle participation status
}

interface AuthFetchResult {
  success: boolean;
  entries?: ClientRaffleEntry[];
  message?: string;
}

async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;
  const adminPassword = process.env.ADMIN_VIEW_PASSWORD?.replace(/^["']|["']$/g, '');
  return !!adminPassword && sessionToken === adminPassword;
}

export async function authenticateAndFetchEntries(password: string): Promise<AuthFetchResult> {
  const adminPassword = process.env.ADMIN_VIEW_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_VIEW_PASSWORD no está configurado en las variables de entorno.");
    return { success: false, message: "Error de configuración del servidor." };
  }

  // Remove quotes if present in the environment variable
  const cleanAdminPassword = adminPassword.replace(/^["']|["']$/g, '');

  if (password !== cleanAdminPassword) {
    return { success: false, message: "Contraseña incorrecta." };
  }

  // Establecer cookie de sesión segura para subsiguientes Server Actions
  const cookieStore = await cookies();
  cookieStore.set('admin_session', cleanAdminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hora
  });

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
        createdAt: {
          seconds: doc.createdAt instanceof Date ? doc.createdAt.getTime() / 1000 : 0,
          nanoseconds: 0,
        },
        clientIp: doc.clientIp || '',
        pagoVerificado: doc.pagoVerificado ?? true, 
        participaEnSorteo: doc.participaEnSorteo ?? true, // Default to true if not set
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
  // Verificar autenticación mediante cookie antes de proceder
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    return { success: false, message: "No autorizado." };
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

    // Forzar la actualización de la caché en las rutas relevantes
    revalidatePath('/adminview-rxedbs');
    // Usamos revalidatePath('/', 'layout') para limpiar la caché de todas las versiones localizadas
    revalidatePath('/', 'layout');
    return { success: true, message: "Estado de pago verificado actualizado." };
  } catch (error) {
    console.error("Error al actualizar el estado de pago verificado:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return { success: false, message: `Error al actualizar: ${errorMessage}` };
  }
}

interface UpdateParticipacionSorteoResult {
  success: boolean;
  message?: string;
}

export async function updateParticipacionSorteo(
  entryId: string,
  participaEnSorteo: boolean
): Promise<UpdateParticipacionSorteoResult> {
  // Verificar autenticación mediante cookie antes de proceder
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    return { success: false, message: "No autorizado." };
  }

  if (!entryId) {
    return { success: false, message: "ID de entrada no proporcionado." };
  }

  try {
    const db = await getDatabase();
    const result = await db.collection('raffleTickets').updateOne(
      { _id: new ObjectId(entryId) },
      { $set: { participaEnSorteo: participaEnSorteo } }
    );
    console.log(`[Admin Debug] Update participacion ID ${entryId}: ${result.modifiedCount} documentos modificados.`);

    // Forzar la actualización de la caché en las rutas relevantes
    revalidatePath('/adminview-rxedbs');
    // Limpia la caché global para que /es/sorteo y otras rutas vean los cambios inmediatamente
    revalidatePath('/', 'layout');
    return { success: true, message: "Estado de participación en sorteo actualizado." };
  } catch (error) {
    console.error("Error al actualizar el estado de participación en sorteo:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return { success: false, message: `Error al actualizar: ${errorMessage}` };
  }
}
