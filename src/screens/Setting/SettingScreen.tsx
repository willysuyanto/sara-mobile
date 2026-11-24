import type { PermissionStatus } from 'react-native-permissions';

import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

import { useSession } from '@/hooks/domain/auth/session';
import { useTheme } from '@/theme';

import { Text } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

const ICON_SIZE = 18;
const SMALL_ICON_SIZE = 16;
const PRESSED_OPACITY = 0.85;

const styles = StyleSheet.create({
  avatar: { height: 46, width: 46 },
  brand: { fontSize: 18, lineHeight: 27 },
  heading: { fontSize: 25, lineHeight: 37.5 },
  intro: { lineHeight: 21 },
  note: { lineHeight: 18 },
  profile: { minHeight: 88 },
  row: { minHeight: 73 },
  rowTitle: { fontWeight: '500' },
  signOut: { minHeight: 48 },
  title: { fontSize: 20, lineHeight: 30 },
});

function SettingRow({
  busy = false,
  detail,
  icon,
  onPress = undefined,
  title,
}: {
  readonly busy?: boolean;
  readonly detail: string;
  readonly icon: 'bell' | 'shield-check';
  readonly onPress?: () => void;
  readonly title: string;
}) {
  const { backgrounds, borders, colors, gutters, layout } = useTheme();
  const disabled = busy || !onPress;

  return (
    <Pressable
      accessibilityLabel={`${title}. ${detail}`}
      accessibilityRole="button"
      accessibilityState={{ busy, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        layout.row,
        layout.itemsCenter,
        gutters.gap_14,
        gutters.paddingVertical_12,
        pressed && backgrounds.surfaceCard,
        {
          borderBottomColor: colors.borderPrimary,
          borderBottomWidth: borders.w_1.borderWidth,
        },
      ]}
    >
      <Lucide
        accessible={false}
        color={colors.textAccent}
        name={icon}
        size={ICON_SIZE}
      />
      <View style={[layout.flex_1, gutters.gap_5]}>
        <Text style={styles.rowTitle} variant="bodySecondary">
          {title}
        </Text>
        <Text color="textSecondary" variant="captionPrimary">
          {detail}
        </Text>
      </View>
      <Lucide
        accessible={false}
        color={colors.iconMuted}
        name="chevron-right"
        size={SMALL_ICON_SIZE}
      />
    </Pressable>
  );
}

