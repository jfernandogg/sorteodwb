// This is the RootLayout for all routes
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import {unstable_setRequestLocale} from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Rifa Solidaria Living Center Medellín',
  description: 'Participa en la rifa para una estadía en el Centro de Budismo Camino del Diamante de Medellín.',
};

export default function RootLayout({
  children,
  params: {locale},
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
