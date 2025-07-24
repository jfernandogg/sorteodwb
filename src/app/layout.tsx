// This is the RootLayout for all routes
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import AppFooter from '@/components/AppFooter';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Image from 'next/image';


export const metadata: Metadata = {
  title: 'Rifa Solidaria Living Center Medellín',
  description: 'Participa en la rifa para una estadía en el Centro de Budismo Camino del Diamante de Medellín.',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    // The suppressHydrationWarning is important here because of next-intl
    // The lang attribute is managed by the LocaleLayout
    <html lang={locale} suppressHydrationWarning>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="w-full">
            <Image
              src="/banner.svg"
              alt="Rifa Solidaria Living Center Banner"
              width={680}
              height={75}
              className="w-full h-auto object-cover"
              priority
            />
            <LanguageSwitcher />
          </header>
          {children}
          <AppFooter />
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}