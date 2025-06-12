// src/lib/nodemailer.ts
// @ts-ignore
const nodemailer = require('nodemailer');
import { getEnv } from './firebaseEnv'; // Uses the simplified getEnv

// Expects SMTP_USER and SMTP_PASS in .env.local or server environment
const user = getEnv('SMTP_USER');
const pass = getEnv('SMTP_PASS');
// const serviceAccount = getEnv('FB_SERVICE_ACCOUNT'); // This was unused here

if (!user || !pass) {
  throw new Error('Debes definir SMTP_USER y SMTP_PASS en las variables de entorno.');
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass },
});

export async function sendMail({ to, subject, html, text, from = user }: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}) {
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}
