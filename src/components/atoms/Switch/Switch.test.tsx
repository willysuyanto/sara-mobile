import { fireEvent, render, screen } from '@testing-library/react-native';

import { semanticColorsLight } from '@/theme/tokens';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Switch from './Switch';

describe('Switch', () => {
  it('renders its label', () => {
    render(<Switch label="Notifikasi" />, { wrapper: TestAppWrapper });

    expect(screen.getByText('Notifikasi')).toBeTruthy();
  });

  it('is off by default', () => {
    render(<Switch label="Notifikasi" testID="switch" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('switch')).toHaveProp('accessibilityState', {
      checked: false,
      disabled: false,
    });
    expect(screen.getByTestId('switch-track')).toHaveStyle({
      backgroundColor: semanticColorsLight.borderControl,
    });
  });

  it('applies the on state', () => {
    render(<Switch checked label="Notifikasi" testID="switch" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('switch')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
    expect(screen.getByTestId('switch-track')).toHaveStyle({
      backgroundColor: semanticColorsLight.buttonPrimaryBackground,
    });
  });

  it('calls onChange with the next value when pressed', () => {
    const onChange = jest.fn();
    render(<Switch label="Notifikasi" onChange={onChange} testID="switch" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('switch'));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles its internal state when uncontrolled', () => {
    render(<Switch label="Notifikasi" testID="switch" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('switch'));

    expect(screen.getByTestId('switch')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
  });

  it('stays checked when controlled', () => {
    const onChange = jest.fn();
    render(
      <Switch checked label="Notifikasi" onChange={onChange} testID="switch" />,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('switch'));

    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId('switch')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();
    render(
      <Switch
        disabled
        label="Notifikasi"
        onChange={onChange}
        testID="switch"
      />,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('switch'));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('switch')).toHaveProp('accessibilityState', {
      checked: false,
      disabled: true,
    });
  });

  it('applies the design tokens to the track and thumb', () => {
    render(<Switch label="Notifikasi" testID="switch" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('switch-track')).toHaveStyle({
      borderRadius: 100,
      height: 26,
      width: 44,
    });
    expect(screen.getByTestId('switch-thumb')).toHaveStyle({
      backgroundColor: semanticColorsLight.surfacePrimary,
      height: 20,
      width: 20,
    });
  });
});
