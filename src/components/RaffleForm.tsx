
"use client";

import { useParams } from 'next/navigation';
import type * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRaffleFormSchema, RaffleFormValues } from '@/schemas';
import { submitRaffleTicket, type SubmitRaffleResult } from '@/app/actions';
import { StarSelector } from '@/components/StarSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface RaffleFormProps {
  onSubmitSuccess: () => void;
}


export function RaffleForm({ onSubmitSuccess }: RaffleFormProps) {
  const t = useTranslations('RaffleForm');
  const tZod = useTranslations('ZodErrors');
  const [selectedStars, setSelectedStars] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const RaffleFormSchema = createRaffleFormSchema(tZod);

  const form = useForm<RaffleFormValues>({
    resolver: zodResolver(RaffleFormSchema),
    defaultValues: {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      stars: 1,
    },
  });

  const handleStarChange = (stars: number) => {
    setSelectedStars(stars);
    form.setValue('stars', stars, { shouldValidate: true });
  };

  const { locale } = useParams();

  const onSubmit = async (values: RaffleFormValues) => {
    console.log('[RaffleForm] Iniciando envío del formulario:', {
      locale: typeof locale === 'string' ? locale : 'es'
    });

    setIsSubmitting(true);

    const result: SubmitRaffleResult = await submitRaffleTicket(
      values,
      typeof locale === 'string' ? locale : 'es'
    );

    console.log('[RaffleForm] Resultado del envío:', {
      success: result.success,
      message: result.message,
      ticketNumber: result.ticketNumber
    });

    if (result.success) {
      toast({
        title: t('submitSuccessToastTitle'),
        description: result.message,
        action: <CheckCircle2 className="text-green-500" />,
        duration: 7000,
      });
      onSubmitSuccess();
    } else {
      toast({
        title: t('submitErrorToastTitle'),
        description: result.message,
        variant: "destructive",
        action: <AlertTriangle className="text-yellow-500" />,
        duration: 7000,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center text-primary">{t('title')}</CardTitle>
        <CardDescription className="text-center" style={{whiteSpace: 'pre-line'}}>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('lastNameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('lastNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phoneLabel')}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t('phonePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ticketsLabel')}</FormLabel>
                  <FormDescription className="text-center px-4">
                    {t('ticketsDescription')}
                  </FormDescription>
                  <FormControl>
                    <StarSelector
                      value={field.value}
                      onChange={handleStarChange}
                      className="justify-center py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total informativo */}
            <div className="text-center py-4">
              <p className="text-lg font-semibold">
                {t('totalLabel')} ${new Intl.NumberFormat('es-CO').format(selectedStars * parseInt(process.env.NEXT_PUBLIC_PRECIO_POR_TICKET || '40000'))} COP
              </p>
              <p className="text-sm text-muted-foreground">
                {t('conversionNote', {
                  usd: ((selectedStars * parseInt(process.env.NEXT_PUBLIC_PRECIO_POR_TICKET || '40000')) / 4000).toFixed(2),
                  eur: ((selectedStars * parseInt(process.env.NEXT_PUBLIC_PRECIO_POR_TICKET || '40000')) / 4500).toFixed(2)
                })}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? t('submittingButton') : t('submitButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
          {t('terms')}
        </p>
      </CardFooter>
    </Card>
  );
}
