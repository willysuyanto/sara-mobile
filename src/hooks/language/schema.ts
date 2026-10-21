import * as z from 'zod';

export const enum SupportedLanguages {
  EN_EN = 'en-EN',
  ID_ID = 'id-ID',
}

export const languageSchema = z.enum([
  SupportedLanguages.EN_EN,
  SupportedLanguages.ID_ID,
]);

export type Language = z.infer<typeof languageSchema>;
