import { primitiveColors } from '@/theme/tokens/primitives';

/**
 * SARA semantic color tokens for the light theme.
 *
 * Every entry aliases a primitive, mirroring the `SARA / Semantic` group in
 * `tokens.tokens.json`.
 */
export const semanticColorsLight = {
  // Accent
  accentWarm: primitiveColors.amber500,
  // Background
  backgroundPrimary: primitiveColors.neutral000,
  backgroundSecondary: primitiveColors.neutral000,
  // Border
  borderAccent: primitiveColors.neutral200,
  borderControl: primitiveColors.neutral200,
  borderPrimary: primitiveColors.neutral200,
  borderSecondary: primitiveColors.neutral200,
  borderSubtle: primitiveColors.neutral200,
  // Brand
  brandBackground: primitiveColors.violet600,
  brandForeground: primitiveColors.neutral000,
  brandLogo: primitiveColors.violet800,
  brandMark: primitiveColors.violet800,
  buttonPrimaryBackground: primitiveColors.violet600,
  // Error
  errorForeground: primitiveColors.red600,
  errorForeground2: primitiveColors.red200,
  // Icon
  iconDisabled: primitiveColors.neutral400,
  iconMuted: primitiveColors.neutral400,
  iconOnPrimary: primitiveColors.neutral000,
  iconSecondary: primitiveColors.neutral600,
  // Navigation
  navigationActive: primitiveColors.violet800,
  primary: primitiveColors.violet600,
  // Secondary
  secondary2: primitiveColors.violet800,
  secondaryBackground: primitiveColors.violet100,
  // Success
  successBackground: primitiveColors.green050,
  successForeground: primitiveColors.green600,
  successIcon: primitiveColors.green600,
  successSurface: primitiveColors.green050,
  // Surface
  surfaceAccent: primitiveColors.violet100,
  surfaceCard: primitiveColors.violet050,
  surfaceCardHighlight: primitiveColors.violet100,
  surfaceNeutral: primitiveColors.neutral100,
  surfaceOverlay: primitiveColors.violet100,
  surfacePrimary: primitiveColors.neutral000,
  surfaceSecondary: primitiveColors.violet100,
  surfaceSubtle: primitiveColors.violet050,
  surfaceTertiary: primitiveColors.violet100,
  // System
  systemBlack: primitiveColors.neutral1000,
  systemIndicator: primitiveColors.neutral900,
  systemOutline: primitiveColors.neutral600,
  // Text
  textAccent: primitiveColors.violet800,
  textDisabled: primitiveColors.neutral400,
  textDisabledMuted: primitiveColors.neutral400,
  textHelper: primitiveColors.neutral600,
  textMuted: primitiveColors.neutral600,
  textOnNeutral: primitiveColors.neutral600,
  textOnOverlay: primitiveColors.violet800,
  textOnPrimary: primitiveColors.neutral000,
  textOnSecondary: primitiveColors.neutral900,
  textOnSecondaryMuted: primitiveColors.neutral600,
  textOnSubtle: primitiveColors.neutral600,
  textOnTertiary: primitiveColors.violet800,
  textPrimary: primitiveColors.neutral900,
  textSecondary: primitiveColors.neutral600,
  textStrong: primitiveColors.neutral900,
  textSubtle: primitiveColors.neutral600,
  textSupporting: primitiveColors.neutral600,
  textTertiary: primitiveColors.neutral600,
  // Warning
  warningBackground: primitiveColors.amber050,
  warningBorder: primitiveColors.amber200,
  warningForeground: primitiveColors.amber800,
} as const;

/**
 * SARA semantic color tokens for the dark theme.
 *
 * The token file only ships a light theme, so these values are derived from the
 * same primitives to keep dark mode accessible and consistent.
 */
export const semanticColorsDark = {
  // Accent
  accentWarm: primitiveColors.amber400,
  // Background
  backgroundPrimary: primitiveColors.neutral1000,
  backgroundSecondary: primitiveColors.neutral900,
  // Border
  borderAccent: primitiveColors.neutral700,
  borderControl: primitiveColors.neutral700,
  borderPrimary: primitiveColors.neutral800,
  borderSecondary: primitiveColors.neutral800,
  borderSubtle: primitiveColors.neutral800,
  // Brand
  brandBackground: primitiveColors.violet600,
  brandForeground: primitiveColors.neutral000,
  brandLogo: primitiveColors.violet200,
  brandMark: primitiveColors.violet800,
  buttonPrimaryBackground: primitiveColors.violet400,
  // Error
  errorForeground: primitiveColors.red400,
  errorForeground2: primitiveColors.red800,
  // Icon
  iconDisabled: primitiveColors.neutral600,
  iconMuted: primitiveColors.neutral600,
  iconOnPrimary: primitiveColors.neutral000,
  iconSecondary: primitiveColors.neutral400,
  // Navigation
  navigationActive: primitiveColors.violet200,
  primary: primitiveColors.violet400,
  // Secondary
  secondary2: primitiveColors.violet200,
  secondaryBackground: primitiveColors.neutral800,
  // Success
  successBackground: primitiveColors.green900,
  successForeground: primitiveColors.green300,
  successIcon: primitiveColors.green300,
  successSurface: primitiveColors.green900,
  // Surface
  surfaceAccent: primitiveColors.violet800,
  surfaceCard: primitiveColors.neutral900,
  surfaceCardHighlight: primitiveColors.neutral800,
  surfaceNeutral: primitiveColors.neutral900,
  surfaceOverlay: primitiveColors.neutral800,
  surfacePrimary: primitiveColors.neutral900,
  surfaceSecondary: primitiveColors.neutral800,
  surfaceSubtle: primitiveColors.neutral1000,
  surfaceTertiary: primitiveColors.neutral900,
  // System
  systemBlack: primitiveColors.neutral000,
  systemIndicator: primitiveColors.neutral000,
  systemOutline: primitiveColors.neutral700,
  // Text
  textAccent: primitiveColors.violet200,
  textDisabled: primitiveColors.neutral600,
  textDisabledMuted: primitiveColors.neutral600,
  textHelper: primitiveColors.neutral400,
  textMuted: primitiveColors.neutral400,
  textOnNeutral: primitiveColors.neutral300,
  textOnOverlay: primitiveColors.neutral000,
  textOnPrimary: primitiveColors.neutral900,
  textOnSecondary: primitiveColors.neutral000,
  textOnSecondaryMuted: primitiveColors.neutral400,
  textOnSubtle: primitiveColors.neutral300,
  textOnTertiary: primitiveColors.violet200,
  textPrimary: primitiveColors.neutral000,
  textSecondary: primitiveColors.neutral400,
  textStrong: primitiveColors.neutral000,
  textSubtle: primitiveColors.neutral400,
  textSupporting: primitiveColors.neutral400,
  textTertiary: primitiveColors.neutral400,
  // Warning
  warningBackground: primitiveColors.amber900,
  warningBorder: primitiveColors.amber700,
  warningForeground: primitiveColors.amber200,
} as const;
