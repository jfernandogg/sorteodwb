
'use server';

import { firestore } from '@/lib/firebaseServer';

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
    const snapshot = await firestore
      .collection('raffleTickets')
      .where('pagoVerificado', '==', true)
      .get();

    if (snapshot.empty) {
      return { success: true, participants: [] };
    }

    const participants: VerifiedParticipant[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        stars: data.stars,
      };
    });

    return { success: true, participants };
  } catch (error) {
    console.error("Error al obtener los participantes verificados para el sorteo:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar participantes.";
    return { success: false, message: `Error al cargar participantes: ${errorMessage}` };
  }
}
