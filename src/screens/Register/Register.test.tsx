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

import Register from './Register';

jest.mock('@/hooks', () => ({
  ...jest.requireActual<typeof import('@/hooks')>('@/hooks'),
  useAuth: jest.fn(),
}));

const EMAIL_FAILED_STATUS = 503;
const CONFLICT_STATUS = 409;
const INVALID_INPUT_STATUS = 422;
const SERVER_MESSAGE = 'Email is already registered';
const EMAIL_FAILED_MESSAGE =
  'Akunmu sudah dibuat, tetapi email verifikasi gagal dikirim.';

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

const mockAuth = (register: Mutation = createMutation()) => {
  jest.mocked(useAuth).mockReturnValue({
    useLogin: () => createMutation(),
    useRegister: () => register,
    useResendOtp: () => createMutation(),
    useVerifyEmail: () => createMutation(),
  } as unknown as ReturnType<typeof useAuth>);
};

const createNavigation = () => ({
  navigate: jest.fn(),
  reset: jest.fn(),
});

const renderRegister = (navigation = createNavigation()) =>
  render(
    <TestAppWrapper>
      <Register
        {...({
          navigation,
          route: { key: 'register', name: Paths.Register },
        } as unknown as RootScreenProps<Paths.Register>)}
      />
    </TestAppWrapper>,
  );

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const fillValidForm = async (email = 'sara@sara.app') => {
  fireEvent.changeText(screen.getByTestId('register-full-name'), 'Sara');
  fireEvent.changeText(screen.getByTestId('register-email'), email);
  fireEvent.changeText(screen.getByTestId('register-password'), 'password123');
  fireEvent.changeText(
    screen.getByTestId('register-confirm-password'),
    'password123',
  );
  await flush();
};

describe('Register screen', () => {
  it('renders the title, subtitle and fields', () => {
    mockAuth();
    renderRegister();

    expect(screen.getByText('Mulai perjalanan produktifmu')).toBeTruthy();
    expect(screen.getByText('Nama lengkap')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Kata sandi')).toBeTruthy();
    expect(screen.getByText('Konfirmasi kata sandi')).toBeTruthy();
    expect(screen.getByText('Buat akun')).toBeTruthy();
  });

  it('disables the submit button while the form is invalid', () => {
    mockAuth();
    renderRegister();

    expect(screen.getByTestId('register-submit')).toHaveProp(
      'accessibilityState',
      { busy: false, disabled: true },
    );
  });

  it('shows a validation error when the passwords do not match', async () => {
    mockAuth();
    renderRegister();

    fireEvent.changeText(screen.getByTestId('register-full-name'), 'Sara');
    fireEvent.changeText(screen.getByTestId('register-email'), 'sara@sara.app');
    fireEvent.changeText(
      screen.getByTestId('register-password'),
      'password123',
    );
    fireEvent.changeText(
      screen.getByTestId('register-confirm-password'),
      'password456',
    );
    await flush();

    expect(screen.getByText('Kata sandi tidak cocok.')).toBeTruthy();
  });

  it('blocks an invalid new password without showing the length requirement', async () => {
    mockAuth();
    renderRegister();
    await fillValidForm();

    fireEvent.changeText(screen.getByTestId('register-password'), 'short1');
    await flush();

    expect(screen.getByText('Pilih kata sandi lain.')).toBeOnTheScreen();
    expect(screen.getByTestId('register-submit')).toBeDisabled();
  });

  it('shows a validation error when the full name is invalid', async () => {
    mockAuth();
    renderRegister();

    fireEvent.changeText(screen.getByTestId('register-full-name'), 'A');
    await flush();

    fireEvent.changeText(screen.getByTestId('register-email'), 'sara@sara.app');
    await flush();

    expect(screen.getByText('Masukkan nama lengkap yang valid.')).toBeTruthy();
  });

  it('submits a valid form and navigates to verify email', async () => {
    const navigation = createNavigation();
    const register = createMutation();
    mockAuth(register);
    renderRegister(navigation);

    await fillValidForm(' SARA@Sara.App ');
    fireEvent.press(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith(Paths.VerifyEmail, {
        email: 'sara@sara.app',
      });
    });
    expect(register.mutate).toHaveBeenCalledWith(
      {
        confirmPassword: 'password123',
        email: 'sara@sara.app',
        fullName: 'Sara',
        password: 'password123',
      },
      expect.anything(),
    );
  });

  it('still routes to verify email when the account exists but the email failed', async () => {
    const navigation = createNavigation();
    mockAuth(
      createMutation({
        error: new AuthApiError(
          EMAIL_FAILED_STATUS,
          'Verification email could not be sent',
        ),
      }),
    );
    renderRegister(navigation);

    await fillValidForm();
    fireEvent.press(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith(Paths.VerifyEmail, {
        email: 'sara@sara.app',
        message: 'Verification email could not be sent',
      });
    });
  });

  it('uses a localized message when the failed email has no server detail', async () => {
    const navigation = createNavigation();
    mockAuth(
      createMutation({
        error: new AuthApiError(EMAIL_FAILED_STATUS, 'common_error'),
      }),
    );
    renderRegister(navigation);

    await fillValidForm();
    fireEvent.press(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith(Paths.VerifyEmail, {
        email: 'sara@sara.app',
        message: EMAIL_FAILED_MESSAGE,
      });
    });
  });

  it('shows the server message when registration fails', async () => {
    mockAuth(
      createMutation({
        error: new AuthApiError(CONFLICT_STATUS, SERVER_MESSAGE),
      }),
    );
    renderRegister();

    await fillValidForm();
    fireEvent.press(screen.getByTestId('register-submit'));

    expect(await screen.findByText(SERVER_MESSAGE)).toBeTruthy();
  });

  it('falls back to the localized message for unexpected errors', async () => {
    mockAuth(createMutation({ error: new Error('boom') }));
    renderRegister();

    await fillValidForm();
    fireEvent.press(screen.getByTestId('register-submit'));

    expect(await screen.findByText('Ups! Terjadi kesalahan.')).toBeTruthy();
  });

  it('does not show password rules from a server validation error', async () => {
    const detail = 'Password must be at least 8 characters.';
    mockAuth(
      createMutation({ error: new AuthApiError(INVALID_INPUT_STATUS, detail) }),
    );
    renderRegister();

    await fillValidForm();
    fireEvent.press(screen.getByTestId('register-submit'));

    expect(
      await screen.findByText('Periksa data pendaftaran dan coba lagi.'),
    ).toBeOnTheScreen();
    expect(screen.queryByText(detail)).toBeNull();
  });

  it('navigates to login from the footer link', () => {
    mockAuth();
    const navigation = createNavigation();
    renderRegister(navigation);

    fireEvent.press(screen.getByTestId('register-login-link'));

    expect(navigation.navigate).toHaveBeenCalledWith(Paths.Login);
  });
});
