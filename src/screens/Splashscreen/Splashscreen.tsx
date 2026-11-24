import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StatusBar, View } from 'react-native';

import { useTheme } from '@/theme';

import { Button, IconByVariant, Text } from '@/components/atoms';

const LOGO_HEIGHT = 56;
const MARK_SIZE = 28;
const TAGLINE_WIDTH = 226;

function Splashscreen({
  failed,
  onRetry,
}: {
  readonly failed: boolean;
  readonly onRetry: () => void;
}) {
  const { backgrounds, borders, colors, gutters, layout } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        layout.flex_1,
        layout.col,
        layout.itemsCenter,
        layout.justifyCenter,
        gutters.padding_24,
        backgrounds.brandBackground,
      ]}
    >
      <StatusBar
        backgroundColor={colors.brandBackground}
        barStyle="light-content"
      />

      <View style={[layout.col, layout.itemsCenter, gutters.gap_9]}>
        <View style={[layout.row, layout.itemsCenter, gutters.gap_9]}>
          <View
            style={[
              layout.itemsCenter,
              layout.justifyCenter,
              borders.rounded_18,
              {
                backgroundColor: colors.brandForeground,
                elevation: 3,
                height: LOGO_HEIGHT,
                shadowColor: colors.brandBackground,
                shadowOffset: { height: 3, width: 0 },
                shadowOpacity: 0.07,
                shadowRadius: 6,
                width: LOGO_HEIGHT,
              },
            ]}
          >
            <IconByVariant
              height={MARK_SIZE}
              path="logo"
              stroke={colors.brandMark}
              width={MARK_SIZE}
            />
          </View>

          <Text color="brandForeground" variant="displayBrand">
            SARA.
          </Text>
        </View>

        <Text
          color="brandForeground"
          style={{ textAlign: 'center', width: TAGLINE_WIDTH }}
          variant="brandCaption"
        >
          {t('common_appName.long')}
        </Text>
        {failed ? (
          <>
            <Text accessibilityRole="alert" color="brandForeground">
              {t('common_auth.restoreError')}
            </Text>
            <Button label={t('common_auth.retry')} onPress={onRetry} />
          </>
        ) : (
          <ActivityIndicator color={colors.brandForeground} />
        )}
      </View>
    </View>
  );
}

export default Splashscreen;
