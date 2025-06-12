// src/lib/nodemailer.ts
// @ts-ignore
const nodemailer = require('nodemailer');
import { getEnv } from './firebaseEnv';

const user = getEnv('smtp.user');
const pass = getEnv('smtp.pass');
const serviceAccount = getEnv('fb_service_account');

if (!user || !pass) {
  throw new Error('Debes definir smtp.user y smtp.pass en las variables de entorno o en Firebase Functions config');
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
