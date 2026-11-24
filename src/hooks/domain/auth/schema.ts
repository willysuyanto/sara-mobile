import * as z from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const EMAIL_MAX_LENGTH = 254;
const FULL_NAME_MIN_LENGTH = 2;
const FULL_NAME_MAX_LENGTH = 100;
const OTP_LENGTH = 6;

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*\d)\S+$/i;
const NAME_LETTER_PATTERN = /\p{L}/u;
const OTP_PATTERN = new RegExp(String.raw`^\d{${OTP_LENGTH}}$`, 'u');
const TOKEN_PATTERN = /^[\w+./~-]+=*$/;

/**
 * Zod messages are translation keys resolved through `t()` in the screens, so
 * the schema stays language-agnostic.
 */
const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(EMAIL_MAX_LENGTH, 'validation_email_invalid')
  .pipe(z.email('validation_email_invalid'));

const fullName = z
  .string()
  .trim()
  .min(FULL_NAME_MIN_LENGTH, 'validation_fullName_invalid')
  .max(FULL_NAME_MAX_LENGTH, 'validation_fullName_invalid')
  .regex(NAME_LETTER_PATTERN, 'validation_fullName_invalid');

const registrationPassword = z
  .string()
  .min(PASSWORD_MIN_LENGTH, 'validation_password_invalid')
  .max(PASSWORD_MAX_LENGTH, 'validation_password_invalid')
  .regex(PASSWORD_PATTERN, 'validation_password_invalid');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'validation_password_required'),
});

export const registerSchema = z
  .object({
    confirmPassword: z.string().optional(),
    email,
    fullName,
    password: registrationPassword,
  })
  .refine(
    ({ confirmPassword, password }) =>
      !confirmPassword || confirmPassword === password,
    {
      message: 'validation_password_mismatch',
      path: ['confirmPassword'],
    },
  )
  .transform((values) => {
    if (values.confirmPassword === '') {
      delete values.confirmPassword;
    }
    return values;
  });

export const forgotPasswordSchema = z.object({
  email,
});

export const verifyEmailSchema = z.object({
  code: z.string().regex(OTP_PATTERN, 'validation_code_invalid'),
  email,
});

export const resendOtpSchema = z.object({
  email,
});

export const authUserSchema = z.object({
  email: z.email(),
  id: z.number(),
  name: z.string(),
});

export const meUserSchema = authUserSchema.extend({
  emailVerified: z.boolean(),
});

export const tokenSchema = z.string().regex(TOKEN_PATTERN, 'common_error');

export const sessionSchema = z.object({
  token: tokenSchema,
  user: authUserSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type MeUser = z.infer<typeof meUserSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type ResendOtpPayload = z.infer<typeof resendOtpSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type VerifyEmailPayload = z.infer<typeof verifyEmailSchema>;
