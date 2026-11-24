import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

const ICON_SIZE = 32;

/**
 * Stand-in for the tab screens that have no design yet.
 */
function Placeholder() {
  const { t } = useTranslation();
  const { colors, gutters, layout } = useTheme();

  return (
    <SafeScreen>
      <View
        style={[
          layout.flex_1,
          layout.col,
          layout.itemsCenter,
          layout.justifyCenter,
          gutters.gap_12,
          gutters.padding_24,
        ]}
      >
        <Lucide color={colors.textAccent} name="sparkles" size={ICON_SIZE} />

        <Text color="textPrimary" variant="headingTertiary">
          {t('screen_placeholder.title')}
        </Text>

        <Text
          color="textSecondary"
          style={{ textAlign: 'center' }}
          variant="bodySecondary"
        >
          {t('screen_placeholder.body')}
        </Text>
      </View>
    </SafeScreen>
  );
}

export default Placeholder;
