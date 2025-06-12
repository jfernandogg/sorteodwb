// @ts-ignore - googleapis types may not be installed in all environments
import { google } from 'googleapis';
import { getEnv } from './firebaseEnv'; // Uses the simplified getEnv

// Expects FB_SERVICE_ACCOUNT in .env.local or server environment
const credentialsJson = getEnv('FB_SERVICE_ACCOUNT'); 

let credentials;
if (credentialsJson) {
  try {
    credentials = JSON.parse(credentialsJson);
  } catch (e) {
    console.error("Failed to parse FB_SERVICE_ACCOUNT JSON:", e);
    throw new Error('FB_SERVICE_ACCOUNT no es un JSON válido.');
  }
}

if (!credentials) {
  throw new Error('FB_SERVICE_ACCOUNT no está definido en las variables de entorno.');
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const drive = google.drive({ version: 'v3', auth });
