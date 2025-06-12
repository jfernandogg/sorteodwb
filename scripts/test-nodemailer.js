// scripts/test-nodemailer.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { sendMail } = require('../scripts_tmp/nodemailer.js');

console.log('Tipo de sendMail:', typeof sendMail);

async function main() {
  try {
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'definido' : 'NO DEFINIDO');
    console.log('TEST_EMAIL_TO:', process.env.TEST_EMAIL_TO);
    const res = await sendMail({
      to: process.env.TEST_EMAIL_TO || 'destinatario@ejemplo.com',
      subject: 'Prueba de envío con nodemailer',
      html: '<b>¡Funciona!</b> Este es un correo de prueba enviado con nodemailer.',
      text: '¡Funciona! Este es un correo de prueba enviado con nodemailer.'
    });
    console.log('Correo enviado:', res.response);
  } catch (err) {
    console.error('Error enviando correo:', err);
    if (err && err.stack) {
      console.error(err.stack);
    }
  }
}

main();