function SettingScreen({
  isSigningOut = false,
  onSignOut,
}: {
  readonly isSigningOut?: boolean;
  readonly onSignOut: () => void;
}) {
  const { t } = useTranslation();
  const { backgrounds, borders, colors, gutters, layout } = useTheme();
  const user = useSession(({ session }) =>
    session.status === 'signedIn' ? session.user : undefined,
  );
  const [permission, setPermission] = useState<
    'checking' | 'error' | PermissionStatus
  >('checking');
  const [isRequesting, setIsRequesting] = useState(false);
  const permissionOperation = useRef(false);
  const enabled =
    permission === RESULTS.GRANTED || permission === RESULTS.LIMITED;
  const signOut = t('screen_settings.signOut');

  const refreshPermission = useCallback(async () => {
    if (permissionOperation.current) return;
    permissionOperation.current = true;
    try {
      const { status } = await checkNotifications();
      setPermission(status);
    } catch {
      setPermission('error');
    } finally {
      permissionOperation.current = false;
    }
  }, []);

  useEffect(() => {
    void refreshPermission();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshPermission();
    });
    return () => {
      subscription.remove();
    };
  }, [refreshPermission]);

  const showNotificationError = () => {
    Alert.alert(
      t('screen_settings.notificationPermission'),
      t('screen_settings.notifications.updateError'),
    );
  };

  const openNotificationSettings = async () => {
    try {
      await openSettings('notifications');
    } catch {
      showNotificationError();
    }
  };

  const handleNotificationPress = async () => {
    if (permissionOperation.current) return;
    if (permission === 'error') {
      await refreshPermission();
      return;
    }
    if (enabled || permission === RESULTS.BLOCKED) {
      await openNotificationSettings();
      return;
    }
    if (permission !== RESULTS.DENIED) return;

    permissionOperation.current = true;
    setIsRequesting(true);
    try {
      const { status } = await requestNotifications([
        'alert',
        'badge',
        'sound',
      ]);
      setPermission(status);
      if (status === RESULTS.BLOCKED) {
        Alert.alert(
          t('screen_settings.notificationPermission'),
          t('screen_settings.notifications.settingsMessage'),
          [
            { style: 'cancel', text: t('screen_settings.cancel') },
            {
              onPress: () => {
                void openNotificationSettings();
              },
              text: t('screen_settings.notifications.settingsAction'),
            },
          ],
        );
      }
    } catch {
      showNotificationError();
    } finally {
      permissionOperation.current = false;
      setIsRequesting(false);
    }
  };

  const notificationStatus = enabled
    ? 'enabled'
    : permission === RESULTS.DENIED || permission === RESULTS.BLOCKED
      ? 'disabled'
      : permission;

  return (
    <SafeScreen
      edges={['left', 'right', 'top']}
      style={backgrounds.backgroundSecondary}
    >
      <ScrollView
        contentContainerStyle={[
          gutters.paddingHorizontal_24,
          gutters.paddingBottom_24,
          { flexGrow: 1 },
        ]}
      >
        <Text
          accessibilityRole="header"
          color="primary"
          style={[gutters.paddingVertical_15, styles.title]}
          variant="headingBrand"
        >
          {t('navigation_tabs.settings')}
        </Text>

        <View style={[gutters.marginTop_23, gutters.gap_6]}>
          <Text
            accessibilityRole="header"
            style={styles.heading}
            variant="headingSecondary"
          >
            {t('screen_settings.heading')}
          </Text>
          <Text
            color="textSecondary"
            style={styles.intro}
            variant="bodySecondary"
          >
            {t('screen_settings.intro')}
          </Text>
        </View>

        <View
          style={[
            styles.profile,
            layout.row,
            layout.itemsCenter,
            backgrounds.surfaceCard,
            borders.rounded_16,
            borders.w_1,
            gutters.marginTop_22,
            gutters.padding_15,
            gutters.gap_14,
            { borderColor: colors.borderPrimary },
          ]}
        >
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[
              styles.avatar,
              borders.rounded_100,
              borders.w_1,
              backgrounds.surfacePrimary,
              { borderColor: colors.borderPrimary, padding: 2 },
            ]}
          >
            <View
              style={[
                layout.flex_1,
                layout.itemsCenter,
                layout.justifyCenter,
                borders.rounded_100,
                backgrounds.secondaryBackground,
              ]}
            >
              <Text color="textAccent" variant="labelPrimary">
                {user?.name.slice(0, 1).toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={[layout.flex_1, gutters.gap_7]}>
            <Text variant="titlePrimary">{user?.name}</Text>
            <Text color="textSecondary" variant="captionPrimary">
              {user?.email}
            </Text>
          </View>
          <Lucide
            accessible={false}
            color={colors.iconMuted}
            name="shield-check"
            size={ICON_SIZE}
          />
        </View>

        <View style={gutters.marginTop_22}>
          <SettingRow
            busy={isRequesting || permission === 'checking'}
            detail={t(`screen_settings.notifications.${notificationStatus}`)}
            icon="bell"
            onPress={
              permission === RESULTS.UNAVAILABLE
                ? undefined
                : () => {
                    void handleNotificationPress();
                  }
            }
            title={t('screen_settings.notificationPermission')}
          />
          <SettingRow
            detail={t('screen_settings.privateSessionDetail')}
            icon="shield-check"
            title={t('screen_settings.privateSession')}
          />
        </View>

        <View
          style={[
            layout.row,
            backgrounds.surfaceCard,
            borders.rounded_12,
            gutters.gap_10,
            gutters.marginTop_23,
            gutters.padding_14,
          ]}
        >
          <Lucide
            accessible={false}
            color={colors.iconMuted}
            name="info"
            size={SMALL_ICON_SIZE}
          />
          <Text
            color="textSecondary"
            style={[layout.flex_1, styles.note]}
            variant="captionPrimary"
          >
            {t('screen_settings.prototypeNote')}
          </Text>
        </View>

        <Pressable
          accessibilityLabel={signOut}
          accessibilityRole="button"
          accessibilityState={{ busy: isSigningOut, disabled: isSigningOut }}
          disabled={isSigningOut}
          onPress={() => {
            Alert.alert(
              t('screen_settings.signOutTitle'),
              t('screen_settings.signOutMessage'),
              [
                { style: 'cancel', text: t('screen_settings.cancel') },
                {
                  onPress: onSignOut,
                  style: 'destructive',
                  text: t('screen_settings.signOutConfirm'),
                },
              ],
            );
          }}
          style={({ pressed }) => [
            styles.signOut,
            layout.itemsCenter,
            layout.justifyCenter,
            backgrounds.secondaryBackground,
            borders.rounded_10,
            borders.w_1,
            gutters.marginTop_23,
            gutters.padding_8,
            { borderColor: colors.borderPrimary },
            pressed && { opacity: PRESSED_OPACITY },
          ]}
        >
          {isSigningOut ? (
            <ActivityIndicator color={colors.textAccent} />
          ) : (
            <Text color="textAccent" variant="labelButton">
              {signOut}
            </Text>
          )}
        </Pressable>

        <View
          style={[
            layout.flex_1,
            layout.itemsCenter,
            layout.justifyEnd,
            gutters.gap_6,
            gutters.paddingTop_32,
          ]}
        >
          <Text color="brandLogo" style={styles.brand} variant="titlePrimary">
            SARA
          </Text>
          <Text color="textSecondary" variant="captionSmall">
            {t('screen_settings.prototypeVersion')}
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default SettingScreen;
