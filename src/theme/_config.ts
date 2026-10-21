import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import {
  primitiveColors,
  radius,
  semanticColorsDark,
  semanticColorsLight,
  spacing,
} from '@/theme/tokens';
import type { ThemeConfiguration } from '@/theme/types/config';

export const enum Variant {
  DARK = 'dark',
}

const colorsLight = {
  ...primitiveColors,
  ...semanticColorsLight,
  skeleton: primitiveColors.neutral200,
} as const;

const colorsDark = {
  ...semanticColorsDark,
  skeleton: primitiveColors.neutral800,
} as const;

const fontSizes = [12, 16, 24, 32, 40, 80] as const;

const gutters = [...spacing, 32, 40, 80] as const;

export const config = {
  backgrounds: colorsLight,
  borders: {
    colors: colorsLight,
    radius,
    widths: [1, 2],
  },
  colors: colorsLight,
  fonts: {
    colors: colorsLight,
    sizes: fontSizes,
  },
  gutters,
  navigationColors: {
    ...DefaultTheme.colors,
    background: colorsLight.surfaceNeutral,
    card: colorsLight.surfaceNeutral,
  },
  variants: {
    dark: {
      backgrounds: colorsDark,
      borders: {
        colors: colorsDark,
      },
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.backgroundSecondary,
        card: colorsDark.backgroundSecondary,
      },
    },
  },
} as const satisfies ThemeConfiguration;
