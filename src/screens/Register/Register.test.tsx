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

import Register from './Register';

const renderRegister = (navigation: {
  navigate: jest.Mock;
  reset: jest.Mock;
}) =>
  render(
    <TestAppWrapper>
      <Register
        {...({
          navigation,
          route: {},
        } as unknown as RootScreenProps<Paths.Register>)}
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

const fillValidForm = async () => {
  fireEvent.changeText(screen.getByTestId('register-full-name'), 'Sara');
  fireEvent.changeText(screen.getByTestId('register-email'), 'sara@sara.app');
  fireEvent.changeText(screen.getByTestId('register-password'), 'password123');
  fireEvent.changeText(
    screen.getByTestId('register-confirm-password'),
    'password123',
  );
  await flush();
};

describe('Register screen', () => {
  it('renders the title, subtitle and fields', () => {
    renderRegister(createNavigation());

    expect(screen.getByText('Mulai perjalanan produktifmu')).toBeTruthy();
    expect(screen.getByText('Nama lengkap')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Kata sandi')).toBeTruthy();
    expect(screen.getByText('Konfirmasi kata sandi')).toBeTruthy();
    expect(screen.getByText('Buat akun')).toBeTruthy();
  });

  it('disables the submit button while the form is invalid', () => {
    renderRegister(createNavigation());

    expect(screen.getByTestId('register-submit')).toHaveProp(
      'accessibilityState',
      { busy: false, disabled: true },
    );
  });

  it('shows a validation error when the passwords do not match', async () => {
    renderRegister(createNavigation());

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

  it('shows a validation error when the full name is empty', async () => {
    renderRegister(createNavigation());

    fireEvent.changeText(screen.getByTestId('register-full-name'), '');
    await flush();

    fireEvent.changeText(screen.getByTestId('register-email'), 'sara@sara.app');
    await flush();

    expect(screen.getByText('Nama kamu wajib diisi.')).toBeTruthy();
  });

  it('submits a valid form and navigates to the dashboard', async () => {
    const navigation = createNavigation();
    renderRegister(navigation);

    await fillValidForm();

    fireEvent.press(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: Paths.Dashboard }],
      });
    });
  });

  it('navigates to login from the footer link', () => {
    const navigation = createNavigation();
    renderRegister(navigation);

    fireEvent.press(screen.getByTestId('register-login-link'));

    expect(navigation.navigate).toHaveBeenCalledWith(Paths.Login);
  });
});
