import type { PressableProps } from 'react-native';

import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';

type Properties = {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly label: string;
  readonly onChange?: (checked: boolean) => void;
} & Omit<
  PressableProps,
  'checked' | 'children' | 'disabled' | 'onPress' | 'style'
>;

const INDICATOR_SIZE = 20;
const CHECK_SIZE = 14;
const BORDER_WIDTH = 1.5;

function Checkbox({
  accessibilityLabel,
  checked = undefined,
  defaultChecked = false,
  disabled = false,
  label,
  onChange = undefined,
  ...props
}: Properties) {
  const { borders, colors, gutters } = useTheme();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handlePress = () => {
    const next = !isChecked;

    if (!isControlled) {
      setInternalChecked(next);
    }

    onChange?.(next);
  };

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[gutters.gap_10, { alignItems: 'center', flexDirection: 'row' }]}
    >
      <View
        style={[
          borders.rounded_6,
          {
            alignItems: 'center',
            backgroundColor: isChecked
              ? colors.buttonPrimaryBackground
              : colors.surfacePrimary,
            borderColor: isChecked
              ? colors.buttonPrimaryBackground
              : colors.borderControl,
            borderWidth: BORDER_WIDTH,
            height: INDICATOR_SIZE,
            justifyContent: 'center',
            width: INDICATOR_SIZE,
          },
        ]}
        testID="checkbox-indicator"
      >
        {isChecked ? (
          <Lucide color={colors.textOnPrimary} name="check" size={CHECK_SIZE} />
        ) : undefined}
      </View>

      <Text
        color={disabled ? 'textDisabled' : 'textPrimary'}
        variant="bodySecondary"
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default Checkbox;
