import { z } from 'zod';

// We use a function to create the schema, so we can pass in the translation function `t`
export const createRaffleFormSchema = (t: (key: string) => string) => z.object({
  nombre: z.string().min(1, t('name_required')),
  apellidos: z.string().min(1, t('lastname_required')),
  email: z.string().email(t('email_invalid')),
  telefono: z.string().regex(/^\+\d{7,15}$/, t('phone_invalid')),
  stars: z.number().min(1, t('stars_min')).max(9, t('stars_max')),
});

// We need a base type that doesn't depend on the translation function
const BaseRaffleFormSchema = createRaffleFormSchema((key: string) => key);
export type RaffleFormValues = z.infer<typeof BaseRaffleFormSchema>;
