
"use client";

import type * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRECIO_POR_TICKET, PAYMENT_PHP_ENDPOINT_BASE_URL } from '@/config';
import { RaffleFormSchema, RaffleFormValues } from '@/schemas';
import { submitRaffleTicket, type SubmitRaffleResult } from '@/app/actions';
import { StarSelector } from '@/components/StarSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // ShadCN Label
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // ShadCN Select
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle2, Banknote, CreditCard } from 'lucide-react';

interface RaffleFormProps {
  onSubmitSuccess: () => void;
}

type PaymentMethod = 'transfer' | 'card';

export function RaffleForm({ onSubmitSuccess }: RaffleFormProps) {
  const [selectedStars, setSelectedStars] = useState(1);
  const [totalCOP, setTotalCOP] = useState(selectedStars * PRECIO_POR_TICKET);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const { toast } = useToast();

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
        title: "Redireccionando a Pago",
        description: "Se ha abierto una nueva pestaña para completar el pago con Bold. Sube tu comprobante al regresar.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Error de Validación",
        description: "Por favor, corrige los campos marcados en rojo antes de proceder al pago.",
        variant: "destructive",
        duration: 5000,
      });
    }
    setIsPaying(false);
  };

  const onSubmit = async (values: RaffleFormValues) => {
    setIsSubmitting(true);
    if (!values.receipt) {
      form.setError('receipt', { type: 'manual', message: 'El comprobante es requerido.' });
      setIsSubmitting(false);
      return;
    }

    const result: SubmitRaffleResult = await submitRaffleTicket(
      values,
      values.receipt
    );

    if (result.success) {
      toast({
        title: "¡Participación Exitosa!",
        description: result.message,
        action: <CheckCircle2 className="text-green-500" />,
        duration: 7000,
      });
      onSubmitSuccess();
    } else {
      toast({
        title: "Error en la Participación",
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
        <CardTitle className="text-3xl font-headline text-center text-primary">Rifa Solidaria</CardTitle>
        <CardDescription className="text-center">
          Participa por una estadía en el Living Center Medellín.
          <br />
          Completa tus datos, selecciona tus participaciones y ¡mucha suerte!
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
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
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
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input placeholder="Tus apellidos" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@correo.com" {...field} />
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
                  <FormLabel>Teléfono (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+573001234567" {...field} />
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
                  <FormLabel>Número de Participaciones (1-9)</FormLabel>
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
              Total: {totalCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
            </div>

            <FormItem>
              <FormLabel>Forma de Pago</FormLabel>
              <Select onValueChange={(value: PaymentMethod) => setPaymentMethod(value)} defaultValue={paymentMethod}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una forma de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="card">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Tarjeta de Crédito/PSE (Bold)
                    </div>
                  </SelectItem>
                  <SelectItem value="transfer">
                    <div className="flex items-center">
                      <Banknote className="mr-2 h-4 w-4" />
                      Transferencia Bancolombia
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>

            {paymentMethod === 'card' && (
              <Button type="button" onClick={handlePagar} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPaying || isSubmitting}>
                {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                Pagar con Tarjeta/PSE ({totalCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })})
              </Button>
            )}

            {paymentMethod === 'transfer' && (
              <div className="p-4 border rounded-md bg-blue-50 border-blue-200 text-blue-800">
                <h4 className="font-semibold text-lg mb-2">Instrucciones para Transferencia Bancolombia:</h4>
                <p className="text-sm">Por favor, realiza la transferencia por <strong>{totalCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</strong> a la siguiente cuenta:</p>
                <ul className="list-disc list-inside my-2 text-sm">
                  <li><strong>Cuenta de Ahorros Bancolombia:</strong> [TU NÚMERO DE CUENTA AQUÍ]</li>
                  <li><strong>Nombre del titular:</strong> [NOMBRE DEL TITULAR AQUÍ]</li>
                  <li><strong>NIT/C.C.:</strong> [NIT/C.C. DEL TITULAR AQUÍ]</li>
                  <li><strong>Concepto/Referencia:</strong> Rifa Living Center + Tu Nombre</li>
                </ul>
                <p className="text-sm mt-2">
                  Una vez realizada la transferencia, guarda el comprobante y súbelo en el campo de abajo.
                </p>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground text-center">
              Después de pagar o transferir, regresa a esta página y sube tu comprobante.
            </p>

            <FormField
              control={form.control}
              name="receipt"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Comprobante de Pago/Transferencia (.jpg, .png, .pdf - Máx 5MB)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                      {...rest} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting || (paymentMethod === 'card' && isPaying)}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar Participación y Comprobante
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
          Al participar aceptas los términos y condiciones de la rifa.
        </p>
      </CardFooter>
    </Card>
  );
}
