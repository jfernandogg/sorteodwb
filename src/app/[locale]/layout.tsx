import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import AppFooter from '@/components/AppFooter';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { NextIntlClientProvider } from 'next-intl';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Providing all messages to the client
  // side is a good default.
  const messages = await getMessages();
  unstable_setRequestLocale(locale);

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
