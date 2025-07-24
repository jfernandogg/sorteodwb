import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = await getLocale();
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
    </NextIntlClientProvider>
  );
}