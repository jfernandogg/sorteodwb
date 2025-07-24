import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import Image from 'next/image';

// Can be imported from a shared config
const locales = ['en', 'es'];
 
export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  title: 'Rifa Solidaria Living Center Medellín',
  description: 'Participa en la rifa para una estadía en el Centro de Budismo Camino del Diamante de Medellín.',
};

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <header className="w-full">
            <Image
              src="/banner.svg" 
              alt="Rifa Solidaria Living Center Banner"
              width={680} 
              height={75} 
              className="w-full h-auto object-cover"
              priority
            />
          </header>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
