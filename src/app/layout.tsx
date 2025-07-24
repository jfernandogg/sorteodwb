import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// This is the root layout. It does not have access to the `locale` param
// directly, but the nested layout will pass it through the children.
// The lang attribute will be set on the <html> tag in the [locale]/layout.tsx file.

export const metadata: Metadata = {
  title: 'Rifa Solidaria Living Center Medellín',
  description: 'Participa en la rifa para una estadía en el Centro de Budismo Camino del Diamante de Medellín.',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string }; // Accept locale here
}

export default function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  return (
    // The lang attribute is now correctly set here from the params
    <html lang={locale} suppressHydrationWarning>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
