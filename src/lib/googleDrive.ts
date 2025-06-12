// @ts-ignore - googleapis types may not be installed in all environments
import { google } from 'googleapis';
import { getEnv } from './firebaseEnv';

const credentials = getEnv('fb_service_account')
  ? JSON.parse(getEnv('fb_service_account') as string)
  : undefined;
if (!credentials) {
  throw new Error('fb_service_account no está definido en las variables de entorno o en Firebase Functions config');
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const drive = google.drive({ version: 'v3', auth });
