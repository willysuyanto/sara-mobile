import * as z from 'zod';

const PASSWORD_MIN_LENGTH = 8;

/**
 * Zod messages are translation keys resolved through `t()` in the screens, so
 * the schema stays language-agnostic.
 */
export const loginSchema = z.object({
  email: z.email('validation_email_invalid'),
  password: z.string().min(PASSWORD_MIN_LENGTH, 'validation_password_min'),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, 'validation_password_min'),
    email: z.email('validation_email_invalid'),
    fullName: z.string().min(1, 'validation_fullName_required'),
    password: z.string().min(PASSWORD_MIN_LENGTH, 'validation_password_min'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'validation_password_mismatch',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.email('validation_email_invalid'),
});

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;

export const sessionSchema = z.object({
  email: z.email(),
  name: z.string(),
  token: z.string(),
});

export type Session = z.infer<typeof sessionSchema>;
