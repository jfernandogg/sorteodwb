
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Image from 'next/image';

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
    <html lang="es" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <header className="w-full">
          {/* Asumiendo que la imagen SVG está en public/banner.svg */}
          {/* Las dimensiones 680x75 son para la relación de aspecto, el SVG escalará */}
          <Image
            src="/banner.svg" 
            alt="Rifa Solidaria Living Center Banner"
            width={680} 
            height={75} 
            className="w-full h-auto object-cover" // w-full hace que ocupe el ancho, h-auto mantiene la proporción
            priority
          />
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
