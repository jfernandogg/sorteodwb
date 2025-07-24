// app/components/Providers.tsx
'use client';

import { NextIntlClientProvider } from 'next-intl';

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: any; // You can use a more specific type if you have one
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
