import { setUpTests } from 'react-native-reanimated';

jest.mock('react-native-worklets', () => {
  return jest.requireActual<Record<string, unknown>>(
    'react-native-worklets/src/mock',
  );
});

setUpTests();
