// scripts/init-raffleTickets.js
// Script para inicializar la colección raffleTickets en Firestore
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { firestore } = require('../scripts_tmp/firebaseServer.js');

async function main() {
  try {
    const docRef = await firestore.collection('raffleTickets').add({
      email: 'ejemplo@correo.com',
      ticketNumber: 1,
      receiptName: 'comprobante_ejemplo.pdf',
      receiptMimeType: 'application/pdf',
      receiptSize: 12345,
      receiptUrl: 'https://ejemplo.com/comprobante.pdf',
      receiptDriveId: 'id_drive_ejemplo',
      createdAt: new Date(),
      clientIp: '127.0.0.1',
    });
    console.log('Documento creado con ID:', docRef.id);
  } catch (err) {
    console.error('Error inicializando la colección:', err);
  }
}

main();
