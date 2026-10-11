import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import AppHeadlessCheck from './src/AppHeadlessCheck';
import { registerBackgroundMessageHandler } from './src/services/messaging';

// Handles messages received while the app is in the background or quit state.
// Runs in headless JS: no React context, and the returned Promise must resolve
// once the message has been handled.
registerBackgroundMessageHandler(() => {
  // TODO: route the message into app logic (e.g. sync via the API layer).
  return Promise.resolve();
});

AppRegistry.registerComponent(appName, () => AppHeadlessCheck);
