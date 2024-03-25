import { z } from 'zod';
import { customerSchema } from './customer.schema';
// import { addressSchema } from './address.schema';

const itemSchema = z.object({
  quantity: z.coerce
    .string()
    .trim()
    .min(1, 'Enter a number')
    .pipe(
      z.coerce
        .number({ invalid_type_error: 'Enter a number' })
        .min(1, 'Cannot be zero')
        .int('Enter a whole number')
    ),
  description: z.string().trim().min(1, 'Enter item description'),
  amount: z.coerce
    .string()
    .trim()
    .min(1, 'Enter a number')
    .pipe(z.coerce.number({ invalid_type_error: 'Enter a number' })),
});

export const invoiceSchema = z.object({
  // name: z.string().trim().min(1, 'Enter name'),
  // email: z
  //   .string()
  //   .trim()
  //   .min(1, 'Enter email address')
  //   .email('Enter valid email address'),
  // address: addressSchema,
  date: z.date(),
  paymentTerms: z
    .number()
    .or(z.string().trim().min(1))
    // .string()
    // .trim()
    // .min(1, 'Enter a number')
    .pipe(
      z.coerce
        .number({ invalid_type_error: 'Enter a number' })
        .nonnegative('Enter a positive number')
        .int('Enter a whole number')
    ),
  status: z.enum(['draft', 'pending', 'paid']).default('draft'), // TODO: implement partial zod schema for drafts
  customer: z.string().trim().min(1, 'Select customer'),
  newCustomer: customerSchema.optional(),
  items: z.array(itemSchema).min(1, 'Enter an item'),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const partialInvoiceSchema = invoiceSchema.deepPartial();
export type InvoiceDraft = z.infer<typeof partialInvoiceSchema>;

