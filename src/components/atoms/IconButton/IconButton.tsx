import type { LucideIconName } from '@react-native-vector-icons/lucide/static';
import type { PressableProps, ViewStyle } from 'react-native';

import { Lucide } from '@react-native-vector-icons/lucide/static';
import { ActivityIndicator, Pressable } from 'react-native';

import { useTheme } from '@/theme';
import type { Colors } from '@/theme/types/colors';

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary';

type Palette = {
  readonly backgroundColor: string;
  readonly contentColor: string;
};

type Properties = {
  readonly disabled?: boolean;
  readonly icon: LucideIconName;
  readonly loading?: boolean;
  readonly variant?: IconButtonVariant;
} & Omit<PressableProps, 'children' | 'disabled' | 'style'>;

const SIZE = 44;
const ICON_SIZE = 20;
const ELEVATION = 3;
const PRESSED_OPACITY = 0.85;
const SHADOW_OPACITY = 0.07;
const SHADOW_RADIUS = 6;
const SHADOW_OFFSET_Y = 3;

const resolvePalette = (
  colors: Colors,
  variant: IconButtonVariant,
  disabled: boolean,
): Palette => {
  if (disabled) {
    return {
      backgroundColor:
        variant === 'tertiary' ? 'transparent' : colors.surfaceNeutral,
      contentColor: colors.iconDisabled,
    };
  }

  switch (variant) {
    case 'secondary': {
      return {
        backgroundColor: colors.secondaryBackground,
        contentColor: colors.textAccent,
      };
    }
    case 'tertiary': {
      return {
        backgroundColor: 'transparent',
        contentColor: colors.textAccent,
      };
    }
    default: {
      return {
        backgroundColor: colors.buttonPrimaryBackground,
        contentColor: colors.iconOnPrimary,
      };
    }
  }
};

function IconButton({
  accessibilityLabel,
  disabled = false,
  icon,
  loading = false,
  variant = 'primary',
  ...props
}: Properties) {
  const { borders, colors, layout } = useTheme();

  const palette = resolvePalette(colors, variant, disabled);

  const baseStyle: ViewStyle = {
    ...layout.row,
    ...layout.itemsCenter,
    ...layout.justifyCenter,
    ...borders.rounded_10,
    backgroundColor: palette.backgroundColor,
    height: SIZE,
    width: SIZE,
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
      accessibilityLabel={accessibilityLabel}
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
        <Lucide color={palette.contentColor} name={icon} size={ICON_SIZE} />
      )}
    </Pressable>
  );
}

export default IconButton;
