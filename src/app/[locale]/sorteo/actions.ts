'use server';

import { getDatabase } from '@/lib/firebaseServer';
import { unstable_noStore as noStore } from 'next/cache';

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
  // Desactiva la caché de disco y memoria de Next.js para esta función
  noStore();

  try {
    const db = await getDatabase();
    
    // Log crítico: Si no ves esto en la consola de Docker al refrescar, la caché sigue activa
    console.log(`[EJECUTANDO_ACCION] Cargando participantes desde: ${db.databaseName}`);

    // EXPLÍCITO: Solo registros que sean 'true' o que no tengan el campo
    const query = { 
      $or: [
        { participaEnSorteo: true },
        { participaEnSorteo: { $exists: false } }
      ] 
    };
    const participantsCursor = db.collection('raffleTickets').find(query);
    
    const participantsArray = await participantsCursor.toArray();

    console.log(`--- [SORTEO_V4_FIX] ${new Date().toISOString()} ---`);
    console.log(`Registros encontrados en DB: ${participantsArray.length}`);
    participantsArray.forEach((p: any) => {
      console.log(`> ID: ${p._id} | Nombre: ${p.nombre} | Estado: ${p.participaEnSorteo}`);
    });
    console.log(`--- FIN DE CARGA SORTEO ---`);

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
