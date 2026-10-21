import type { PropsWithChildren, ReactNode } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { useTheme } from '@/theme';

import { IconByVariant, Text } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

type Properties = PropsWithChildren<{
  readonly footer?: ReactNode;
  readonly subtitle: string;
  readonly title: string;
}>;

const LOGO_SIZE = 56;
const LOGO_MARK_SIZE = 28;
const SHADOW_OPACITY = 0.07;
const ELEVATION = 3;
const SHADOW_RADIUS = 6;
const SHADOW_OFFSET_Y = 3;
const HEADER_GAP = 36;

/**
 * Screen shell for the authentication flow: brand header, title, subtitle and
 * a scrollable body that stays clear of the keyboard. Content is passed as
 * children; the optional `footer` sits below it.
 */
function AuthTemplate({
  children = undefined,
  footer = undefined,
  subtitle,
  title,
}: Properties) {
  const { backgrounds, borders, colors, gutters, layout } = useTheme();

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={layout.flex_1}
      >
        <ScrollView
          contentContainerStyle={[
            layout.col,
            layout.itemsCenter,
            gutters.gap_32,
            gutters.padding_24,
            { paddingTop: HEADER_GAP },
          ]}
          keyboardShouldPersistTaps="handled"
          style={[layout.flex_1, backgrounds.backgroundPrimary]}
        >
          <View
            style={[
              layout.col,
              layout.itemsCenter,
              gutters.gap_9,
              layout.fullWidth,
            ]}
          >
            <View
              style={[
                layout.itemsCenter,
                layout.justifyCenter,
                borders.rounded_18,
                {
                  backgroundColor: colors.brandMark,
                  elevation: ELEVATION,
                  height: LOGO_SIZE,
                  shadowColor: colors.brandBackground,
                  shadowOffset: { height: SHADOW_OFFSET_Y, width: 0 },
                  shadowOpacity: SHADOW_OPACITY,
                  shadowRadius: SHADOW_RADIUS,
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
          </View>

          <View
            style={[
              layout.col,
              layout.itemsStart,
              gutters.gap_9,
              layout.fullWidth,
            ]}
          >
            <Text color="textPrimary" variant="headingBrand">
              {title}
            </Text>

            <Text color="textSecondary" variant="brandCaption">
              {subtitle}
            </Text>
          </View>

          <View style={[layout.fullWidth, gutters.gap_12]}>{children}</View>

          {footer ? <View style={layout.fullWidth}>{footer}</View> : undefined}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

export default AuthTemplate;
