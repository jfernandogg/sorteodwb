'use client';

import { NextIntlClientProvider } from 'next-intl';

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: any;
};

export default function Providers({
  children,
  locale,
  messages,
}: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
