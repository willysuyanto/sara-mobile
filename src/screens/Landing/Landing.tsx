import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useTheme } from '@/theme';

import {
  AssetByVariant,
  Button,
  IconByVariant,
  Text,
} from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

const LOGO_SIZE = 56;
const LOGO_MARK_SIZE = 28;
const ILLUSTRATION_WIDTH = 280;
const ILLUSTRATION_HEIGHT = 220;
const COPY_PADDING_TOP = 28;
const SHADOW_OPACITY = 0.07;

function Landing({ navigation }: RootScreenProps<Paths.Landing>) {
  const { t } = useTranslation();
  const { backgrounds, borders, colors, gutters, layout } = useTheme();

  const handleStart = () => {
    navigation.navigate(Paths.Login);
  };

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={[layout.itemsCenter, gutters.padding_24]}
        style={[layout.flex_1, backgrounds.backgroundPrimary]}
      >
        <View
          style={[
            layout.col,
            layout.itemsCenter,
            gutters.gap_9,
            gutters.paddingTop_24,
          ]}
        >
          <View
            style={[
              layout.itemsCenter,
              layout.justifyCenter,
              borders.rounded_18,
              {
                backgroundColor: colors.brandMark,
                elevation: 3,
                height: LOGO_SIZE,
                shadowColor: colors.brandBackground,
                shadowOffset: { height: 3, width: 0 },
                shadowOpacity: SHADOW_OPACITY,
                shadowRadius: 6,
                width: LOGO_SIZE,
              },
            ]}
          >
            <IconByVariant
              height={LOGO_MARK_SIZE}
              path="logo"
              stroke={colors.brandForeground}
              width={LOGO_MARK_SIZE}
            />
          </View>

          <Text color="textPrimary" variant="displayBrand">
            SARA
            <Text color="primary" variant="displayBrand">
              .
            </Text>
          </Text>

          <Text color="textSecondary" variant="brandCaption">
            {t('common_appName.long')}
          </Text>
        </View>

        <AssetByVariant
          path="landing-illustration"
          resizeMode="contain"
          style={[
            borders.rounded_8,
            gutters.marginTop_16,
            { height: ILLUSTRATION_HEIGHT, width: ILLUSTRATION_WIDTH },
          ]}
        />

        <View
          style={[
            layout.fullWidth,
            layout.itemsCenter,
            gutters.gap_9,
            { paddingTop: COPY_PADDING_TOP },
          ]}
        >
          <Text
            color="primary"
            style={[layout.fullWidth, { textAlign: 'center' }]}
            variant="headingBrand"
          >
            {t('screen_landing.heading')}
          </Text>

          <Text
            color="textPrimary"
            style={[layout.fullWidth, { textAlign: 'center' }]}
            variant="bodySecondary"
          >
            {t('screen_landing.body')}
          </Text>
        </View>

        <View style={[layout.fullWidth, gutters.marginTop_80]}>
          <Button
            fullWidth
            label={t('screen_landing.cta')}
            onPress={handleStart}
            testID="landing-cta"
            variant="primary"
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default Landing;
