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

import VerifyEmail from './VerifyEmail';

jest.mock('@/hooks', () => ({
  ...jest.requireActual<typeof import('@/hooks')>('@/hooks'),
  useAuth: jest.fn(),
}));

const BAD_REQUEST_STATUS = 400;
const TOO_MANY_REQUESTS_STATUS = 429;
const EMAIL = 'sara@sara.app';
const CODE = '012345';
const RESEND_FALLBACK =
  'Jika email ini perlu verifikasi, kode akan dikirim saat diizinkan.';

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

const mockAuth = ({
  resendOtp = createMutation(),
  verifyEmail = createMutation(),
}: {
  resendOtp?: Mutation;
  verifyEmail?: Mutation;
} = {}) => {
  jest.mocked(useAuth).mockReturnValue({
    useLogin: () => createMutation(),
    useRegister: () => createMutation(),
    useResendOtp: () => resendOtp,
    useVerifyEmail: () => verifyEmail,
  } as unknown as ReturnType<typeof useAuth>);
};

const createNavigation = () => ({
  navigate: jest.fn(),
  reset: jest.fn(),
});

const DEFAULT_PARAMETERS = { email: EMAIL };

const renderVerifyEmail = (
  navigation = createNavigation(),
  parameters: { email: string; message?: string } = DEFAULT_PARAMETERS,
) =>
  render(
    <TestAppWrapper>
      <VerifyEmail
        {...({
          navigation,
          route: {
            key: 'verifyEmail',
            name: Paths.VerifyEmail,
            params: parameters,
          },
        } as unknown as RootScreenProps<Paths.VerifyEmail>)}
      />
    </TestAppWrapper>,
  );

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const enterCode = async (code: string) => {
  fireEvent.changeText(screen.getByTestId('verify-email-code'), code);
  await flush();
};

describe('VerifyEmail screen', () => {
  it('renders the title, email target and actions', () => {
    mockAuth();
    renderVerifyEmail();

    expect(screen.getByText('Verifikasi emailmu')).toBeTruthy();
    expect(
      screen.getByText('Periksa sara@sara.app untuk kode 6 digit.'),
    ).toBeTruthy();
    expect(screen.getByText('Kode verifikasi')).toBeTruthy();
    expect(screen.getByText('Verifikasi email')).toBeTruthy();
    expect(screen.getByText('Kirim ulang kode')).toBeTruthy();
  });

  it('shows the message passed by the registration flow', () => {
    mockAuth();
    renderVerifyEmail(createNavigation(), {
      email: EMAIL,
      message: 'Email verifikasi gagal dikirim.',
    });

    expect(screen.getByText('Email verifikasi gagal dikirim.')).toBeTruthy();
  });

  it('rejects a code that is not six digits', async () => {
    mockAuth();
    renderVerifyEmail();

    await enterCode('12345');

    expect(screen.getByText('Masukkan kode 6 digit.')).toBeTruthy();
  });

  it('keeps leading zeroes and resets to login with the email prefilled', async () => {
    const navigation = createNavigation();
    const verifyEmail = createMutation();
    mockAuth({ verifyEmail });
    renderVerifyEmail(navigation);

    await enterCode(CODE);
    fireEvent.press(screen.getByTestId('verify-email-submit'));

    await waitFor(() => {
      expect(verifyEmail.mutate).toHaveBeenCalledWith(
        { code: CODE, email: EMAIL },
        expect.anything(),
      );
    });
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: Paths.Login, params: { email: EMAIL } }],
    });
  });

  it('shows the server message when verification fails', async () => {
    const navigation = createNavigation();
    const serverMessage = 'Kode tidak valid atau sudah kedaluwarsa';
    mockAuth({
      verifyEmail: createMutation({
        error: new AuthApiError(BAD_REQUEST_STATUS, serverMessage),
      }),
    });
    renderVerifyEmail(navigation);

    await enterCode(CODE);
    fireEvent.press(screen.getByTestId('verify-email-submit'));

    expect(await screen.findByText(serverMessage)).toBeTruthy();
    expect(navigation.reset).not.toHaveBeenCalled();
  });

  it('shows the server message after resending a code', async () => {
    const resendOtp = createMutation({
      result: {
        message: 'If this address is registered, a code was sent.',
        success: true,
      },
    });
    mockAuth({ resendOtp });
    renderVerifyEmail();

    fireEvent.press(screen.getByTestId('verify-email-resend'));

    expect(
      await screen.findByText(
        'If this address is registered, a code was sent.',
      ),
    ).toBeTruthy();
    expect(resendOtp.mutate).toHaveBeenCalledWith(
      { email: EMAIL },
      expect.anything(),
    );
  });

  it('uses a neutral fallback when resend returns no message', async () => {
    mockAuth({ resendOtp: createMutation() });
    renderVerifyEmail();

    fireEvent.press(screen.getByTestId('verify-email-resend'));

    expect(await screen.findByText(RESEND_FALLBACK)).toBeTruthy();
  });

  it('shows the server message when resend is rate limited', async () => {
    const serverMessage = 'Terlalu banyak permintaan. Coba lagi nanti.';
    mockAuth({
      resendOtp: createMutation({
        error: new AuthApiError(TOO_MANY_REQUESTS_STATUS, serverMessage),
      }),
    });
    renderVerifyEmail();

    fireEvent.press(screen.getByTestId('verify-email-resend'));

    expect(await screen.findByText(serverMessage)).toBeTruthy();
  });

  it('disables both actions while verification is pending', () => {
    const verifyEmail = createMutation({ pending: true });
    const resendOtp = createMutation();
    mockAuth({ resendOtp, verifyEmail });
    renderVerifyEmail();

    expect(screen.getByTestId('verify-email-submit')).toHaveProp(
      'accessibilityState',
      { busy: true, disabled: true },
    );
    expect(screen.getByTestId('verify-email-resend')).toHaveProp(
      'accessibilityState',
      { busy: false, disabled: true },
    );

    fireEvent.press(screen.getByTestId('verify-email-resend'));

    expect(resendOtp.mutate).not.toHaveBeenCalled();
  });

  it('disables verification while a resend is pending', () => {
    const verifyEmail = createMutation();
    const resendOtp = createMutation({ pending: true });
    mockAuth({ resendOtp, verifyEmail });
    renderVerifyEmail();

    expect(screen.getByTestId('verify-email-submit')).toHaveProp(
      'accessibilityState',
      { busy: false, disabled: true },
    );
    expect(screen.getByTestId('verify-email-resend')).toHaveProp(
      'accessibilityState',
      { busy: true, disabled: true },
    );

    fireEvent.press(screen.getByTestId('verify-email-submit'));

    expect(verifyEmail.mutate).not.toHaveBeenCalled();
  });
});
