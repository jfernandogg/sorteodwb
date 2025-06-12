import { google } from 'googleapis';

// Utilidad para enviar correos usando Gmail API con un usuario de servicio
// Requiere que el usuario de servicio tenga delegación de dominio y el correo del usuario real en GMAIL_SENDER_EMAIL

const GMAIL_SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL;
const GMAIL_SERVICE_ACCOUNT = process.env.GMAIL_SERVICE_ACCOUNT_KEY;

if (!GMAIL_SENDER_EMAIL) throw new Error('GMAIL_SENDER_EMAIL no está definido en las variables de entorno');
if (!GMAIL_SERVICE_ACCOUNT) throw new Error('GMAIL_SERVICE_ACCOUNT_KEY no está definido en las variables de entorno');

const serviceAccount = JSON.parse(GMAIL_SERVICE_ACCOUNT);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const auth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: SCOPES,
  subject: GMAIL_SENDER_EMAIL, // Para enviar como el usuario real
});

const gmail = google.gmail({ version: 'v1', auth });

export async function sendMail({
  to,
  subject,
  message,
  from = GMAIL_SENDER_EMAIL,
}: {
  to: string;
  subject: string;
  message: string;
  from?: string;
}) {
  // Construir el mensaje en formato RFC 5322 (raw)
  const raw = Buffer.from(
    `From: ${from}\nTo: ${to}\nSubject: ${subject}\nContent-Type: text/html; charset=utf-8\n\n${message}`
  ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw,
    },
  });
  return res.data;
}
