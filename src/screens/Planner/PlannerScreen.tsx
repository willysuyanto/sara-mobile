import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/theme';
import { textStyles } from '@/theme/tokens';

import { IconByVariant, Text } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

const ARROW_SIZE = 18;
const CHEVRON_SIZE = 14;
const SHIELD_SIZE = 12;
const SUGGESTIONS = ['review', 'meeting', 'report'] as const;

const styles = StyleSheet.create({
  action: { minHeight: 48 },
  brandLarge: { height: 64, width: 64 },
  brandSmall: { height: 36, width: 36 },
  centered: { textAlign: 'center', width: '100%' },
  composerLabel: { fontWeight: '700' },
  hero: { marginTop: 63 },
  input: {
    ...textStyles.bodySecondary,
    minHeight: 90,
    padding: 0,
    textAlignVertical: 'top',
  },
  intro: { fontSize: 11, lineHeight: 17 },
  manual: { minHeight: 44 },
  note: { lineHeight: 14 },
  shadow: {
    elevation: 3,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  suggestion: { minHeight: 40 },
  suggestionsHeading: { fontSize: 9, lineHeight: 16 },
  tagline: { flexShrink: 1, fontSize: 9, textAlign: 'right' },
  title: { fontSize: 26, lineHeight: 35.5 },
});

function BrandMark({ large = false }: { readonly large?: boolean }) {
  const { borders, colors, layout } = useTheme();

  return (
    <View
      style={[
        layout.itemsCenter,
        layout.justifyCenter,
        borders.rounded_12,
        styles.shadow,
        large ? styles.brandLarge : styles.brandSmall,
        { backgroundColor: colors.brandMark, shadowColor: colors.brandMark },
      ]}
    >
      <IconByVariant path="logo" stroke={colors.brandForeground} />
    </View>
  );
}

function PlannerScreen() {
  const { t } = useTranslation();
  const { backgrounds, borders, colors, gutters, layout } = useTheme();
  const [draft, setDraft] = useState('');
  const composer = useRef<TextInput>(null);
  const label = t('screen_planner.composerLabel');
  const manual = t('screen_planner.manual');
  const review = t('screen_planner.review');
  const unavailable = t('screen_planner.unavailable');

  return (
    <SafeScreen
      edges={['left', 'right', 'top']}
      style={backgrounds.backgroundSecondary}
    >
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[
          gutters.paddingHorizontal_24,
          gutters.paddingTop_12,
          gutters.paddingBottom_24,
        ]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            layout.row,
            layout.itemsCenter,
            layout.justifyBetween,
            gutters.gap_12,
          ]}
        >
          <View style={[layout.row, layout.itemsCenter, gutters.gap_10]}>
            <BrandMark />
            <Text color="brandLogo" variant="titleSecondary">
              SARA
              <Text variant="titleSecondary">.</Text>
            </Text>
          </View>
          <Text
            color="textSecondary"
            style={styles.tagline}
            variant="labelStatus"
          >
            {t('screen_planner.tagline')}
          </Text>
        </View>

        <View style={[layout.itemsCenter, styles.hero]}>
          <BrandMark large />
          <Text
            accessibilityRole="header"
            style={[styles.centered, styles.title]}
            variant="headingSecondary"
          >
            {t('screen_planner.heading')}
          </Text>
          <Text
            color="textSecondary"
            style={[gutters.marginTop_11, styles.centered, styles.intro]}
            variant="labelSecondary"
          >
            {t('screen_planner.intro')}
          </Text>
        </View>

        <View
          style={[
            backgrounds.surfaceCard,
            borders.rounded_16,
            borders.w_1,
            gutters.marginTop_32,
            gutters.paddingHorizontal_16,
            gutters.paddingTop_22,
            gutters.paddingBottom_16,
            { borderColor: colors.borderPrimary },
          ]}
        >
          <Text style={styles.composerLabel} variant="labelButtonSmall">
            {label}
          </Text>
          <TextInput
            accessibilityLabel={label}
            multiline
            onChangeText={setDraft}
            placeholder={t('screen_planner.placeholder')}
            placeholderTextColor={colors.textSecondary}
            ref={composer}
            selectionColor={colors.primary}
            style={[
              gutters.marginTop_12,
              styles.input,
              { color: colors.textPrimary },
            ]}
            value={draft}
          />
          <View
            style={[
              layout.row,
              layout.itemsCenter,
              gutters.gap_6,
              gutters.marginTop_12,
              gutters.paddingTop_10,
              {
                borderTopColor: colors.borderPrimary,
                borderTopWidth: borders.w_1.borderWidth,
              },
            ]}
          >
            <Lucide
              accessible={false}
              color={colors.textSecondary}
              name="shield-check"
              size={SHIELD_SIZE}
            />
            <Text
              color="textSecondary"
              style={[layout.flex_1, styles.note]}
              variant="captionSmall"
            >
              {t('screen_planner.privacyNote')}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityHint={unavailable}
          accessibilityLabel={review}
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={[
            layout.justifyCenter,
            backgrounds.buttonPrimaryBackground,
            borders.rounded_10,
            gutters.marginTop_12,
            gutters.padding_8,
            styles.action,
            styles.shadow,
            { shadowColor: colors.buttonPrimaryBackground },
          ]}
        >
          <Text
            color="textOnPrimary"
            style={styles.centered}
            variant="labelButton"
          >
            {review}
          </Text>
        </Pressable>

        <View style={[gutters.marginTop_32, gutters.gap_4]}>
          <Text
            accessibilityRole="header"
            color="textSecondary"
            style={styles.suggestionsHeading}
            variant="overlinePrimary"
          >
            {t('screen_planner.suggestionsHeading')}
          </Text>
          <View>
            {SUGGESTIONS.map((suggestion) => {
              const example = t(`screen_planner.suggestions.${suggestion}`);

              return (
                <Pressable
                  accessibilityHint={t('screen_planner.suggestionHint')}
                  accessibilityLabel={example}
                  accessibilityRole="button"
                  key={suggestion}
                  onPress={() => {
                    setDraft(example);
                    composer.current?.focus();
                  }}
                  style={({ pressed }) => [
                    layout.row,
                    layout.itemsCenter,
                    gutters.gap_8,
                    gutters.paddingVertical_8,
                    styles.suggestion,
                    pressed ? backgrounds.surfaceCard : undefined,
                    {
                      borderBottomColor: colors.borderPrimary,
                      borderBottomWidth: borders.w_1.borderWidth,
                    },
                  ]}
                >
                  <Text
                    color="textSecondary"
                    style={layout.flex_1}
                    variant="captionPrimary"
                  >
                    {example}
                  </Text>
                  <Lucide
                    color={colors.textSecondary}
                    name="chevron-right"
                    size={CHEVRON_SIZE}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          accessibilityHint={unavailable}
          accessibilityLabel={manual}
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={[
            layout.row,
            layout.itemsCenter,
            layout.justifyCenter,
            backgrounds.secondaryBackground,
            borders.rounded_10,
            borders.w_1,
            gutters.gap_8,
            gutters.marginTop_24,
            gutters.padding_8,
            styles.manual,
            { borderColor: colors.borderPrimary },
          ]}
        >
          <Lucide
            color={colors.textAccent}
            name="arrow-right"
            size={ARROW_SIZE}
          />
          <Text
            color="textAccent"
            style={{ flexShrink: 1 }}
            variant="labelButton"
          >
            {manual}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}

export default PlannerScreen;
