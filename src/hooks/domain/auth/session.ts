import type { AuthUser, Session } from './schema';

import {
  ACCESSIBLE,
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';
import { create } from 'zustand';

import { getApiBaseUrl } from '@/services/instance';

import { AuthApiError, AuthServices } from './authService';

const keychain = { service: 'sara.session' };
const UNAUTHORIZED = 401;
const USER_NOT_FOUND = 404;

type SessionState =
  | { showLogin: boolean; status: 'signedOut' }
  | { status: 'checking' }
  | { status: 'restoreError' }
  | { status: 'signedIn'; user: AuthUser };

export const useSession = create<{ session: SessionState }>(() => ({
  session: { status: 'checking' },
}));

export async function saveSession({ token, user }: Session) {
  const backend = await getApiBaseUrl();
  const saved = await setGenericPassword(backend, token, {
    ...keychain,
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  if (!saved) {
    throw new Error('Could not save the session.');
  }
  useSession.setState({ session: { status: 'signedIn', user } });
  return user;
}

export async function signOut(clearCache: () => void) {
  await removeToken();
  clearCache();
  useSession.setState({ session: { showLogin: false, status: 'signedOut' } });
}

async function removeToken() {
  if (!(await resetGenericPassword(keychain))) {
    throw new Error('Could not remove the session.');
  }
}

let pendingRestore: Promise<void> | undefined;

export function restoreSession() {
  pendingRestore ??= checkStoredSession().finally(() => {
    pendingRestore = undefined;
  });
  return pendingRestore;
}

async function checkStoredSession() {
  useSession.setState({ session: { status: 'checking' } });
  try {
    const credentials = await getGenericPassword(keychain);
    if (!credentials || credentials.username !== (await getApiBaseUrl())) {
      useSession.setState({
        session: { showLogin: false, status: 'signedOut' },
      });
      return;
    }

    try {
      const user = await AuthServices.me(credentials.password);
      useSession.setState({ session: { status: 'signedIn', user } });
    } catch (error) {
      if (
        !(error instanceof AuthApiError) ||
        (error.status !== UNAUTHORIZED && error.status !== USER_NOT_FOUND)
      ) {
        throw error;
      }
      await removeToken();
      useSession.setState({
        session: { showLogin: true, status: 'signedOut' },
      });
    }
  } catch {
    useSession.setState({ session: { status: 'restoreError' } });
  }
}
