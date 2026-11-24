import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

import { useAuth } from '@/hooks';
import { AuthApiError } from '@/hooks/domain/auth/authService';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Login from './Login';

jest.mock('@/hooks', () => ({
  ...jest.requireActual<typeof import('@/hooks')>('@/hooks'),
  useAuth: jest.fn(),
}));

const EMAIL_NOT_VERIFIED_STATUS = 403;
const INVALID_CREDENTIALS_STATUS = 401;
const INVALID_INPUT_STATUS = 422;
const PASSWORD_RULE_MESSAGE = 'Password must be at least 8 characters.';

type MutationOptions = {
  error?: unknown;
  pending?: boolean;
  result?: unknown;
};

const createMutation = ({
  error,
  pending = false,
  result,
}: MutationOptions = {}) => ({
  isPending: pending,
  mutate: jest.fn(
    (
      _values: unknown,
      options?: {
        onError?: (error: unknown) => void;
        onSuccess?: (result: unknown) => void;
      },
    ) => {
      if (error) {
        options?.onError?.(error);
        return;
      }
      options?.onSuccess?.(result ?? { message: '', success: true });
    },
  ),
});

type Mutation = ReturnType<typeof createMutation>;

const mockAuth = (login: Mutation = createMutation()) => {
  jest.mocked(useAuth).mockReturnValue({
    useLogin: () => login,
    useRegister: () => createMutation(),
    useResendOtp: () => createMutation(),
    useVerifyEmail: () => createMutation(),
  } as unknown as ReturnType<typeof useAuth>);
};

const createNavigation = () => ({
  navigate: jest.fn(),
  reset: jest.fn(),
});

const renderLogin = (
  navigation = createNavigation(),
  parameters?: { email?: string },
) =>
  render(
    <TestAppWrapper>
      <Login
        {...({
          navigation,
          route: { key: 'login', name: Paths.Login, params: parameters },
        } as unknown as RootScreenProps<Paths.Login>)}
      />
    </TestAppWrapper>,
  );

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const fillCredentials = async (
  email = 'sara@sara.app',
  password = 'password123',
) => {
  fireEvent.changeText(screen.getByTestId('login-email'), email);
  fireEvent.changeText(screen.getByTestId('login-password'), password);
  await flush();
};

describe('Login screen', () => {
  it('renders the title, subtitle and fields without remember me', () => {
    mockAuth();
    renderLogin();

    expect(screen.getByText('Selamat datang kembali!')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Kata sandi')).toBeTruthy();
    expect(screen.queryByText('Ingat saya')).toBeNull();
    expect(screen.getByText('Lupa kata sandi?')).toBeTruthy();
    expect(screen.getByText('Masuk')).toBeTruthy();
  });

  it('prefills the email from the route params', () => {
    mockAuth();
    renderLogin(createNavigation(), { email: 'sara@sara.app' });

    expect(screen.getByTestId('login-email')).toHaveProp(
      'value',
      'sara@sara.app',
    );
  });

  it('disables the submit button while the form is invalid', () => {
    mockAuth();
    renderLogin();

    expect(screen.getByTestId('login-submit')).toHaveProp(
      'accessibilityState',
      { busy: false, disabled: true },
    );
  });

  it('shows a validation error for an invalid email', async () => {
    mockAuth();
    renderLogin();

    fireEvent.changeText(screen.getByTestId('login-email'), 'bukan-email');
    await flush();

    expect(screen.getByText('Masukkan alamat email yang valid.')).toBeTruthy();
  });

  it('submits short passwords unchanged without a length hint', async () => {
    const login = createMutation();
    mockAuth(login);
    renderLogin();

    await fillCredentials('sara@sara.app', ' a ');
    fireEvent.press(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(login.mutate).toHaveBeenCalledWith(
        { email: 'sara@sara.app', password: ' a ' },
        expect.anything(),
      );
    });
  });

  it('submits valid credentials without navigating, leaving it to the session', async () => {
    const navigation = createNavigation();
    const login = createMutation();
    mockAuth(login);
    renderLogin(navigation);

    await fillCredentials();
    fireEvent.press(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(login.mutate).toHaveBeenCalledWith(
        { email: 'sara@sara.app', password: 'password123' },
        expect.anything(),
      );
    });
    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(navigation.reset).not.toHaveBeenCalled();
  });

  it('normalizes the email before submitting', async () => {
    const login = createMutation();
    mockAuth(login);
    renderLogin();

    await fillCredentials(' SARA@Sara.App ');
    fireEvent.press(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(login.mutate).toHaveBeenCalledWith(
        { email: 'sara@sara.app', password: 'password123' },
        expect.anything(),
      );
    });
  });

  it('navigates to verify email when the account is not verified', async () => {
    const navigation = createNavigation();
    mockAuth(
      createMutation({
        error: new AuthApiError(
          EMAIL_NOT_VERIFIED_STATUS,
          'Email is not verified',
          { code: 'EMAIL_NOT_VERIFIED' },
        ),
      }),
    );
    renderLogin(navigation);

    await fillCredentials(' SARA@Sara.App ');
    fireEvent.press(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith(Paths.VerifyEmail, {
        email: 'sara@sara.app',
      });
    });
  });

  it.each([INVALID_CREDENTIALS_STATUS, INVALID_INPUT_STATUS])(
    'shows the same credential error for status %s without password rules',
    async (status) => {
      mockAuth(
        createMutation({
          error: new AuthApiError(status, PASSWORD_RULE_MESSAGE),
        }),
      );
      renderLogin();

      await fillCredentials();
      fireEvent.press(screen.getByTestId('login-submit'));

      expect(
        await screen.findByText('Email atau kata sandi salah.'),
      ).toBeOnTheScreen();
      expect(screen.queryByText(PASSWORD_RULE_MESSAGE)).toBeNull();
    },
  );

  it('falls back to the localized message for unexpected errors', async () => {
    mockAuth(createMutation({ error: new Error('boom') }));
    renderLogin();

    await fillCredentials();
    fireEvent.press(screen.getByTestId('login-submit'));

    expect(await screen.findByText('Ups! Terjadi kesalahan.')).toBeTruthy();
  });

  it('navigates to register from the footer link', () => {
    mockAuth();
    const navigation = createNavigation();
    renderLogin(navigation);

    fireEvent.press(screen.getByTestId('login-register-link'));

    expect(navigation.navigate).toHaveBeenCalledWith(Paths.Register);
  });

  it('navigates to forgot password from the link', () => {
    mockAuth();
    const navigation = createNavigation();
    renderLogin(navigation);

    fireEvent.press(screen.getByTestId('login-forgot-password'));

    expect(navigation.navigate).toHaveBeenCalledWith(Paths.ForgotPassword);
  });
});
