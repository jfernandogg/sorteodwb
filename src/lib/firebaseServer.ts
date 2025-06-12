import 'server-only';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;
if (!getApps().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not set');
  }
  console.log('[firebaseServer] project_id:', serviceAccount.project_id);
  app = initializeApp({ credential: cert(serviceAccount) });
} else {
  app = getApps()[0];
}

// Permitir especificar el nombre de la base de datos por variable de entorno o usar 'dwbrifa' por defecto
const databaseId = process.env.FIRESTORE_DATABASE_ID || 'dwbrifa';
console.log('[firebaseServer] databaseId:', databaseId);

// getFirestore puede recibir el ID de la base de datos como segundo argumento
export const firestore = getFirestore(app, databaseId);
