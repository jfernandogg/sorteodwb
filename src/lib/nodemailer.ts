// src/lib/nodemailer.ts
// @ts-ignore
const nodemailer = require('nodemailer');

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!user || !pass) {
  throw new Error('Debes definir SMTP_USER y SMTP_PASS en tu .env.local');
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
