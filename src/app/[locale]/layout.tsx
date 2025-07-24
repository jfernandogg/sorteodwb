import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Can be imported from a shared config
const locales = ['en', 'es'];
 
export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

// Metadata can be defined here to be locale-specific if needed,
// but the root metadata will serve as a fallback.
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
    <>
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
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </>
  );
}