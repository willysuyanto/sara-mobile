import { fireEvent, render, screen } from '@testing-library/react-native';

import { semanticColorsLight } from '@/theme/tokens';

import TestAppWrapper from '@/tests/TestAppWrapper';

import IconButton from './IconButton';

describe('IconButton', () => {
  it('renders its icon', () => {
    render(<IconButton accessibilityLabel="Tambah" icon="plus" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByText('plus')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(
      <IconButton
        accessibilityLabel="Tambah"
        icon="plus"
        onPress={onPress}
        testID="icon-button"
      />,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('icon-button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <IconButton
        accessibilityLabel="Tambah"
        disabled
        icon="plus"
        onPress={onPress}
        testID="icon-button"
      />,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('icon-button'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByTestId('icon-button')).toHaveProp('accessibilityState', {
      busy: false,
      disabled: true,
    });
  });

  it('does not call onPress and shows a spinner when loading', () => {
    const onPress = jest.fn();
    render(
      <IconButton
        accessibilityLabel="Tambah"
        icon="plus"
        loading
        onPress={onPress}
        testID="icon-button"
      />,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('icon-button'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.queryByText('plus')).toBeNull();
    expect(screen.getByTestId('icon-button')).toHaveProp('accessibilityState', {
      busy: true,
      disabled: true,
    });
  });

  it('applies the primary variant by default', () => {
    render(
      <IconButton
        accessibilityLabel="Tambah"
        icon="plus"
        testID="icon-button"
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('icon-button')).toHaveStyle({
      backgroundColor: semanticColorsLight.buttonPrimaryBackground,
    });
    expect(screen.getByText('plus')).toHaveStyle({
      color: semanticColorsLight.iconOnPrimary,
    });
  });

  it('applies the secondary variant', () => {
    render(
      <IconButton
        accessibilityLabel="Tambah"
        icon="plus"
        testID="icon-button"
        variant="secondary"
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('icon-button')).toHaveStyle({
      backgroundColor: semanticColorsLight.secondaryBackground,
    });
    expect(screen.getByText('plus')).toHaveStyle({
      color: semanticColorsLight.textAccent,
    });
  });

  it('applies the tertiary variant with a transparent background', () => {
    render(
      <IconButton
        accessibilityLabel="Tambah"
        icon="plus"
        testID="icon-button"
        variant="tertiary"
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('icon-button')).toHaveStyle({
      backgroundColor: 'transparent',
    });
    expect(screen.getByText('plus')).toHaveStyle({
      color: semanticColorsLight.textAccent,
    });
  });

  it('uses the design tokens for the 44px square', () => {
    render(
      <IconButton
        accessibilityLabel="Tambah"
        icon="plus"
        testID="icon-button"
      />,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('icon-button')).toHaveStyle({
      borderRadius: 10,
      height: 44,
      width: 44,
    });
    expect(screen.getByText('plus')).toHaveStyle({ fontSize: 20 });
  });
});
