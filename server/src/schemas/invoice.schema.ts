import { z } from 'zod';
// import { customerSchema } from './customer.schema';

// TODO: invoice status: 'draft' | 'pending' | 'paid'
// TODO: invoice date, due date - or payment terms date?
// TODO: discount?
// TODO: vat?
// TODO: totals (items and grand todal) - calculate and add on refine? or add on client and validate on refine?

export const itemSchema = z.object({
  quantity: z.coerce
    .number({ required_error: 'Enter quantity' })
    .int('Enter a whole number')
    .min(1, 'Quantity cannot be less than 1'),
  description: z.string({ required_error: 'Enter description' }),
  amount: z.coerce
    .number({ required_error: 'Enter amount' })
    .nonnegative('Amount cannot be a negative value'),
});

// 24 character hexadecimal string compatible with mongoose.ObjectId
const objectIdRegex = /^[0-9a-f]{24}$/;

export const invoiceSchema = z.object({
  body: z.object({
    // invoice number
    date: z.coerce.date({
      required_error: 'Enter invoice date',
      invalid_type_error: 'type Date is required',
    }),
    paymentTerms: z.coerce
      .number({ required_error: 'Enter number of days' })
      .int('Enter a whole number')
      .positive('Value must be positive'),
    status: z.enum(['draft', 'pending', 'paid'], {
      required_error: 'Enter invoice status',
    }),
    // customer: z.string({ required_error: 'Enter customer id' }),
    // customer: z.custom<mongoose.Types.ObjectId>(),
    customer: z.string().regex(objectIdRegex, 'Malformatted ObjectId'),
    items: z
      .array(itemSchema, { required_error: 'Enter an item' })
      .min(1, 'Enter at least one item'),
  }),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// customer: z.string().regex(/^[0-9a-f]{24}$/)
// customer: z.custom<mongoose.Types.ObjectId>()
// customer: z.instanceof(ObjectId)

