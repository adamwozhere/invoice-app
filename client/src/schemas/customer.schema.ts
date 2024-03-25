import { z } from 'zod';
import { addressSchema } from './address.schema';

export const customerSchema = z.object({
  name: z.string().trim().min(2, 'Enter name'),
  email: z
    .string({ required_error: 'Enter email address' })
    .email('Enter a valid email address'),
  address: addressSchema,
});

export interface CustomerInput extends z.infer<typeof customerSchema> {
  id?: string;
}
