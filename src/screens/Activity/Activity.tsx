import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';
import { ActivityCard } from '@/components/molecules';
import { SafeScreen } from '@/components/templates';

const CTA_PLUS_SIZE = 18;
const HEADER_PLUS_SIZE = 20;

// shortcut: match the Figma sample agenda until the activities API exists.
const GROUPS = [
  {
    activities: [
      { id: 'meeting', reminded: true },
      { id: 'network', reminded: false },
    ],
    heading: 'today',
  },
  {
    activities: [
      { id: 'algorithms', reminded: false },
      { id: 'report', reminded: true },
    ],
    heading: 'upcoming',
  },
] as const;

const styles = StyleSheet.create({
  createButton: { minHeight: 48 },
  date: { fontSize: 9, lineHeight: 14, paddingVertical: 2 },
  heroTitle: { fontSize: 25, lineHeight: 37.5 },
  intro: { lineHeight: 21 },
  plusButton: { height: 40, width: 40 },
  sectionTitle: { fontSize: 14, lineHeight: 21 },
  title: { fontSize: 20, lineHeight: 30 },
});

function Activity() {
  const { t } = useTranslation();
  const { backgrounds, borders, colors, gutters, layout } = useTheme();
  const createLabel = t('screen_dashboard.agendaCta');

  return (
    <SafeScreen
      edges={['left', 'right', 'top']}
      style={backgrounds.backgroundSecondary}
    >
      <ScrollView
        contentContainerStyle={[
          gutters.paddingHorizontal_24,
          gutters.paddingBottom_24,
        ]}
      >
        <View
          style={[
            layout.row,
            layout.itemsCenter,
            layout.justifyBetween,
            gutters.gap_10,
            gutters.paddingVertical_10,
          ]}
        >
          <Text
            accessibilityRole="header"
            color="primary"
            style={[layout.flex_1, styles.title]}
            variant="headingBrand"
          >
            {t('navigation_tabs.activities')}
          </Text>
          <Pressable
            accessibilityLabel={createLabel}
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            disabled
            style={[
              layout.itemsCenter,
              layout.justifyCenter,
              borders.rounded_13,
              backgrounds.surfaceCard,
              styles.plusButton,
            ]}
          >
            <Lucide
              color={colors.primary}
              name="plus"
              size={HEADER_PLUS_SIZE}
            />
          </Pressable>
        </View>

        <View style={[gutters.paddingTop_22, gutters.gap_6]}>
          <Text style={styles.heroTitle} variant="headingSecondary">
            {t('screen_activity.heading')}
          </Text>
          <Text
            color="textSecondary"
            style={styles.intro}
            variant="bodySecondary"
          >
            {t('screen_activity.intro')}
          </Text>
        </View>

        {GROUPS.map(({ activities, heading }) => (
          <View key={heading} style={[gutters.marginTop_24, gutters.gap_12]}>
            <View
              style={
                heading === 'today'
                  ? [layout.row, layout.itemsCenter, gutters.gap_7]
                  : undefined
              }
            >
              <Text
                accessibilityRole="header"
                style={styles.sectionTitle}
                variant="headingTertiary"
              >
                {t(`screen_activity.${heading}`)}
              </Text>
              {heading === 'today' ? (
                <Text
                  color="textSecondary"
                  style={[
                    backgrounds.surfaceNeutral,
                    borders.rounded_4,
                    gutters.paddingHorizontal_5,
                    styles.date,
                  ]}
                  variant="captionPrimary"
                >
                  {t('screen_activity.todayDate')}
                </Text>
              ) : undefined}
            </View>

            {activities.map(({ id, reminded }) => (
              <ActivityCard
                key={id}
                reminded={reminded}
                spacious
                time={t(`screen_activity.items.${id}.time`)}
                title={t(`screen_activity.items.${id}.title`)}
              />
            ))}
          </View>
        ))}

        <Pressable
          accessibilityLabel={createLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={[
            layout.row,
            layout.itemsCenter,
            layout.justifyCenter,
            borders.rounded_10,
            backgrounds.buttonPrimaryBackground,
            gutters.gap_8,
            gutters.marginTop_12,
            gutters.padding_8,
            styles.createButton,
          ]}
        >
          <Lucide
            color={colors.textOnPrimary}
            name="plus"
            size={CTA_PLUS_SIZE}
          />
          <Text color="textOnPrimary" variant="labelButton">
            {createLabel}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}

export default Activity;
