import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useTheme } from '@/theme';

import { Button, Text } from '@/components/atoms';
import {
  ActivityCard,
  AppBar,
  PromptCard,
  SectionHeader,
  UpcomingCard,
} from '@/components/molecules';
import { SafeScreen } from '@/components/templates';

import { formatDay, formatLongDate, formatMonth } from '@/utils/date';

const CALENDAR_ICON_SIZE = 18;
const NOTE_ICON_SIZE = 14;
const PLUS_ICON_SIZE = 16;
const RING_LARGE = 250;
const RING_LARGE_OFFSET = { right: -166, top: 52 };
const RING_SMALL = 200;
const RING_SMALL_OFFSET = { right: -143, top: 77 };
const SUN_ICON_SIZE = 22;
const USER_NAME = 'Adi';

// shortcut: placeholder agenda until the activities API exists.
const TODAY_ACTIVITIES = [
  {
    done: true,
    id: 'review-appl',
    reminded: false,
    time: '09.00',
    title: 'Review materi APPL',
  },
  {
    done: false,
    id: 'meeting',
    reminded: true,
    time: '13.00',
    title: 'Meeting kelompok',
  },
  {
    done: false,
    id: 'network-assignment',
    reminded: false,
    time: '16.00',
    title: 'Kerjakan tugas jaringan',
  },
];

/**
 * Home dashboard: greeting, today's agenda, the SARA prompt and the upcoming
 * list, as specified by the `Dashboard` frame in the SARA Figma file.
 */
function Dashboard() {
  const { i18n, t } = useTranslation();
  const { backgrounds, borders, colors, gutters, layout } = useTheme();

  const today = new Date();
  const upcomingDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  return (
    <SafeScreen
      edges={['left', 'right', 'top']}
      style={backgrounds.backgroundSecondary}
    >
      <ScrollView
        contentContainerStyle={[gutters.gap_22, gutters.padding_24]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[layout.col, gutters.gap_12]}>
          <AppBar />

          <View style={[layout.col, gutters.gap_8]}>
            <Text
              color="textSecondary"
              style={{ textTransform: 'uppercase' }}
              variant="overlinePrimary"
            >
              {formatLongDate(today, i18n.language)}
            </Text>

            <View style={[layout.row, layout.itemsCenter, gutters.gap_8]}>
              <Text color="textPrimary" variant="headingBrand">
                {`${t('screen_dashboard.greeting')}, ${USER_NAME}`}
              </Text>
              <Lucide
                color={colors.accentWarm}
                name="sun"
                size={SUN_ICON_SIZE}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            borders.rounded_19,
            gutters.padding_21,
            {
              backgroundColor: colors.surfaceNeutral,
              borderColor: colors.borderPrimary,
              borderWidth: borders.w_1.borderWidth,
              overflow: 'hidden',
            },
          ]}
        >
          <View
            style={[
              layout.absolute,
              borders.rounded_125,
              {
                borderColor: colors.borderPrimary,
                borderWidth: borders.w_1.borderWidth,
                height: RING_LARGE,
                width: RING_LARGE,
                ...RING_LARGE_OFFSET,
              },
            ]}
          />
          <View
            style={[
              layout.absolute,
              borders.rounded_100,
              {
                borderColor: colors.borderPrimary,
                borderWidth: borders.w_1.borderWidth,
                height: RING_SMALL,
                width: RING_SMALL,
                ...RING_SMALL_OFFSET,
              },
            ]}
          />

          <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
            <Text color="textAccent" variant="overlineSecondary">
              {t('screen_dashboard.agendaEyebrow')}
            </Text>
            <Lucide
              color={colors.textAccent}
              name="calendar-days"
              size={CALENDAR_ICON_SIZE}
            />
          </View>

          <Text
            color="textPrimary"
            style={[gutters.marginTop_12]}
            variant="headingBrand"
          >
            {t('screen_dashboard.agendaTitle')}
          </Text>

          <Text
            color="textSecondary"
            style={[gutters.marginTop_8]}
            variant="bodySecondary"
          >
            {t('screen_dashboard.agendaBody')}
          </Text>

          <View style={[layout.itemsStart, gutters.marginTop_17]}>
            <Button
              label={t('screen_dashboard.agendaCta')}
              leadingIcon={
                <Lucide
                  color={colors.textOnPrimary}
                  name="plus"
                  size={PLUS_ICON_SIZE}
                />
              }
              size="sm"
            />
          </View>
        </View>

        <PromptCard
          body={t('screen_dashboard.promptBody')}
          title={t('screen_dashboard.promptTitle')}
        />

        <View style={[layout.col, gutters.gap_12]}>
          <SectionHeader
            actionLabel={t('screen_dashboard.seeAll')}
            count={TODAY_ACTIVITIES.length}
            title={t('screen_dashboard.todayTitle')}
          />

          <View style={[layout.col, gutters.gap_12]}>
            {TODAY_ACTIVITIES.map((activity) => (
              <ActivityCard
                done={activity.done}
                key={activity.id}
                reminded={activity.reminded}
                time={activity.time}
                title={activity.title}
              />
            ))}
          </View>
        </View>

        <View style={[layout.col, gutters.gap_12]}>
          <SectionHeader
            actionLabel={t('screen_dashboard.openAgenda')}
            title={t('screen_dashboard.upcomingTitle')}
          />

          <UpcomingCard
            day={formatDay(upcomingDate)}
            meta={t('screen_dashboard.upcomingMeta')}
            month={formatMonth(upcomingDate, i18n.language)}
            title={t('screen_dashboard.upcomingItemTitle')}
          />
        </View>

        <View
          style={[
            layout.row,
            layout.itemsCenter,
            layout.justifyCenter,
            gutters.gap_7,
          ]}
        >
          <Lucide
            color={colors.textSecondary}
            name="shield-check"
            size={NOTE_ICON_SIZE}
          />
          <Text color="textSecondary" variant="captionPrimary">
            {t('screen_dashboard.privacyNote')}
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default Dashboard;
