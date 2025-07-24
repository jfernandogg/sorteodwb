"use client";

import { useState } from 'react';
import { RaffleForm } from './RaffleForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function RafflePageClientContent() {
  const t = useTranslations('SuccessPage');
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
            <CardTitle className="text-3xl font-headline text-primary">{t('title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg mb-6" style={{ whiteSpace: 'pre-line' }}>
              {t('description')}
            </CardDescription>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/">{t('backButton')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RaffleForm onSubmitSuccess={handleFormSubmitSuccess} />;
}
