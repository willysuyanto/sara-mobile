/**
 * SARA spacing and radius scales.
 *
 * Spacing values are the exact px values from `tokens.tokens.json`. Radius
 * values are the token radii rounded to whole pixels (the theme's numeric
 * radius generator only supports integers).
 */
export const radius = [
  1, 3, 4, 5, 6, 8, 10, 12, 13, 16, 18, 19, 100, 125,
] as const;

export const spacing = [
  1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24,
  27,
] as const;
