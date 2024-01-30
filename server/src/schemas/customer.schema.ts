import { z } from 'zod';
import { addressSchema } from './address.schema';
import { objectIdSchema } from './objectId.schema';

export const customerBody = {
  body: z.object({
    // TODO: should strings be .trim() trimmed?
    name: z.string({ required_error: 'Name is required' }).min(2).max(35),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Enter a valid email address'),
    address: addressSchema,
  }),
};

export const customerParams = {
  params: z.object({
    id: objectIdSchema,
  }),
};

// export type CustomerInput = z.infer<typeof customerSchema>;

export const createCustomerSchema = z.object({
  ...customerBody,
});

export const deleteCustomerSchema = z.object({
  ...customerParams,
});

export const getCustomerByIdSchema = z.object({
  ...customerParams,
});

export const editCustomerSchema = z.object({
  ...customerBody,
  ...customerParams,
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type DeleteCustomerInput = z.infer<typeof deleteCustomerSchema>;
export type GetCustomerByIdInput = z.infer<typeof getCustomerByIdSchema>;
export type EditCustomerInput = z.infer<typeof editCustomerSchema>;

