import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];

const FileSchema = typeof window === 'undefined' 
  ? z.any() 
  : z.instanceof(File, { message: 'A receipt is required.' });

// We use a function to create the schema, so we can pass in the translation function `t`
export const createRaffleFormSchema = (t: (key: string) => string) => z.object({
  nombre: z.string().min(1, t('name_required')),
  apellidos: z.string().min(1, t('lastname_required')),
  email: z.string().email(t('email_invalid')),
  telefono: z.string()
    .min(10, t('phone_min'))
    .regex(/^(?:\+?57)?\d{10}$/, t('phone_invalid')),
  stars: z.number().min(1, t('stars_min')).max(9, t('stars_max')),
  receipt: FileSchema
    .refine((file) => file, t('receipt_required'))
    .refine((file) => file.size <= MAX_FILE_SIZE, t('receipt_max_size'))
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      t('receipt_invalid_type')
    ),
});

// We need a base type that doesn't depend on the translation function
const BaseRaffleFormSchema = createRaffleFormSchema((key: string) => key);
export type RaffleFormValues = z.infer<typeof BaseRaffleFormSchema>;

// Schema for partial validation before payment
export const PrePaymentFormSchema = BaseRaffleFormSchema.pick({
  nombre: true,
  apellidos: true,
  email: true,
  telefono: true,
  stars: true,
});

export type PrePaymentFormValues = z.infer<typeof PrePaymentFormSchema>;
