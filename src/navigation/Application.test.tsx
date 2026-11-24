import type { UserCredentials } from 'react-native-keychain';

import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { getGenericPassword, setGenericPassword } from 'react-native-keychain';

import { AuthApiError, AuthServices } from '@/hooks/domain/auth/authService';
import { useSession } from '@/hooks/domain/auth/session';

import TestAppWrapper from '@/tests/TestAppWrapper';

import ApplicationNavigator from './Application';

jest.mock('@/services/instance', () => ({
  getApiBaseUrl: () => Promise.resolve('https://sara.example.test/api'),
}));

const credentials: UserCredentials = {
  password: 'test-token',
  service: 'sara.session',
  storage: 'keychain',
  username: 'https://sara.example.test/api',
};
const UNAUTHORIZED = 401;
const user = { email: 'jane@example.test', id: 1, name: 'Jane Doe' };

beforeEach(() => {
  useSession.setState(useSession.getInitialState());
});

afterEach(() => {
  jest.restoreAllMocks();
});

it('shows Landing without exposing dashboard routes if no session is saved', async () => {
  render(<ApplicationNavigator />, { wrapper: TestAppWrapper });

  expect(
    await screen.findByRole('button', { name: 'Mulai sekarang' }),
  ).toBeOnTheScreen();
  expect(screen.queryByRole('tab')).toBeNull();
});

it('opens the dashboard when the saved token is valid', async () => {
  jest.mocked(getGenericPassword).mockResolvedValueOnce(credentials);
  jest.spyOn(AuthServices, 'me').mockResolvedValue({
    ...user,
    emailVerified: true,
  });
  render(<ApplicationNavigator />, { wrapper: TestAppWrapper });

  expect(await screen.findByText('Selamat pagi, Jane Doe')).toBeOnTheScreen();
});

it('opens the dashboard after sign-in and secure token storage', async () => {
  jest.spyOn(AuthServices, 'login').mockResolvedValue({
    token: credentials.password,
    user,
  });
  jest.mocked(setGenericPassword).mockImplementationOnce(() => {
    expect(screen.queryByRole('tab')).toBeNull();
    return Promise.resolve(credentials);
  });
  render(<ApplicationNavigator />, { wrapper: TestAppWrapper });

  fireEvent.press(await screen.findByTestId('landing-cta'));
  fireEvent.changeText(await screen.findByTestId('login-email'), user.email);
  fireEvent.changeText(screen.getByTestId('login-password'), 'Password123');
  await act(async () => {
    await Promise.resolve();
  });
  fireEvent.press(screen.getByTestId('login-submit'));

  expect(await screen.findByText('Selamat pagi, Jane Doe')).toBeOnTheScreen();
});

it('opens Login instead of the dashboard if the saved token has expired', async () => {
  jest.mocked(getGenericPassword).mockResolvedValueOnce(credentials);
  jest
    .spyOn(AuthServices, 'me')
    .mockRejectedValue(new AuthApiError(UNAUTHORIZED, 'Expired'));
  render(<ApplicationNavigator />, { wrapper: TestAppWrapper });

  expect(await screen.findByTestId('login-submit')).toBeOnTheScreen();
  expect(screen.queryByRole('tab')).toBeNull();
});
