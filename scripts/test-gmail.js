// scripts/test-gmail.js
// Script de prueba para enviar un correo usando la API de Gmail
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { sendMail } = require('../scripts_tmp/gmail.js');

async function main() {
  try {
    console.log('GMAIL_SENDER_EMAIL:', process.env.GMAIL_SENDER_EMAIL);
    console.log('GMAIL_SERVICE_ACCOUNT_KEY:', process.env.GMAIL_SERVICE_ACCOUNT_KEY ? 'definido' : 'NO DEFINIDO');
    console.log('TEST_EMAIL_TO:', process.env.TEST_EMAIL_TO);
    const res = await sendMail({
      to: process.env.TEST_EMAIL_TO || 'destinatario@ejemplo.com',
      subject: 'Prueba de envío desde Gmail API',
      message: '<b>¡Funciona!</b> Este es un correo de prueba enviado desde el script test-gmail.js',
    });
    console.log('Correo enviado:', res);
  } catch (err) {
    console.error('Error enviando correo:', err);
    if (err && err.stack) {
      console.error(err.stack);
    }
  }
}

main();
