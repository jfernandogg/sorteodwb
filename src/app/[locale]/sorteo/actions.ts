'use server';

import { getDatabase } from '@/lib/firebaseServer';

export interface VerifiedParticipant {
  id: string;
  nombre: string;
  apellidos: string;
  email: string; // Keep email for potential future use (e.g., notifying winner directly)
  stars: number; // Number of entries
}

interface FetchParticipantsResult {
  success: boolean;
  participants?: VerifiedParticipant[];
  message?: string;
}

export async function fetchVerifiedParticipantsForSorteo(): Promise<FetchParticipantsResult> {
  try {
    const db = await getDatabase();
    const participantsCursor = db.collection('raffleTickets').find({ pagoVerificado: true });
    const participantsArray = await participantsCursor.toArray();

    if (participantsArray.length === 0) {
      return { success: true, participants: [] };
    }

    const participants: VerifiedParticipant[] = participantsArray.map((doc: any) => {
      return {
        id: doc._id.toString(),
        nombre: doc.nombre || '',
        apellidos: doc.apellidos || '',
        email: doc.email || '',
        stars: doc.stars || 0,
      };
    });

    return { success: true, participants };
  } catch (error) {
    console.error("Error al obtener los participantes verificados para el sorteo:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar participantes.";
    return { success: false, message: `Error al cargar participantes: ${errorMessage}` };
  }
}
