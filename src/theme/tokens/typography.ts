/**
 * SARA typography text styles.
 *
 * Derived from `textStyles.json` (Figma export). Every style uses the Inter
 * family (the DM Sans / Manrope styles were mapped to Inter) and the type ramp
 * is rebalanced around `bodyPrimary = 14px`, using even sizes only.
 */
export const textStyles = {
  accentPrimary: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.9,
  },
  bodyPrimary: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
  },
  bodySecondary: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
  },
  brandCaption: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16.5,
  },
  captionPrimary: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 0,
  },
  captionSecondary: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 0,
  },
  captionSmall: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '400',
    letterSpacing: 0,
  },
  displayBrand: {
    fontFamily: 'Inter',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 52,
  },
  headingBrand: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  headingPrimary: {
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  headingSecondary: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.9,
  },
  headingTertiary: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  labelActive: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0,
  },
  labelButton: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 21,
  },
  labelButtonSmall: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 18,
  },
  labelControl: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 0,
  },
  labelLink: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 0,
  },
  labelMuted: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  labelPrimary: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  labelSecondary: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
  },
  labelStatus: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0,
  },
  overlinePrimary: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  overlineSecondary: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  overlineSmall: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  systemSignal: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -2,
  },
  titleDisabled: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  titlePrimary: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  titleSecondary: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0,
  },
} as const;

export type TypographyVariant = keyof typeof textStyles;
