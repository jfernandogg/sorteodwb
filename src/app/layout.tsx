// This is the RootLayout for all routes
import type { Metadata } from 'next';
import './globals.css';

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
    // The lang attribute is managed by the LocaleLayout
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
