import type { TextProps as RNTextProperties } from 'react-native';

import { Text as RNText } from 'react-native';

import { useTheme } from '@/theme';
import { textStyles, type TypographyVariant } from '@/theme/tokens';
import type { Colors } from '@/theme/types/colors';

type Properties = {
  readonly color?: ({} & string) | keyof Colors;
  readonly variant?: TypographyVariant;
} & RNTextProperties;

function Text({
  color = 'textPrimary',
  style,
  variant = 'bodyPrimary',
  ...props
}: Properties) {
  const { colors } = useTheme();

  const preset = textStyles[variant];
  const resolvedColor = color in colors ? colors[color as keyof Colors] : color;

  return (
    <RNText {...props} style={[preset, { color: resolvedColor }, style]} />
  );
}

export default Text;
