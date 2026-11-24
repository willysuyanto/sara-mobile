import { View } from 'react-native';

import { useTheme } from '@/theme';

import { IconByVariant, Text } from '@/components/atoms';

const AVATAR_SIZE = 37;
const ELEVATION = 3;
const LOGO_MARK_SIZE = 24;
const LOGO_SIZE = 36;
const SHADOW_OFFSET_Y = 3;
const SHADOW_OPACITY = 0.07;
const SHADOW_RADIUS = 6;

type Properties = {
  readonly initials?: string;
};

/**
 * Dashboard app bar: the SARA brand mark on the left and the signed-in user's
 * avatar on the right.
 */
function AppBar({ initials = 'A' }: Properties) {
  const { borders, colors, gutters, layout } = useTheme();

  return (
    <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
      <View style={[layout.row, layout.itemsCenter, gutters.gap_10]}>
        <View
          style={[
            layout.itemsCenter,
            layout.justifyCenter,
            borders.rounded_12,
            {
              backgroundColor: colors.brandMark,
              elevation: ELEVATION,
              height: LOGO_SIZE,
              shadowColor: colors.brandBackground,
              shadowOffset: { height: SHADOW_OFFSET_Y, width: 0 },
              shadowOpacity: SHADOW_OPACITY,
              shadowRadius: SHADOW_RADIUS,
              width: LOGO_SIZE,
            },
          ]}
        >
          <IconByVariant
            height={LOGO_MARK_SIZE}
            path="logo"
            stroke={colors.brandForeground}
            width={LOGO_MARK_SIZE}
          />
        </View>

        <Text variant="titleSecondary">
          SARA
          <Text color="primary" variant="titleSecondary">
            .
          </Text>
        </Text>
      </View>

      <View
        style={[
          layout.itemsCenter,
          layout.justifyCenter,
          borders.rounded_100,
          {
            backgroundColor: colors.surfaceAccent,
            borderColor: colors.surfacePrimary,
            borderWidth: borders.w_2.borderWidth,
            height: AVATAR_SIZE,
            width: AVATAR_SIZE,
          },
        ]}
      >
        <Text color="textAccent" variant="labelButtonSmall">
          {initials}
        </Text>
      </View>
    </View>
  );
}

export default AppBar;
