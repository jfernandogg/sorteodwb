import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AppFooter from '@/components/AppFooter';

export default async function LocaleLayout({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
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
  );
}
