import { fireEvent, render, screen } from '@testing-library/react-native';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

import TestAppWrapper from '@/tests/TestAppWrapper';

import ForgotPassword from './ForgotPassword';

const renderScreen = (navigation: { navigate: jest.Mock }) =>
  render(
    <TestAppWrapper>
      <ForgotPassword
        {...({
          navigation,
          route: {},
        } as unknown as RootScreenProps<Paths.ForgotPassword>)}
      />
    </TestAppWrapper>,
  );

describe('ForgotPassword screen', () => {
  it('renders the title, subtitle and email field', () => {
    renderScreen({ navigate: jest.fn() });

    expect(screen.getByText('Reset kata sandimu')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Kirim tautan reset')).toBeTruthy();
  });

  it('disables the submit button while the email is invalid', () => {
    renderScreen({ navigate: jest.fn() });

    expect(screen.getByTestId('forgot-password-submit')).toHaveProp(
      'accessibilityState',
      { busy: false, disabled: true },
    );
  });

  it('navigates back to login', () => {
    const navigate = jest.fn();
    renderScreen({ navigate });

    fireEvent.press(screen.getByTestId('forgot-password-login-link'));

    expect(navigate).toHaveBeenCalledWith(Paths.Login);
  });
});
