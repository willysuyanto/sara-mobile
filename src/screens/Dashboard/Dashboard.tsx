import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

/**
 * Empty home placeholder shown after a successful sign-in. Real dashboard
 * content lands here later.
 */
function Dashboard() {
  const { t } = useTranslation();
  const { gutters, layout } = useTheme();

  return (
    <SafeScreen>
      <View
        style={[
          layout.flex_1,
          layout.col,
          layout.itemsCenter,
          layout.justifyCenter,
          gutters.gap_8,
          gutters.padding_24,
        ]}
      >
        <Text color="textAccent" variant="overlinePrimary">
          {t('screen_dashboard.eyebrow')}
        </Text>

        <Text
          color="textPrimary"
          style={{ textAlign: 'center' }}
          variant="headingBrand"
        >
          {t('screen_dashboard.title')}
        </Text>

        <Text
          color="textSecondary"
          style={{ textAlign: 'center' }}
          variant="bodySecondary"
        >
          {t('screen_dashboard.body')}
        </Text>
      </View>
    </SafeScreen>
  );
}

export default Dashboard;
