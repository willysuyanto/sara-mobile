import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';
import { TimelineRow } from '@/components/molecules';
import { SafeScreen } from '@/components/templates';

const SHIELD_SIZE = 12;

// shortcut: these entries match the design sample, replace them when the history API is available.
const ENTRIES = [
  { icon: 'check', iconColor: 'successIcon', id: 'completed' },
  { icon: 'bell', iconColor: 'iconMuted', id: 'reminder' },
  { icon: 'pencil', iconColor: 'iconMuted', id: 'created' },
] as const;

const styles = StyleSheet.create({
  heading: { fontSize: 25, lineHeight: 37.5 },
  intro: { lineHeight: 21 },
  privacyNote: {
    flexShrink: 1,
    fontSize: 9,
    lineHeight: 13.5,
    textAlign: 'center',
  },
  sectionTitle: { fontSize: 14, lineHeight: 21 },
  title: { fontSize: 20, lineHeight: 30 },
});

function HistoryScreen() {
  const { t } = useTranslation();
  const { backgrounds, colors, gutters, layout } = useTheme();

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
        <Text
          accessibilityRole="header"
          color="primary"
          style={[gutters.paddingVertical_15, styles.title]}
          variant="headingBrand"
        >
          {t('navigation_tabs.history')}
        </Text>

        <View style={[gutters.marginTop_23, gutters.gap_6]}>
          <Text style={styles.heading} variant="headingSecondary">
            {t('screen_history.heading')}
          </Text>
          <Text
            color="textSecondary"
            style={styles.intro}
            variant="bodySecondary"
          >
            {t('screen_history.intro')}
          </Text>
        </View>

        <Text
          accessibilityRole="header"
          style={[gutters.marginTop_24, styles.sectionTitle]}
          variant="headingTertiary"
        >
          {t('screen_history.recentUpdates')}
        </Text>

        <View style={gutters.marginTop_20}>
          {ENTRIES.map(({ icon, iconColor, id }, index) => (
            <TimelineRow
              connectsToNext={index < ENTRIES.length - 1}
              detail={t(`screen_history.entries.${id}.detail`)}
              icon={icon}
              iconColor={iconColor}
              key={id}
              time={t(`screen_history.entries.${id}.time`)}
              title={t(`screen_history.entries.${id}.title`)}
              trailingIcon="chevron-right"
            />
          ))}
        </View>

        <View
          style={[
            layout.row,
            layout.itemsCenter,
            layout.justifyCenter,
            gutters.gap_5,
            gutters.marginTop_21,
          ]}
        >
          <Lucide
            accessible={false}
            color={colors.textSecondary}
            importantForAccessibility="no"
            name="shield-check"
            size={SHIELD_SIZE}
          />
          <Text
            color="textSecondary"
            style={styles.privacyNote}
            variant="captionPrimary"
          >
            {t('screen_history.privacyNote')}
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default HistoryScreen;
