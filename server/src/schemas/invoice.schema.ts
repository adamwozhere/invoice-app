import { z } from 'zod';
// import { customerSchema } from './customer.schema';

// TODO: invoice status: 'draft' | 'pending' | 'paid'
// TODO: invoice date, due date - or payment terms date?
// TODO: discount?
// TODO: vat?
// TODO: totals (items and grand todal) - calculate and add on refine? or add on client and validate on refine?
// TODO: put z.trim().toUpperCase etc. in zod schema rather than mongoose schema?

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

// TODO: use .pipe to enable coercion properly and give required error before the coercion ?
export const invoiceSchema = z.object({
  body: z.object({
    // invoice number
    date: z
      .string({ required_error: 'Enter invoice date' })
      .pipe(z.coerce.date()),
    // date: z.coerce.date({
    //   required_error: 'Enter invoice date',
    //   invalid_type_error: 'type Date is required',
    // }),
    paymentTerms: z
      .number({ required_error: 'Enter number of days' })
      .int('Enter a whole number')
      .positive('Value must be positive'),
    status: z.enum(['draft', 'pending', 'paid'], {
      required_error: 'Enter invoice status',
    }),
    customer: z.string().regex(objectIdRegex, 'Malformatted ObjectId'),
    items: z
      .array(itemSchema, { required_error: 'Enter an item' })
      .min(1, 'Enter at least one item'),
  }),
});

// TODO: handle missing / undefined values (zod errorMap ?)
// but perhaps not needed as in customer schema it gives a required message ?
// FIX: it's because of z.coerce as it tries to coerce undefined to a date, so then it gives a type error not a required error
// NOTE: that removing z.coerce on the date fails the tests: cannot seem to just use { date: new Date() } in the test object
// const customErrorMap: z.ZodErrorMap = (error, ctx) => {
//   switch (error.code) {
//     case z.ZodIssueCode.invalid_date:
//       if (ctx.data == undefined) {
//         return { message: 'missing or undefined date' };
//       }
//       return { message: 'bad input' };
//       break;

//     case z.ZodIssueCode.custom:
//       return { message: 'bad input' };
//   }

//   return { message: ctx.defaultError };
// };

// z.setErrorMap(customErrorMap);

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// customer: z.string().regex(/^[0-9a-f]{24}$/)
// customer: z.custom<mongoose.Types.ObjectId>()
// customer: z.instanceof(ObjectId)

