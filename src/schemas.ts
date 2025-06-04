import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];

export const RaffleFormSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido.'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos.'),
  email: z.string().email('Debe ser un correo electrónico válido.'),
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos.')
    .regex(/^(?:\+?57)?\d{10}$/, 'Debe ser un número de teléfono colombiano válido (ej: +573001234567 o 3001234567).'),
  stars: z.number().min(1, 'Debes seleccionar al menos una participación.').max(9, 'Puedes seleccionar máximo 9 participaciones.'),
  receipt: z.custom<File>((val) => val instanceof File, {
      message: 'El comprobante es requerido.',
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Solo se permiten archivos .jpg, .jpeg, .png, .pdf.'
    ),
});

export type RaffleFormValues = z.infer<typeof RaffleFormSchema>;

// Schema for partial validation before payment
export const PrePaymentFormSchema = RaffleFormSchema.pick({
  nombre: true,
  apellidos: true,
  email: true,
  telefono: true,
  stars: true,
});

export type PrePaymentFormValues = z.infer<typeof PrePaymentFormSchema>;
