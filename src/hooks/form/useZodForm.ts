import type { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export type UseZodFormOptions<TFieldValues extends FieldValues, TOutput> = Omit<
  UseFormProps<TFieldValues, unknown, TOutput>,
  'resolver'
>;

/**
 * `useForm` wired to a zod schema.
 *
 * Field values are typed from the schema input (what the form holds), while
 * `handleSubmit` receives the schema output (after transforms and coercions).
 */
export const useZodForm = <
  TFieldValues extends FieldValues,
  TOutput = TFieldValues,
>(
  schema: z.ZodType<TOutput, TFieldValues>,
  options?: UseZodFormOptions<TFieldValues, TOutput>,
): UseFormReturn<TFieldValues, unknown, TOutput> =>
  useForm<TFieldValues, unknown, TOutput>({
    mode: 'onChange',
    ...options,
    resolver: zodResolver(schema),
  });
