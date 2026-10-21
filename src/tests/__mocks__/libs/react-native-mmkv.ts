jest.mock('react-native-mmkv', () => {
  const { createMockMMKV } = jest.requireActual<
    typeof import('react-native-mmkv/lib/createMMKV/createMockMMKV')
  >('react-native-mmkv/lib/createMMKV/createMockMMKV');

  return { createMMKV: createMockMMKV };
});
