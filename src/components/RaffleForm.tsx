
"use client";

import type * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRECIO_POR_TICKET, PAYMENT_PHP_ENDPOINT_BASE_URL } from '@/config';
import { createRaffleFormSchema, RaffleFormValues } from '@/schemas';
import { submitRaffleTicket, type SubmitRaffleResult } from '@/app/actions';
import { StarSelector } from '@/components/StarSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle2, Banknote, CreditCard, UploadCloud } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface RaffleFormProps {
  onSubmitSuccess: () => void;
}

type PaymentMethod = 'transfer' | 'card';

export function RaffleForm({ onSubmitSuccess }: RaffleFormProps) {
  const t = useTranslations('RaffleForm');
  const tZod = useTranslations('ZodErrors');
  const [selectedStars, setSelectedStars] = useState(1);
  const [totalCOP, setTotalCOP] = useState(selectedStars * PRECIO_POR_TICKET);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
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
      receipt: undefined,
    },
  });

  const handleStarChange = (stars: number) => {
    setSelectedStars(stars);
    setTotalCOP(stars * PRECIO_POR_TICKET);
    form.setValue('stars', stars, { shouldValidate: true });
  };

  const handlePagar = async () => {
    setIsPaying(true);
    const prePaymentFields: (keyof RaffleFormValues)[] = ['nombre', 'apellidos', 'email', 'telefono', 'stars'];
    const isValid = await form.trigger(prePaymentFields);

    if (isValid) {
      const values = form.getValues();
      const amount = values.stars * PRECIO_POR_TICKET;
      const description = `Rifa Solidaria - ${values.stars} participaciones`;
      
      let paymentUrl = PAYMENT_PHP_ENDPOINT_BASE_URL;
      if (paymentUrl.includes('?')) {
        paymentUrl += '&';
      } else {
        paymentUrl += '?';
      }
      paymentUrl += `monto=${amount}&descripcion=${encodeURIComponent(description)}`;

      window.open(paymentUrl, '_blank');
      toast({
        title: t('redirectToastTitle'),
        description: t('redirectToastDescription'),
        duration: 5000,
      });
    } else {
      toast({
        title: t('validationErrorToastTitle'),
        description: t('validationErrorToastDescription'),
        variant: "destructive",
        duration: 5000,
      });
    }
    setIsPaying(false);
  };

  const onSubmit = async (values: RaffleFormValues) => {
    setIsSubmitting(true);
    if (!values.receipt) {
      form.setError('receipt', { type: 'manual', message: tZod('receipt_required') });
      setIsSubmitting(false);
      return;
    }

    const result: SubmitRaffleResult = await submitRaffleTicket(
      values,
      values.receipt
    );

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

  const totalFormatted = `${totalCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })} COP`;

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
            
            <div className="text-center text-2xl font-bold p-4 bg-secondary/50 rounded-md">
              {t('totalLabel')} {totalFormatted}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {t('conversionNote', {
                usd: (totalCOP / 4000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }),
                eur: (totalCOP / 5000).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })
              })}
            </div>

            <FormItem>
              <FormLabel>{t('paymentMethodLabel')}</FormLabel>
              <Select onValueChange={(value: PaymentMethod) => setPaymentMethod(value)} defaultValue={paymentMethod}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('paymentMethodPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="card">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t('cardPayment')}
                    </div>
                  </SelectItem>
                  <SelectItem value="transfer">
                    <div className="flex items-center">
                      <Banknote className="mr-2 h-4 w-4" />
                      {t('transferPayment')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>

            {paymentMethod === 'card' && (
              <Button type="button" onClick={handlePagar} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPaying || isSubmitting}>
                {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                {t('payWithCardButton', { total: totalFormatted })}
              </Button>
            )}

            {paymentMethod === 'transfer' && (
              <div className="p-4 border rounded-md bg-blue-50 border-blue-200 text-blue-800">
                <h4 className="font-semibold text-lg mb-2">{t('transferInstructionsTitle')}</h4>
                <p className="text-sm">{t('transferInstructionsLine1', { total: totalFormatted })}</p>
                <ul className="list-disc list-inside my-2 text-sm">
                  <li><strong>{t('transferInstructionsLine2').split(': ')[0]}:</strong> {t('transferInstructionsLine2').split(': ')[1]}</li>
                  <li><strong>{t('transferInstructionsLine3').split(': ')[0]}:</strong> {t('transferInstructionsLine3').split(': ')[1]}</li>
                  <li><strong>{t('transferInstructionsLine4').split(': ')[0]}:</strong> {t('transferInstructionsLine4').split(': ')[1]}</li>
                  <li><strong>{t('transferInstructionsLine5').split(': ')[0]}:</strong> {t('transferInstructionsLine5').split(': ')[1]}</li>
                </ul>
                <p className="text-sm mt-2">
                  {t('transferInstructionsLine6')}
                </p>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground text-center">
              {t('afterPaymentNote')}
            </p>

            <div className="mt-4 p-4 border-2 border-dashed border-primary rounded-lg bg-primary/10 text-center">
              <UploadCloud className="h-10 w-10 text-primary mx-auto mb-2" />
              <p className="text-lg font-semibold text-primary mb-1">
                {t('uploadTitle')}
              </p>
              <p className="text-sm text-foreground">
                {t('uploadDescription')}
              </p>
            </div>

            <FormField
              control={form.control}
              name="receipt"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem className="mt-2">
                  <FormLabel className="sr-only">{t('uploadLabel')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                      {...rest} 
                      className="border-border shadow-sm hover:border-primary focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting || (paymentMethod === 'card' && isPaying)}>
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
