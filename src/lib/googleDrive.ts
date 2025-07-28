// @ts-ignore - googleapis types may not be installed in all environments
import { google } from 'googleapis';
import { getEnv } from './firebaseEnv'; // Uses the simplified getEnv
import { Readable } from 'stream';

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

// Imprimir el email de la cuenta de servicio
console.log('Usando cuenta de servicio:', credentials.client_email);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const drive = google.drive({ version: 'v3', auth });

export async function uploadReceipt(file: File) {
  const folderId = getEnv('GOOGLE_DRIVE_FOLDER_ID');
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID no está definido.');
  }

  // Preparar el archivo para subir
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  try {
    // Primero verificamos si podemos acceder a la carpeta
    try {
      await drive.files.get({
        fileId: folderId,
        fields: 'id, capabilities',
        supportsAllDrives: true
      });
    } catch (folderError) {
      console.error('Error al acceder a la carpeta:', folderError);
      throw new Error('No se puede acceder a la carpeta de destino');
    }

    // Subir el archivo especificando que es para una carpeta compartida
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
      },
      media: {
        mimeType: file.type,
        body: stream
      },
      fields: 'id, webViewLink',
      supportsAllDrives: true,
      keepRevisionForever: false
    });

    // En Unidades Compartidas, los permisos se heredan de la carpeta contenedora.
    // No es necesario (y causa un error) establecerlos explícitamente en el archivo.

    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink
    };
  } catch (error: any) {
    console.error('Error detallado:', {
      message: error.message,
      code: error.code,
      errors: error.errors,
      config: {
        folderId,
        fileName: file.name,
        serviceAccount: credentials.client_email
      }
    });
    
    throw new Error(`Error al subir archivo: ${error.message}`);
  }
}
