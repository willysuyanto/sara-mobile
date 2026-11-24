import { Lucide } from '@react-native-vector-icons/lucide/static';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';

const CHEVRON_SIZE = 16;
const DAY_TILE_HEIGHT = 45;
const DAY_TILE_WIDTH = 39;

type Properties = {
  readonly day: string;
  readonly meta: string;
  readonly month: string;
  readonly onPress?: () => void;
  readonly title: string;
};

/**
 * A dated entry of the upcoming list: month/day tile, title and a one-line
 * meta (weekday, time and timezone).
 */
function UpcomingCard({
  day,
  meta,
  month,
  onPress = undefined,
  title,
}: Properties) {
  const { borders, colors, gutters, layout } = useTheme();

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole={onPress === undefined ? undefined : 'button'}
      onPress={onPress}
      style={[
        layout.row,
        layout.itemsCenter,
        gutters.gap_12,
        gutters.padding_13,
        borders.rounded_13,
        {
          borderColor: colors.borderPrimary,
          borderWidth: borders.w_1.borderWidth,
        },
      ]}
    >
      <View
        style={[
          layout.itemsCenter,
          layout.justifyCenter,
          borders.rounded_10,
          {
            backgroundColor: colors.surfaceCard,
            height: DAY_TILE_HEIGHT,
            width: DAY_TILE_WIDTH,
          },
        ]}
      >
        <Text color="textSecondary" variant="overlineSmall">
          {month}
        </Text>
        <Text color="textSecondary" variant="labelPrimary">
          {day}
        </Text>
      </View>

      <View style={[layout.flex_1, gutters.gap_3]}>
        <Text variant="labelButtonSmall">{title}</Text>
        <Text color="textSecondary" variant="captionPrimary">
          {meta}
        </Text>
      </View>

      <Lucide
        color={colors.textSecondary}
        name="chevron-right"
        size={CHEVRON_SIZE}
      />
    </Pressable>
  );
}

export default UpcomingCard;
