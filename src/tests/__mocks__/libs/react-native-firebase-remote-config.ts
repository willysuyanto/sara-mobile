jest.mock('@react-native-firebase/remote-config', () => ({
  fetchAndActivate: jest.fn().mockResolvedValue(false),
  getRemoteConfig: jest.fn(() => ({})),
  getString: jest.fn().mockReturnValue(''),
}));
