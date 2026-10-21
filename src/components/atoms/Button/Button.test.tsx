import { fireEvent, render, screen } from '@testing-library/react-native';
import { View } from 'react-native';

import { semanticColorsLight } from '@/theme/tokens';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Button from './Button';

const LABEL = 'Lanjutkan';

const SMALL_HEIGHT = 36;
const SMALL_FONT_SIZE = 12;
const MEDIUM_HEIGHT = 44;
const MEDIUM_FONT_SIZE = 14;
const LARGE_HEIGHT = 52;
const LARGE_FONT_SIZE = 14;

describe('Button', () => {
  it('renders its label', () => {
    render(<Button label={LABEL} />, { wrapper: TestAppWrapper });

    expect(screen.getByText(LABEL)).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button label={LABEL} onPress={onPress} testID="button" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <Button disabled label={LABEL} onPress={onPress} testID="button" />,
      {
        wrapper: TestAppWrapper,
      },
    );

    fireEvent.press(screen.getByTestId('button'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByTestId('button')).toHaveProp('accessibilityState', {
      busy: false,
      disabled: true,
    });
  });

  it('does not call onPress and shows a spinner when loading', () => {
    const onPress = jest.fn();
    render(<Button label={LABEL} loading onPress={onPress} testID="button" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('button'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.queryByText(LABEL)).toBeNull();
    expect(screen.getByTestId('button')).toHaveProp('accessibilityState', {
      busy: true,
      disabled: true,
    });
  });

  it('renders leading and trailing icons', () => {
    render(
      <Button
        label={LABEL}
        leadingIcon={<View testID="leading-icon" />}
        trailingIcon={<View testID="trailing-icon" />}
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('leading-icon')).toBeTruthy();
    expect(screen.getByTestId('trailing-icon')).toBeTruthy();
  });

  it('applies the primary variant by default', () => {
    render(<Button label={LABEL} testID="button" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('button')).toHaveStyle({
      backgroundColor: semanticColorsLight.buttonPrimaryBackground,
      borderColor: semanticColorsLight.buttonPrimaryBackground,
    });
  });

  it('applies the secondary variant', () => {
    render(<Button label={LABEL} testID="button" variant="secondary" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('button')).toHaveStyle({
      backgroundColor: semanticColorsLight.secondaryBackground,
      borderColor: semanticColorsLight.borderPrimary,
    });
  });

  it('applies the tertiary variant with a transparent background', () => {
    render(<Button label={LABEL} testID="button" variant="tertiary" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('button')).toHaveStyle({
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    });
    expect(screen.getByText(LABEL)).toHaveStyle({
      color: semanticColorsLight.textAccent,
    });
  });

  it.each([
    ['sm', SMALL_HEIGHT, SMALL_FONT_SIZE],
    ['md', MEDIUM_HEIGHT, MEDIUM_FONT_SIZE],
    ['lg', LARGE_HEIGHT, LARGE_FONT_SIZE],
  ] as const)('applies the %s size', (size, height, fontSize) => {
    render(<Button label={LABEL} size={size} testID="button" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('button')).toHaveStyle({ height });
    expect(screen.getByText(LABEL)).toHaveStyle({ fontSize });
  });

  it('stretches to full width when requested', () => {
    render(<Button fullWidth label={LABEL} testID="button" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('button')).toHaveStyle({ width: '100%' });
  });
});
