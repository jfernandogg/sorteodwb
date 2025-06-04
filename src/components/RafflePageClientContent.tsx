"use client";

import { useState } from 'react';
import { RaffleForm } from './RaffleForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function RafflePageClientContent() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmitSuccess = () => {
    setFormSubmitted(true);
  };

  if (formSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-headline text-primary">¡Gracias por Participar!</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg mb-6">
              Tu participación ha sido registrada exitosamente.
              Recibirás un correo electrónico de confirmación en breve con los detalles y tu comprobante.
              <br/><br/>
              ¡Mucha suerte en la rifa!
            </CardDescription>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RaffleForm onSubmitSuccess={handleFormSubmitSuccess} />;
}
