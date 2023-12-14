import { z } from 'zod';
import { addressSchema } from './address.schema';

export const customerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Enter a valid email address'),
    address: addressSchema,
  }),
});

export type CustomerInput = z.infer<typeof customerSchema>;

