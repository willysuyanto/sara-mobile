import type { ReactotronReactNative } from 'reactotron-react-native';

import Reactotron from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';

import config from '../app.json';
import { storage } from './App';

Reactotron.configure({
  name: config.name,
})
  .useReactNative({ networking: { ignoreUrls: /\/auth\// } })
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .connect();
