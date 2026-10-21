import type { PressableProps } from 'react-native';

import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';

type Properties = {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly label?: string;
  readonly onChange?: (checked: boolean) => void;
} & Omit<
  PressableProps,
  'checked' | 'children' | 'disabled' | 'onPress' | 'style'
>;

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const TRACK_PADDING = 3;
const THUMB_SIZE = 20;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;
const DURATION = 150;

function Switch({
  accessibilityLabel,
  checked = undefined,
  defaultChecked = false,
  disabled = false,
  label = undefined,
  onChange = undefined,
  ...props
}: Properties) {
  const { borders, colors, gutters } = useTheme();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const offset = useSharedValue(isChecked ? THUMB_TRAVEL : 0);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handlePress = () => {
    const next = !isChecked;

    if (!isControlled) {
      setInternalChecked(next);
    }

    offset.set(withTiming(next ? THUMB_TRAVEL : 0, { duration: DURATION }));
    onChange?.(next);
  };

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[gutters.gap_10, { alignItems: 'center', flexDirection: 'row' }]}
    >
      <View
        style={[
          borders.rounded_100,
          {
            backgroundColor: isChecked
              ? colors.buttonPrimaryBackground
              : colors.borderControl,
            height: TRACK_HEIGHT,
            padding: TRACK_PADDING,
            width: TRACK_WIDTH,
          },
          disabled ? { opacity: 0.5 } : undefined,
        ]}
        testID="switch-track"
      >
        <Animated.View
          style={[
            thumbStyle,
            borders.rounded_100,
            {
              backgroundColor: colors.surfacePrimary,
              height: THUMB_SIZE,
              width: THUMB_SIZE,
            },
          ]}
          testID="switch-thumb"
        />
      </View>

      {label ? (
        <Text
          color={disabled ? 'textDisabled' : 'textPrimary'}
          variant="bodySecondary"
        >
          {label}
        </Text>
      ) : undefined}
    </Pressable>
  );
}

export default Switch;
