import type { TextInputProps } from 'react-native';

import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { useTheme } from '@/theme';
import { textStyles } from '@/theme/tokens';
import type { Colors } from '@/theme/types/colors';

type Palette = {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly iconColor: string;
  readonly placeholderColor: string;
  readonly valueColor: string;
};

type Properties = {
  readonly disabled?: boolean;
  readonly placeholder?: string;
} & Omit<TextInputProps, 'children' | 'editable' | 'multiline' | 'style'>;

const FIELD_HEIGHT = 44;
const ICON_SIZE = 18;
const LINE_HEIGHT = 21;

const resolvePalette = (colors: Colors, disabled: boolean): Palette => {
  if (disabled) {
    return {
      backgroundColor: colors.surfaceNeutral,
      borderColor: colors.borderControl,
      iconColor: colors.iconDisabled,
      placeholderColor: colors.textDisabled,
      valueColor: colors.textDisabled,
    };
  }

  return {
    backgroundColor: colors.surfaceCard,
    borderColor: colors.borderControl,
    iconColor: colors.iconSecondary,
    placeholderColor: colors.textSecondary,
    valueColor: colors.textPrimary,
  };
};

/**
 * A dedicated search field with a quiet leading search icon. It follows the
 * `SARA/SearchInput` component: a tinted surface, a 10px radius and a single
 * resting state without focus or validation decorations.
 */
function SearchInput({
  disabled = false,
  placeholder = undefined,
  testID = undefined,
  ...props
}: Properties) {
  const { t } = useTranslation();
  const { borders, colors, gutters, layout } = useTheme();

  const palette = resolvePalette(colors, disabled);

  return (
    <View
      style={[
        layout.row,
        layout.itemsCenter,
        gutters.gap_10,
        gutters.paddingHorizontal_14,
        borders.rounded_10,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          borderWidth: borders.w_1.borderWidth,
          height: FIELD_HEIGHT,
        },
      ]}
      testID={testID ? `${testID}-field` : undefined}
    >
      <Lucide color={palette.iconColor} name="search" size={ICON_SIZE} />

      <TextInput
        {...props}
        accessibilityState={{ disabled }}
        cursorColor={colors.primary}
        editable={!disabled}
        focusable={!disabled}
        placeholder={placeholder ?? t('common_searchPlaceholder')}
        placeholderTextColor={palette.placeholderColor}
        returnKeyType="search"
        style={[
          textStyles.bodySecondary,
          {
            color: palette.valueColor,
            flex: 1,
            lineHeight: LINE_HEIGHT,
            paddingHorizontal: 0,
            paddingVertical: 0,
            textAlignVertical: 'center',
          },
        ]}
        testID={testID}
      />
    </View>
  );
}

export default SearchInput;
