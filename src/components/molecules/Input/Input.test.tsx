import { fireEvent, render, screen } from '@testing-library/react-native';

import { semanticColorsLight } from '@/theme/tokens';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Input from './Input';

const LABEL = 'Nama activity';
const PLACEHOLDER = 'Tulis nama activity';
const HELPER_MESSAGE = 'Beri nama singkat agar mudah ditemukan.';
const ERROR_MESSAGE = 'Nama activity wajib diisi.';

const MEDIUM_HEIGHT = 44;
const LARGE_HEIGHT = 56;

describe('Input', () => {
  it('renders its label, placeholder and helper message', () => {
    render(
      <Input
        helperMessage={HELPER_MESSAGE}
        label={LABEL}
        placeholder={PLACEHOLDER}
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByText(LABEL)).toBeTruthy();
    expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeTruthy();
    expect(screen.getByText(HELPER_MESSAGE)).toBeTruthy();
  });

  it('renders no message when neither helper nor error message is given', () => {
    render(<Input label={LABEL} />, { wrapper: TestAppWrapper });

    expect(screen.queryByText(HELPER_MESSAGE)).toBeNull();
    expect(screen.queryByText(ERROR_MESSAGE)).toBeNull();
  });

  it('applies the default state', () => {
    render(
      <Input
        helperMessage={HELPER_MESSAGE}
        label={LABEL}
        placeholder={PLACEHOLDER}
        testID="input"
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('input-field')).toHaveStyle({
      backgroundColor: semanticColorsLight.surfacePrimary,
      borderColor: semanticColorsLight.borderControl,
      borderWidth: 1,
    });
    expect(screen.getByText(HELPER_MESSAGE)).toHaveStyle({
      color: semanticColorsLight.textSecondary,
    });
    expect(screen.getByPlaceholderText(PLACEHOLDER)).toHaveProp(
      'placeholderTextColor',
      semanticColorsLight.textSecondary,
    );
  });

  it('applies the focused state while the input is focused', () => {
    render(
      <Input helperMessage={HELPER_MESSAGE} label={LABEL} testID="input" />,
      { wrapper: TestAppWrapper },
    );

    fireEvent(screen.getByTestId('input'), 'focus');

    expect(screen.getByTestId('input-field')).toHaveStyle({
      borderColor: semanticColorsLight.primary,
      borderWidth: 2,
    });

    fireEvent(screen.getByTestId('input'), 'blur');

    expect(screen.getByTestId('input-field')).toHaveStyle({
      borderColor: semanticColorsLight.borderControl,
      borderWidth: 1,
    });
  });

  it('applies the error state', () => {
    render(
      <Input
        error
        errorMessage={ERROR_MESSAGE}
        helperMessage={HELPER_MESSAGE}
        label={LABEL}
        testID="input"
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('input-field')).toHaveStyle({
      backgroundColor: semanticColorsLight.surfacePrimary,
      borderColor: semanticColorsLight.errorForeground,
      borderWidth: 1,
    });
    expect(screen.getByText(ERROR_MESSAGE)).toHaveStyle({
      color: semanticColorsLight.errorForeground,
    });
    expect(screen.queryByText(HELPER_MESSAGE)).toBeNull();
    expect(screen.getByText('circle-alert')).toBeTruthy();
  });

  it('applies the disabled state', () => {
    render(
      <Input
        disabled
        helperMessage={HELPER_MESSAGE}
        label={LABEL}
        testID="input"
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('input-field')).toHaveStyle({
      backgroundColor: semanticColorsLight.surfaceNeutral,
      borderColor: semanticColorsLight.borderControl,
      borderWidth: 1,
    });
    expect(screen.getByText(LABEL)).toHaveStyle({
      color: semanticColorsLight.textDisabled,
    });
    expect(screen.getByText(HELPER_MESSAGE)).toHaveStyle({
      color: semanticColorsLight.textDisabled,
    });
    expect(screen.getByText('lock-keyhole')).toBeTruthy();
    expect(screen.getByTestId('input')).toHaveProp('accessibilityState', {
      disabled: true,
    });
  });

  it.each([
    ['md', MEDIUM_HEIGHT],
    ['lg', LARGE_HEIGHT],
  ] as const)('applies the %s size', (size, height) => {
    render(<Input label={LABEL} size={size} testID="input" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('input-field')).toHaveStyle({ height });
  });

  it('calls onChangeText when the value changes', () => {
    const onChangeText = jest.fn();
    render(<Input label={LABEL} onChangeText={onChangeText} testID="input" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.changeText(screen.getByTestId('input'), 'Meeting kelompok');

    expect(onChangeText).toHaveBeenCalledTimes(1);
  });

  it('calls the focus and blur handlers', () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();
    render(
      <Input label={LABEL} onBlur={onBlur} onFocus={onFocus} testID="input" />,
      { wrapper: TestAppWrapper },
    );

    fireEvent(screen.getByTestId('input'), 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent(screen.getByTestId('input'), 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('does not become editable when disabled', () => {
    render(<Input disabled label={LABEL} testID="input" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('input')).toHaveProp('editable', false);
  });

  it('obscures the text when password is set', () => {
    render(<Input label={LABEL} password testID="input" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('input')).toHaveProp('secureTextEntry', true);
    expect(screen.getByText('eye')).toBeTruthy();
  });

  it('reveals and hides the text when the toggle is pressed', () => {
    render(<Input label={LABEL} password testID="input" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('input-visibility-toggle'));

    expect(screen.getByTestId('input')).toHaveProp('secureTextEntry', false);
    expect(screen.getByText('eye-off')).toBeTruthy();

    fireEvent.press(screen.getByTestId('input-visibility-toggle'));

    expect(screen.getByTestId('input')).toHaveProp('secureTextEntry', true);
    expect(screen.getByText('eye')).toBeTruthy();
  });

  it('applies password defaults', () => {
    render(<Input label={LABEL} password testID="input" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('input')).toHaveProp('autoCapitalize', 'none');
    expect(screen.getByTestId('input')).toHaveProp('autoCorrect', false);
    expect(screen.getByTestId('input')).toHaveProp(
      'textContentType',
      'password',
    );
  });

  it('does not render the visibility toggle when not a password', () => {
    render(<Input label={LABEL} testID="input" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.queryByTestId('input-visibility-toggle')).toBeNull();
    expect(screen.getByTestId('input').props.secureTextEntry).toBeUndefined();
  });

  it('does not toggle visibility when disabled', () => {
    render(<Input disabled label={LABEL} password testID="input" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('input-visibility-toggle'));

    expect(screen.getByTestId('input')).toHaveProp('secureTextEntry', true);
  });
});
