import type { UserCredentials } from 'react-native-keychain';

import {
  ACCESSIBLE,
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';

import { getApiBaseUrl } from '@/services/instance';

import { AuthApiError, AuthServices } from './authService';
import { restoreSession, saveSession, signOut, useSession } from './session';

jest.mock('@/services/instance', () => ({ getApiBaseUrl: jest.fn() }));

const backend = 'https://sara.example.test/api';
const token = 'test-token';
const user = { email: 'jane@example.test', id: 1, name: 'Jane Doe' };
const keychain = { service: 'sara.session' };
const credentials: UserCredentials = {
  ...keychain,
  password: token,
  storage: 'keychain',
  username: backend,
};
const UNAUTHORIZED = 401;
const USER_NOT_FOUND = 404;

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getApiBaseUrl).mockResolvedValue(backend);
  jest.mocked(getGenericPassword).mockResolvedValue(credentials);
  useSession.setState(useSession.getInitialState());
});

afterEach(() => {
  jest.restoreAllMocks();
});

it('stores only the token and its backend securely before opening a session', async () => {
  await expect(saveSession({ token, user })).resolves.toEqual(user);

  expect(setGenericPassword).toHaveBeenCalledWith(backend, token, {
    ...keychain,
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  expect(useSession.getState().session).toEqual({ status: 'signedIn', user });
});

it('does not open a session if secure storage rejects the write', async () => {
  jest.mocked(setGenericPassword).mockResolvedValueOnce(false);

  await expect(saveSession({ token, user })).rejects.toThrow();

  expect(useSession.getState().session.status).toBe('checking');
});

it('checks a saved token with the backend and restores its profile', async () => {
  const me = jest
    .spyOn(AuthServices, 'me')
    .mockResolvedValue({ ...user, emailVerified: true });

  await restoreSession();

  expect(me).toHaveBeenCalledWith(token);
  expect(useSession.getState().session).toMatchObject({
    status: 'signedIn',
    user,
  });
});

it('does not send a stored token to a different backend', async () => {
  const me = jest.spyOn(AuthServices, 'me');
  jest
    .mocked(getApiBaseUrl)
    .mockResolvedValueOnce('https://other.example.test');

  await restoreSession();

  expect(me).not.toHaveBeenCalled();
  expect(useSession.getState().session.status).toBe('signedOut');
});

it.each([UNAUTHORIZED, USER_NOT_FOUND])(
  'clears the saved token and prompts for login on %s',
  async (status) => {
    jest
      .spyOn(AuthServices, 'me')
      .mockRejectedValue(new AuthApiError(status, 'Session no longer exists'));

    await restoreSession();

    expect(resetGenericPassword).toHaveBeenCalledWith(keychain);
    expect(useSession.getState().session).toEqual({
      showLogin: true,
      status: 'signedOut',
    });
  },
);

it('keeps the saved token on a transient failure and can retry', async () => {
  jest
    .spyOn(AuthServices, 'me')
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValueOnce({ ...user, emailVerified: true });

  await restoreSession();
  expect(useSession.getState().session.status).toBe('restoreError');
  expect(resetGenericPassword).not.toHaveBeenCalled();

  await restoreSession();
  expect(useSession.getState().session.status).toBe('signedIn');
});

it('keeps the session and its cache if secure sign-out fails', async () => {
  const clearCache = jest.fn();
  useSession.setState({ session: { status: 'signedIn', user } });
  jest.mocked(resetGenericPassword).mockResolvedValueOnce(false);

  await expect(signOut(clearCache)).rejects.toThrow();

  expect(clearCache).not.toHaveBeenCalled();
  expect(useSession.getState().session.status).toBe('signedIn');
});
