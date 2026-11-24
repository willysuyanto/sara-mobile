import { Lucide } from '@react-native-vector-icons/lucide/static';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { IconByVariant, Text } from '@/components/atoms';

const CHEVRON_SIZE = 16;
const LOGO_MARK_SIZE = 24;
const LOGO_SIZE = 36;

type Properties = {
  readonly body: string;
  readonly onPress?: () => void;
  readonly title: string;
};

/**
 * The "tell SARA what you are planning" entry point, laid out as a divider row
 * between the agenda card and today's activities.
 */
function PromptCard({ body, onPress = undefined, title }: Properties) {
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
        gutters.paddingVertical_17,
        {
          borderBottomColor: colors.borderPrimary,
          borderBottomWidth: borders.w_1.borderWidth,
          borderTopColor: colors.borderPrimary,
          borderTopWidth: borders.w_1.borderWidth,
        },
      ]}
    >
      <View
        style={[
          layout.itemsCenter,
          layout.justifyCenter,
          borders.rounded_12,
          {
            backgroundColor: colors.brandMark,
            height: LOGO_SIZE,
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

      <View style={[layout.flex_1, gutters.gap_3]}>
        <Text variant="labelButtonSmall">{title}</Text>
        <Text color="textSecondary" variant="captionPrimary">
          {body}
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

export default PromptCard;
