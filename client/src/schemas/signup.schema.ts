import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Enter email address')
      .email('Enter valid email address'),
    password: z
      .string({ required_error: 'Enter password' })
      .min(8, 'Must be at least 8 characters')
      .max(32, 'Must not be more than 32 characters')
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,32}$/,
        'Password must contain at least one number, one uppercase letter, one lowercase letter, and no spaces'
      ),
    passwordConfirmation: z.string({ required_error: 'Confirm password' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type SignupInput = z.infer<typeof signupSchema>;

