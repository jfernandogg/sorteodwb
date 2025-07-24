// This is the RootLayout for all routes
// It will wrap every page, including the internationalized and non-internationalized ones.

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Rifa Solidaria Living Center Medellín',
  description: 'Participa en la rifa para una estadía en el Centro de Budismo Camino del Diamante de Medellín.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The suppressHydrationWarning is important here because of next-intl
    // The lang attribute is managed by the LocaleLayout
    <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning>
      {/* The children will be either the [locale] layout or other page layouts */}
      {children}
      <Toaster />
    </body>
  );
}
