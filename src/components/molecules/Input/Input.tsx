import type { LucideIconName } from '@react-native-vector-icons/lucide/static';
import type { TextInputProps } from 'react-native';

import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { useTheme } from '@/theme';
import { textStyles } from '@/theme/tokens';
import type { Colors } from '@/theme/types/colors';

import { Text } from '@/components/atoms';

export type InputSize = 'lg' | 'md';

type InputState = 'default' | 'disabled' | 'error' | 'focused';

type Palette = {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly borderWidth: number;
  readonly iconColor: string;
  readonly labelColor: string;
  readonly messageColor: string;
  readonly placeholderColor: string;
  readonly valueColor: string;
};

type Properties = {
  readonly disabled?: boolean;
  readonly error?: boolean;
  readonly errorMessage?: string;
  readonly helperMessage?: string;
  readonly label: string;
  readonly password?: boolean;
  readonly placeholder?: string;
  readonly size?: InputSize;
} & Omit<TextInputProps, 'children' | 'editable' | 'multiline' | 'style'>;

const FIELD_HEIGHTS: Record<InputSize, number> = {
  lg: 56,
  md: 44,
};

const TRAILING_ICONS: Record<InputState, LucideIconName | undefined> = {
  default: undefined,
  disabled: 'lock-keyhole',
  error: 'circle-alert',
  focused: undefined,
};

const VISIBILITY_ICONS: Record<'hidden' | 'visible', LucideIconName> = {
  hidden: 'eye',
  visible: 'eye-off',
};

const ICON_SIZE = 18;
const HIT_SLOP = 8;

const resolvePalette = (colors: Colors, state: InputState): Palette => {
  switch (state) {
    case 'disabled': {
      return {
        backgroundColor: colors.surfaceNeutral,
        borderColor: colors.borderControl,
        borderWidth: 1,
        iconColor: colors.iconDisabled,
        labelColor: colors.textDisabled,
        messageColor: colors.textDisabled,
        placeholderColor: colors.textDisabled,
        valueColor: colors.textDisabled,
      };
    }
    case 'error': {
      return {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.errorForeground,
        borderWidth: 1,
        iconColor: colors.errorForeground,
        labelColor: colors.textPrimary,
        messageColor: colors.errorForeground,
        placeholderColor: colors.textSecondary,
        valueColor: colors.textPrimary,
      };
    }
    case 'focused': {
      return {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.primary,
        borderWidth: 2,
        iconColor: colors.primary,
        labelColor: colors.textPrimary,
        messageColor: colors.textSecondary,
        placeholderColor: colors.textSecondary,
        valueColor: colors.textPrimary,
      };
    }
    default: {
      return {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.borderControl,
        borderWidth: 1,
        iconColor: colors.iconMuted,
        labelColor: colors.textPrimary,
        messageColor: colors.textSecondary,
        placeholderColor: colors.textSecondary,
        valueColor: colors.textPrimary,
      };
    }
  }
};

function Input({
  disabled = false,
  error = false,
  errorMessage = undefined,
  helperMessage = undefined,
  label,
  onBlur = undefined,
  onFocus = undefined,
  password = false,
  placeholder = undefined,
  size = 'md',
  testID = undefined,
  ...props
}: Properties) {
  const { borders, colors, gutters } = useTheme();
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const state: InputState = disabled
    ? 'disabled'
    : error
      ? 'error'
      : focused
        ? 'focused'
        : 'default';

  const palette = resolvePalette(colors, state);
  const trailingIcon = TRAILING_ICONS[state];
  const message = error && errorMessage ? errorMessage : helperMessage;
  const visibilityIcon =
    VISIBILITY_ICONS[passwordVisible ? 'visible' : 'hidden'];

  return (
    <View style={gutters.gap_8}>
      <Text color={palette.labelColor} variant="labelSecondary">
        {label}
      </Text>

      <View
        style={[
          gutters.gap_8,
          gutters.paddingHorizontal_14,
          borders.rounded_6,
          {
            alignItems: 'center',
            backgroundColor: palette.backgroundColor,
            borderColor: palette.borderColor,
            borderWidth: palette.borderWidth,
            flexDirection: 'row',
            height: FIELD_HEIGHTS[size],
          },
        ]}
        testID={testID ? `${testID}-field` : undefined}
      >
        <TextInput
          {...props}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          autoCapitalize={password ? 'none' : props.autoCapitalize}
          autoCorrect={password ? false : props.autoCorrect}
          cursorColor={palette.borderColor}
          editable={!disabled}
          focusable={!disabled}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholder={placeholder}
          placeholderTextColor={palette.placeholderColor}
          secureTextEntry={password ? !passwordVisible : undefined}
          style={[
            textStyles.bodySecondary,
            {
              color: palette.valueColor,
              flex: 1,
              paddingHorizontal: 0,
              paddingVertical: 0,
              textAlignVertical: 'center',
            },
          ]}
          testID={testID}
          textContentType={password ? 'password' : props.textContentType}
        />

        {password ? (
          <Pressable
            accessibilityLabel={
              passwordVisible
                ? 'Sembunyikan kata sandi'
                : 'Tampilkan kata sandi'
            }
            accessibilityRole="button"
            disabled={disabled}
            hitSlop={HIT_SLOP}
            onPress={() => {
              setPasswordVisible((current) => !current);
            }}
            testID={testID ? `${testID}-visibility-toggle` : undefined}
          >
            <Lucide
              color={disabled ? colors.iconDisabled : colors.iconSecondary}
              name={visibilityIcon}
              size={ICON_SIZE}
            />
          </Pressable>
        ) : trailingIcon ? (
          <Lucide
            color={palette.iconColor}
            name={trailingIcon}
            size={ICON_SIZE}
          />
        ) : undefined}
      </View>

      {message ? (
        <Text color={palette.messageColor} variant="captionPrimary">
          {message}
        </Text>
      ) : undefined}
    </View>
  );
}

export default Input;
