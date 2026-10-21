import type { PressableProps } from 'react-native';

import { useContext } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';

import { RadioGroupContext } from './RadioGroup';

type Properties = {
  readonly disabled?: boolean;
  readonly label: string;
  readonly onPress?: () => void;
  readonly selected?: boolean;
  readonly value?: string;
} & Omit<
  PressableProps,
  'children' | 'disabled' | 'onPress' | 'selected' | 'style'
>;

const INDICATOR_SIZE = 20;
const DOT_SIZE = 10;
const BORDER_WIDTH = 1.5;

function Radio({
  accessibilityLabel,
  disabled = false,
  label,
  onPress = undefined,
  selected = false,
  value = undefined,
  ...props
}: Properties) {
  const { borders, colors, gutters } = useTheme();
  const group = useContext(RadioGroupContext);

  const isSelected =
    group && value !== undefined ? group.value === value : selected;
  const isDisabled = Boolean(group?.disabled) || disabled;

  const handlePress = () => {
    if (group && value !== undefined) {
      group.onChange(value);
    }

    onPress?.();
  };

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={handlePress}
      style={[gutters.gap_10, { alignItems: 'center', flexDirection: 'row' }]}
    >
      <View
        style={[
          borders.rounded_100,
          {
            alignItems: 'center',
            backgroundColor: colors.surfacePrimary,
            borderColor: isSelected
              ? colors.buttonPrimaryBackground
              : colors.borderControl,
            borderWidth: BORDER_WIDTH,
            height: INDICATOR_SIZE,
            justifyContent: 'center',
            width: INDICATOR_SIZE,
          },
        ]}
        testID="radio-indicator"
      >
        {isSelected ? (
          <View
            style={[
              borders.rounded_100,
              {
                backgroundColor: colors.buttonPrimaryBackground,
                height: DOT_SIZE,
                width: DOT_SIZE,
              },
            ]}
            testID="radio-dot"
          />
        ) : undefined}
      </View>

      <Text
        color={isDisabled ? 'textDisabled' : 'textPrimary'}
        variant="bodySecondary"
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default Radio;
