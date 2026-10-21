import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';

type Properties = {
  readonly onReset?: () => void;
};

function DefaultErrorScreen({ onReset = undefined }: Properties) {
  const { colors, fonts, gutters, layout } = useTheme();
  const { t } = useTranslation();
  const { resetBoundary } = useErrorBoundary();

  return (
    <View
      style={[
        layout.flex_1,
        layout.justifyCenter,
        layout.itemsCenter,
        gutters.gap_16,
        gutters.padding_16,
      ]}
    >
      <Lucide color={colors.errorForeground} name="flame" size={42} />
      <Text variant="titlePrimary">{t('error_boundary.title')}</Text>
      <Text style={fonts.alignCenter} variant="bodyPrimary">
        {t('error_boundary.description')}
      </Text>

      {onReset ? (
        <TouchableOpacity
          onPress={() => {
            resetBoundary();
            onReset();
          }}
        >
          <Text variant="titlePrimary">{t('error_boundary.cta')}</Text>
        </TouchableOpacity>
      ) : undefined}
    </View>
  );
}

export default DefaultErrorScreen;
