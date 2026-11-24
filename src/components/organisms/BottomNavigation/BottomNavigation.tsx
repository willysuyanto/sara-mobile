import type { LucideIconName } from '@react-native-vector-icons/lucide/static';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { Lucide } from '@react-native-vector-icons/lucide/static';
import { Pressable, View } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';

const BOTTOM_PADDING = 8;
const ICON_SIZE = 20;
const SYMBOL_HEIGHT = 32;
const SYMBOL_WIDTH = 40;

const TAB_ICONS: Partial<Record<string, LucideIconName>> = {
  [Paths.Aktivitas]: 'clipboard-list',
  [Paths.Beranda]: 'house',
  [Paths.Pengaturan]: 'settings',
  [Paths.Riwayat]: 'history',
  [Paths.Sara]: 'sparkles',
};

/**
 * Custom SARA bottom bar: five destinations with a tinted pill and a dot under
 * the active label.
 */
function BottomNavigation({
  descriptors,
  insets,
  navigation,
  state,
}: BottomTabBarProps) {
  const { borders, colors, gutters, layout } = useTheme();

  return (
    <View
      style={[
        layout.row,
        gutters.gap_4,
        {
          backgroundColor: colors.surfacePrimary,
          borderTopColor: colors.borderPrimary,
          borderTopWidth: borders.w_1.borderWidth,
          paddingBottom: Math.max(insets.bottom, BOTTOM_PADDING),
          paddingHorizontal: gutters.paddingHorizontal_4.paddingHorizontal,
          paddingTop: gutters.paddingTop_12.paddingTop,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;

        const handlePress = () => {
          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: 'tabPress',
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            accessibilityLabel={label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            key={route.key}
            onPress={handlePress}
            style={[layout.flex_1, layout.itemsCenter, gutters.gap_6]}
          >
            <View
              style={[
                layout.itemsCenter,
                layout.justifyCenter,
                borders.rounded_12,
                {
                  backgroundColor: isFocused
                    ? colors.surfaceAccent
                    : colors.surfacePrimary,
                  height: SYMBOL_HEIGHT,
                  width: SYMBOL_WIDTH,
                },
              ]}
            >
              <Lucide
                color={
                  isFocused ? colors.navigationActive : colors.textSecondary
                }
                name={TAB_ICONS[route.name] ?? 'circle'}
                size={ICON_SIZE}
              />
            </View>

            <Text
              color={isFocused ? 'navigationActive' : 'textSecondary'}
              variant={isFocused ? 'labelActive' : 'captionSmall'}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default BottomNavigation;
