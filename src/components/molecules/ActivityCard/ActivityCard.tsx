import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';

const BELL_ICON_SIZE = 13;
const CHEVRON_SIZE = 16;
const CHECK_SIZE = 12;
const CHECK_BOX_SIZE = 20;
const CHIP_DOT_SIZE = 3;
const CHIP_PADDING_HORIZONTAL = 6;
const CHIP_PADDING_VERTICAL = 3;

type Properties = {
  readonly done?: boolean;
  readonly onPress?: () => void;
  readonly reminded?: boolean;
  readonly time: string;
  readonly title: string;
};

/**
 * One row of the day agenda: completion checkbox, title, time (with an optional
 * reminder bell) and a status chip.
 */
function ActivityCard({
  done = false,
  onPress = undefined,
  reminded = false,
  time,
  title,
}: Properties) {
  const { t } = useTranslation();
  const { borders, colors, gutters, layout } = useTheme();

  const titleColor = done ? 'textDisabled' : 'textPrimary';
  const metaColor = done ? colors.textDisabled : colors.textSecondary;
  const chipBackground = done ? colors.successBackground : colors.surfaceAccent;
  const chipForeground = done ? colors.successForeground : colors.textAccent;

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole={onPress === undefined ? undefined : 'button'}
      onPress={onPress}
      style={[
        layout.row,
        gutters.gap_12,
        gutters.padding_16,
        borders.rounded_13,
        {
          backgroundColor: done ? colors.surfaceNeutral : colors.surfacePrimary,
          borderColor: colors.borderPrimary,
          borderWidth: borders.w_1.borderWidth,
        },
      ]}
    >
      <View
        style={[
          layout.itemsCenter,
          layout.justifyCenter,
          borders.rounded_6,
          {
            backgroundColor: done
              ? colors.successBackground
              : colors.surfacePrimary,
            borderColor: colors.borderPrimary,
            borderWidth: done ? 0 : borders.w_1.borderWidth,
            height: CHECK_BOX_SIZE,
            width: CHECK_BOX_SIZE,
          },
        ]}
      >
        {done ? (
          <Lucide
            color={colors.successForeground}
            name="check"
            size={CHECK_SIZE}
          />
        ) : undefined}
      </View>

      <View style={[layout.flex_1, gutters.gap_5]}>
        <Text
          color={titleColor}
          style={done ? { textDecorationLine: 'line-through' } : undefined}
          variant="labelButtonSmall"
        >
          {title}
        </Text>

        <View style={[layout.row, layout.itemsCenter, gutters.gap_5]}>
          <Lucide color={metaColor} name="clock" size={BELL_ICON_SIZE} />
          <Text color={metaColor} variant="captionPrimary">
            {time}
          </Text>
          {reminded ? (
            <Lucide color={metaColor} name="bell" size={BELL_ICON_SIZE} />
          ) : undefined}
        </View>

        <View
          style={[
            layout.row,
            layout.itemsCenter,
            borders.rounded_5,
            gutters.gap_4,
            {
              alignSelf: 'flex-start',
              backgroundColor: chipBackground,
              paddingHorizontal: CHIP_PADDING_HORIZONTAL,
              paddingVertical: CHIP_PADDING_VERTICAL,
            },
          ]}
        >
          <View
            style={[
              borders.rounded_100,
              {
                backgroundColor: chipForeground,
                height: CHIP_DOT_SIZE,
                width: CHIP_DOT_SIZE,
              },
            ]}
          />
          <Text color={chipForeground} variant="labelStatus">
            {done ? t('common_statusDone') : t('common_statusScheduled')}
          </Text>
        </View>
      </View>

      <View style={[layout.justifyCenter]}>
        <Lucide
          color={colors.textSecondary}
          name="chevron-right"
          size={CHEVRON_SIZE}
        />
      </View>
    </Pressable>
  );
}

export default ActivityCard;
