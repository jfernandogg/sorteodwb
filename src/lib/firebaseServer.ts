// @ts-ignore - firebase-admin types may not be installed in all environments
import { cert, getApps, initializeApp } from 'firebase-admin/app';
// @ts-ignore - firebase-admin types may not be installed in all environments
import { getFirestore } from 'firebase-admin/firestore';

let app;
if (!getApps().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not set');
  }
  app = initializeApp({ credential: cert(serviceAccount) });
} else {
  app = getApps()[0];
}

export const firestore = getFirestore(app);
