import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// This is the root layout. It does not have access to the `locale` param.
// It's responsible for the overall HTML structure.

export const metadata: Metadata = {
  title: 'Rifa Solidaria Living Center Medellín',
  description: 'Participa en la rifa para una estadía en el Centro de Budismo Camino del Diamante de Medellín.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    // The lang attribute will be set in the [locale]/layout.tsx file
    <html suppressHydrationWarning>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
