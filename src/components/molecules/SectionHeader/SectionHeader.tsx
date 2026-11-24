import { Lucide } from '@react-native-vector-icons/lucide/static';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';

const ACTION_ICON_SIZE = 13;
const BADGE_PADDING_HORIZONTAL = 5;
const BADGE_PADDING_VERTICAL = 2;

type Properties = {
  readonly actionLabel?: string;
  readonly count?: number;
  readonly onActionPress?: () => void;
  readonly title: string;
};

/**
 * Section title with an optional count badge and an optional trailing link,
 * as used above the activity and upcoming lists.
 */
function SectionHeader({
  actionLabel = undefined,
  count = undefined,
  onActionPress = undefined,
  title,
}: Properties) {
  const { borders, colors, gutters, layout } = useTheme();

  return (
    <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
      <View style={[layout.row, layout.itemsCenter, gutters.gap_5]}>
        <Text variant="headingTertiary">{title}</Text>

        {count === undefined ? undefined : (
          <View
            style={[
              borders.rounded_4,
              {
                backgroundColor: colors.surfaceNeutral,
                paddingHorizontal: BADGE_PADDING_HORIZONTAL,
                paddingVertical: BADGE_PADDING_VERTICAL,
              },
            ]}
          >
            <Text color="textSecondary" variant="captionPrimary">
              {String(count)}
            </Text>
          </View>
        )}
      </View>

      {actionLabel === undefined ? undefined : (
        <Pressable
          accessibilityRole="button"
          disabled={onActionPress === undefined}
          onPress={onActionPress}
          style={[layout.row, layout.itemsCenter, gutters.gap_3]}
        >
          <Text color="primary" variant="captionPrimary">
            {actionLabel}
          </Text>
          <Lucide
            color={colors.primary}
            name="chevron-right"
            size={ACTION_ICON_SIZE}
          />
        </Pressable>
      )}
    </View>
  );
}

export default SectionHeader;
