import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar, View } from 'react-native';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useTheme } from '@/theme';

import { IconByVariant, Text } from '@/components/atoms';

const LOGO_HEIGHT = 56;
const MARK_SIZE = 28;
const SPLASH_DURATION_MS = 2000;
const TAGLINE_WIDTH = 226;

export { SPLASH_DURATION_MS };

function Splashscreen({ navigation }: RootScreenProps<Paths.Splashscreen>) {
  const { backgrounds, borders, colors, gutters, layout } = useTheme();
  const { t } = useTranslation();

  const { isSuccess } = useQuery({
    queryFn: () => Promise.resolve(true),
    queryKey: ['startup'],
  });

  useEffect(() => {
    if (!isSuccess) {
      return undefined;
    }

    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Landing }],
      });
    }, SPLASH_DURATION_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [isSuccess, navigation]);

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
      </View>
    </View>
  );
}

export default Splashscreen;
