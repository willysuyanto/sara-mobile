import type { ReactNode } from 'react';
import type { PressableProps, ViewStyle } from 'react-native';

import { ActivityIndicator, Pressable } from 'react-native';

import { useTheme } from '@/theme';
import type { Colors } from '@/theme/types/colors';

import Text from '@/components/atoms/Text/Text';

export type ButtonSize = 'lg' | 'md' | 'sm';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type Palette = {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly contentColor: string;
};

type Properties = {
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly label: string;
  readonly leadingIcon?: ReactNode;
  readonly loading?: boolean;
  readonly size?: ButtonSize;
  readonly trailingIcon?: ReactNode;
  readonly variant?: ButtonVariant;
} & Omit<PressableProps, 'children' | 'disabled' | 'style'>;

const HEIGHT_SM = 36;
const HEIGHT_MD = 44;
const HEIGHT_LG = 52;
const SHADOW_OPACITY = 0.07;
const SHADOW_RADIUS = 6;
const SHADOW_OFFSET_Y = 3;
const ELEVATION = 3;
const PRESSED_OPACITY = 0.85;

const HEIGHTS: Record<ButtonSize, number> = {
  lg: HEIGHT_LG,
  md: HEIGHT_MD,
  sm: HEIGHT_SM,
};

const LABEL_VARIANTS = {
  lg: 'labelButton',
  md: 'labelButton',
  sm: 'labelButtonSmall',
} as const;

const resolvePalette = (
  colors: Colors,
  variant: ButtonVariant,
  disabled: boolean,
): Palette => {
  if (disabled) {
    return {
      backgroundColor:
        variant === 'tertiary' ? 'transparent' : colors.surfaceNeutral,
      borderColor:
        variant === 'tertiary' ? 'transparent' : colors.borderPrimary,
      contentColor: colors.textDisabled,
    };
  }

  switch (variant) {
    case 'secondary': {
      return {
        backgroundColor: colors.secondaryBackground,
        borderColor: colors.borderPrimary,
        contentColor: colors.textAccent,
      };
    }
    case 'tertiary': {
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        contentColor: colors.textAccent,
      };
    }
    default: {
      return {
        backgroundColor: colors.buttonPrimaryBackground,
        borderColor: colors.buttonPrimaryBackground,
        contentColor: colors.textOnPrimary,
      };
    }
  }
};

function Button({
  accessibilityLabel,
  disabled = false,
  fullWidth = false,
  label,
  leadingIcon = undefined,
  loading = false,
  size = 'md',
  trailingIcon = undefined,
  variant = 'primary',
  ...props
}: Properties) {
  const { borders, colors, gutters, layout } = useTheme();

  const palette = resolvePalette(colors, variant, disabled);

  const baseStyle: ViewStyle = {
    ...layout.row,
    ...layout.itemsCenter,
    ...layout.justifyCenter,
    ...borders.rounded_10,
    backgroundColor: palette.backgroundColor,
    borderColor: palette.borderColor,
    borderWidth: borders.w_1.borderWidth,
    gap: gutters.gap_8.gap,
    height: HEIGHTS[size],
    paddingHorizontal: gutters.paddingHorizontal_15.paddingHorizontal,
    ...(fullWidth ? { width: '100%' } : {}),
    ...(variant === 'primary' && !disabled
      ? {
          elevation: ELEVATION,
          shadowColor: colors.buttonPrimaryBackground,
          shadowOffset: { height: SHADOW_OFFSET_Y, width: 0 },
          shadowOpacity: SHADOW_OPACITY,
          shadowRadius: SHADOW_RADIUS,
        }
      : {}),
  };

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: disabled || loading }}
      disabled={disabled || loading}
      style={(state) => [
        baseStyle,
        state.pressed && !disabled && !loading
          ? { opacity: PRESSED_OPACITY }
          : undefined,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.contentColor} />
      ) : (
        <>
          {leadingIcon}
          <Text color={palette.contentColor} variant={LABEL_VARIANTS[size]}>
            {label}
          </Text>
          {trailingIcon}
        </>
      )}
    </Pressable>
  );
}

export default Button;
