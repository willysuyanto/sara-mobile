import {
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  type RemoteMessage,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

const messaging = getMessaging();

/**
 * Registers the handler invoked when a message arrives while the app is in the
 * background or quit state. Must be called outside of the React tree, at module
 * scope (see `index.js`). The handler runs in headless JS: no React context is
 * available and it must resolve the returned Promise when done.
 */
export function registerBackgroundMessageHandler(
  handler: (message: RemoteMessage) => Promise<void>,
): void {
  setBackgroundMessageHandler(messaging, handler);
}

/** Returns `true` when the user already allowed notifications. */
export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await checkNotifications();
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
}

/**
 * Asks the user for notification permission.
 *
 * - iOS: native permission dialog via `react-native-permissions`.
 * - Android 13+: runtime `POST_NOTIFICATIONS` prompt (a no-op on older APIs).
 *
 * Returns `true` when notifications are enabled.
 */
export async function requestUserPermission(): Promise<boolean> {
  const { status } = await requestNotifications(['alert', 'badge', 'sound']);
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
}

/** Returns the FCM registration token used to target this device. */
export async function getFCMToken(): Promise<string> {
  return getToken(messaging);
}

/** Listens for messages received while the app is in the foreground. */
export function onForegroundMessage(
  listener: (message: RemoteMessage) => void,
): () => void {
  return onMessage(messaging, listener);
}

/** Listens for the user tapping a notification while the app is backgrounded. */
export function onNotificationOpened(
  listener: (message: RemoteMessage) => void,
): () => void {
  return onNotificationOpenedApp(messaging, listener);
}

/** Resolves with the message that launched the app from a quit state, if any. */
export function getLaunchNotification(): Promise<null | RemoteMessage> {
  return getInitialNotification(messaging);
}
