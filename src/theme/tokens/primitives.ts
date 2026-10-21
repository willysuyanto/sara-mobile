/**
 * SARA primitive color scales.
 *
 * Anchors are taken verbatim from `tokens.tokens.json`; the remaining steps are
 * hand-curated to give every scale a complete, balanced ramp.
 */
export const primitiveColors = {
  // Amber
  amber050: '#fbf7ef',
  amber100: '#f2ebdf',
  amber200: '#e8dfce',
  amber300: '#d6bd91',
  amber400: '#cdac73',
  amber500: '#c49b54',
  amber600: '#b18e50',
  amber700: '#9d804d',
  amber800: '#8a7349',
  amber900: '#776645',
  // Green
  green050: '#edf5f0',
  green100: '#d6ebe1',
  green200: '#b4d8c7',
  green300: '#8fc2ac',
  green400: '#6ba98f',
  green500: '#549679',
  green600: '#43836e',
  green700: '#376b5a',
  green800: '#2c5447',
  green900: '#224036',
  // Neutral
  neutral000: '#ffffff',
  neutral050: '#f8f8fa',
  neutral100: '#f0f1f5',
  neutral1000: '#000000',
  neutral200: '#e2e3f0',
  neutral300: '#bcbfcc',
  neutral400: '#979ba7',
  neutral500: '#868899',
  neutral600: '#74758b',
  neutral700: '#585970',
  neutral800: '#3c3d55',
  neutral900: '#20213a',
  // Red
  red050: '#fff5f5',
  red100: '#ffebeb',
  red200: '#ffe1e1',
  red300: '#edbebe',
  red400: '#db9b9b',
  red500: '#c87777',
  red600: '#b65454',
  red700: '#9b4545',
  red800: '#7e3a3a',
  red900: '#662f2f',
  // Violet
  violet050: '#f6f5ff',
  violet100: '#e9e8ff',
  violet200: '#cccaf5',
  violet300: '#afaceb',
  violet400: '#928ee1',
  violet500: '#7570d8',
  violet600: '#5753ce',
  violet700: '#4844b4',
  violet800: '#39359a',
  violet900: '#2a2680',
} as const;
