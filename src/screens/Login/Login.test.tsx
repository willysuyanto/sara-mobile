import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Login from './Login';

const renderLogin = (navigation: { navigate: jest.Mock; reset: jest.Mock }) =>
  render(
    <TestAppWrapper>
      <Login
        {...({
          navigation,
          route: {},
        } as unknown as RootScreenProps<Paths.Login>)}
      />
    </TestAppWrapper>,
  );

const createNavigation = () => ({
  navigate: jest.fn(),
  reset: jest.fn(),
});

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('Login screen', () => {
  it('renders the title, subtitle and fields', () => {
    renderLogin(createNavigation());

    expect(screen.getByText('Selamat datang kembali!')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Kata sandi')).toBeTruthy();
    expect(screen.getByText('Ingat saya')).toBeTruthy();
    expect(screen.getByText('Lupa kata sandi?')).toBeTruthy();
    expect(screen.getByText('Masuk')).toBeTruthy();
  });

  it('disables the submit button while the form is invalid', () => {
    renderLogin(createNavigation());

    expect(screen.getByTestId('login-submit')).toHaveProp(
      'accessibilityState',
      { busy: false, disabled: true },
    );
  });

  it('shows a validation error for an invalid email', async () => {
    renderLogin(createNavigation());

    fireEvent.changeText(screen.getByTestId('login-email'), 'bukan-email');
    await flush();

    expect(screen.getByText('Masukkan alamat email yang valid.')).toBeTruthy();
  });

  it('shows a validation error for a short password', async () => {
    renderLogin(createNavigation());

    fireEvent.changeText(screen.getByTestId('login-password'), 'short');
    await flush();

    expect(screen.getByText('Kata sandi minimal 8 karakter.')).toBeTruthy();
  });

  it('submits valid credentials and navigates to the dashboard', async () => {
    const navigation = createNavigation();
    renderLogin(navigation);

    fireEvent.changeText(screen.getByTestId('login-email'), 'sara@sara.app');
    fireEvent.changeText(screen.getByTestId('login-password'), 'password123');
    await flush();

    fireEvent.press(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: Paths.Dashboard }],
      });
    });
  });

  it('navigates to register from the footer link', () => {
    const navigation = createNavigation();
    renderLogin(navigation);

    fireEvent.press(screen.getByTestId('login-register-link'));

    expect(navigation.navigate).toHaveBeenCalledWith(Paths.Register);
  });

  it('navigates to forgot password from the link', () => {
    const navigation = createNavigation();
    renderLogin(navigation);

    fireEvent.press(screen.getByTestId('login-forgot-password'));

    expect(navigation.navigate).toHaveBeenCalledWith(Paths.ForgotPassword);
  });

  it('toggles the remember me checkbox', async () => {
    renderLogin(createNavigation());

    fireEvent.press(screen.getByTestId('login-remember'));
    await flush();

    expect(screen.getByTestId('login-remember')).toHaveProp(
      'accessibilityState',
      { checked: true, disabled: false },
    );
  });
});
