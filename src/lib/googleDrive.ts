// @ts-ignore - googleapis types may not be installed in all environments
import { google } from 'googleapis';

const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;
if (!credentials) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not set');
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const drive = google.drive({ version: 'v3', auth });
