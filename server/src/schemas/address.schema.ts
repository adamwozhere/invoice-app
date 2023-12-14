import { z } from 'zod';

// simple postcode regex from: https://ideal-postcodes.co.uk/guides/postcode-validation
const postcodeRegEx = new RegExp(/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i);

export const addressSchema = z.object({
  line1: z.string({
    required_error: 'Enter address line 1, typically the building and street',
  }),
  line2: z.string().optional(),
  city: z.string({ required_error: 'Enter town or city' }),
  county: z.string().optional(),
  postcode: z
    .string({ required_error: 'Enter postcode' })
    .regex(postcodeRegEx, 'Enter a valid postcode'),
});

