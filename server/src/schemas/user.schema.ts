import { z } from 'zod';
import { objectIdSchema } from './objectId.schema';

export const userBody = {
  body: z.object({
    // TODO: should strings be .trim() trimmed?
    name: z.string({ required_error: 'Name is required' }).min(2).max(35),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Enter a valid email address'),
    password: z.string({ required_error: 'Password is required' }).min(8),
    // TODO: add password validations, 1 char, number etc. and also confirm password
    // Auth token?
  }),
};

export const userParams = {
  params: z.object({
    id: objectIdSchema,
  }),
};

export const createUserSchema = z.object({
  ...userBody,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
