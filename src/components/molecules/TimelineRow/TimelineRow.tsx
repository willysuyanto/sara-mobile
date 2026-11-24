import type { ComponentProps } from 'react';

import { Lucide } from '@react-native-vector-icons/lucide/static';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import type { Colors } from '@/theme/types/colors';

import { Text } from '@/components/atoms';

const MARKER_ICON_SIZE = 15;
const MARKER_SIZE = 35;
const TRAILING_ICON_SIZE = 14;

type IconName = ComponentProps<typeof Lucide>['name'];

type Properties = {
  readonly connectsToNext?: boolean;
  readonly detail: string;
  readonly icon: IconName;
  readonly iconColor?: keyof Colors;
  readonly time: string;
  readonly title: string;
  readonly trailingIcon?: IconName;
};

const styles = StyleSheet.create({
  copy: { minHeight: 67 },
  marker: { height: MARKER_SIZE, width: MARKER_SIZE },
  timestamp: { fontSize: 9, lineHeight: 13.5 },
});

function TimelineRow({
  connectsToNext = false,
  detail,
  icon,
  iconColor = 'iconMuted',
  time,
  title,
  trailingIcon = undefined,
}: Properties) {
  const { backgrounds, borders, colors, gutters, layout } = useTheme();

  return (
    <View style={[layout.row, gutters.gap_13]}>
      <View style={layout.itemsCenter}>
        <View
          style={[
            layout.itemsCenter,
            layout.justifyCenter,
            backgrounds.surfaceSubtle,
            borders.rounded_100,
            styles.marker,
          ]}
        >
          <Lucide
            accessible={false}
            color={colors[iconColor]}
            importantForAccessibility="no"
            name={icon}
            size={MARKER_ICON_SIZE}
          />
        </View>
        {connectsToNext ? (
          <View
            style={[
              layout.flex_1,
              backgrounds.surfaceSubtle,
              { width: borders.w_1.borderWidth },
            ]}
            testID="timeline-connector"
          />
        ) : undefined}
      </View>

      <View
        style={[
          layout.flex_1,
          layout.row,
          layout.itemsCenter,
          gutters.gap_8,
          gutters.paddingBottom_24,
        ]}
      >
        <View style={[layout.flex_1, styles.copy]}>
          <Text
            color="textSecondary"
            style={styles.timestamp}
            variant="captionPrimary"
          >
            {time}
          </Text>
          <Text style={gutters.marginTop_8} variant="labelButtonSmall">
            {title}
          </Text>
          <Text
            color="textSecondary"
            style={gutters.marginTop_6}
            variant="brandCaption"
          >
            {detail}
          </Text>
        </View>
        {trailingIcon === undefined ? undefined : (
          <Lucide
            accessible={false}
            color={colors.iconMuted}
            importantForAccessibility="no"
            name={trailingIcon}
            size={TRAILING_ICON_SIZE}
          />
        )}
      </View>
    </View>
  );
}

export default TimelineRow;
