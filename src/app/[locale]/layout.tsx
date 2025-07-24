import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AppFooter from '@/components/AppFooter';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rifa Solidaria Living Center Medellín',
  description: 'Participa en la rifa para una estadía en el Centro de Budismo Camino del Diamante de Medellín.',
};

export default async function LocaleLayout({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
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