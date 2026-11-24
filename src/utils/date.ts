import type { Locale } from 'date-fns';

import { format } from 'date-fns';
import { enUS, id } from 'date-fns/locale';

import { SupportedLanguages } from '@/hooks/language/schema';

const DEFAULT_LOCALE = id;

const LOCALES: Record<string, Locale> = {
  [SupportedLanguages.EN_EN]: enUS,
  [SupportedLanguages.ID_ID]: id,
};

const resolveLocale = (language: string) => LOCALES[language] ?? DEFAULT_LOCALE;

export const formatDay = (date: Date) => format(date, 'dd');

export const formatLongDate = (date: Date, language: string) =>
  format(date, 'EEEE, d MMMM yyyy', {
    locale: resolveLocale(language),
  }).toUpperCase();

export const formatMonth = (date: Date, language: string) =>
  format(date, 'MMM', { locale: resolveLocale(language) }).toUpperCase();
