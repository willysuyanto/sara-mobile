import { fireEvent, render, screen } from '@testing-library/react-native';

import { semanticColorsLight } from '@/theme/tokens';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Checkbox from './Checkbox';

const LABEL = 'Ingatkan saya';

describe('Checkbox', () => {
  it('renders its label', () => {
    render(<Checkbox label={LABEL} />, { wrapper: TestAppWrapper });

    expect(screen.getByText(LABEL)).toBeTruthy();
  });

  it('applies the unchecked state', () => {
    render(<Checkbox label={LABEL} testID="checkbox" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('checkbox')).toHaveProp('accessibilityState', {
      checked: false,
      disabled: false,
    });
    expect(screen.getByTestId('checkbox-indicator')).toHaveStyle({
      backgroundColor: semanticColorsLight.surfacePrimary,
      borderColor: semanticColorsLight.borderControl,
    });
    expect(screen.queryByText('check')).toBeNull();
  });

  it('applies the checked state and shows the check icon', () => {
    render(<Checkbox checked label={LABEL} testID="checkbox" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('checkbox')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
    expect(screen.getByTestId('checkbox-indicator')).toHaveStyle({
      backgroundColor: semanticColorsLight.buttonPrimaryBackground,
      borderColor: semanticColorsLight.buttonPrimaryBackground,
    });
    expect(screen.getByText('check')).toHaveStyle({
      color: semanticColorsLight.textOnPrimary,
    });
  });

  it('calls onChange with the next value when pressed', () => {
    const onChange = jest.fn();
    render(<Checkbox label={LABEL} onChange={onChange} testID="checkbox" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('checkbox'));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles its internal state when uncontrolled', () => {
    render(<Checkbox label={LABEL} testID="checkbox" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('checkbox'));

    expect(screen.getByTestId('checkbox')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
  });

  it('stays checked when controlled', () => {
    const onChange = jest.fn();
    render(
      <Checkbox checked label={LABEL} onChange={onChange} testID="checkbox" />,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('checkbox'));

    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId('checkbox')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
  });

  it('does not call onChange and dims the label when disabled', () => {
    const onChange = jest.fn();
    render(
      <Checkbox disabled label={LABEL} onChange={onChange} testID="checkbox" />,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('checkbox'));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('checkbox')).toHaveProp('accessibilityState', {
      checked: false,
      disabled: true,
    });
    expect(screen.getByText(LABEL)).toHaveStyle({
      color: semanticColorsLight.textDisabled,
    });
  });

  it('applies the design tokens to the indicator', () => {
    render(<Checkbox label={LABEL} />, { wrapper: TestAppWrapper });

    expect(screen.getByTestId('checkbox-indicator')).toHaveStyle({
      borderRadius: 6,
      borderWidth: 1.5,
      height: 20,
      width: 20,
    });
  });
});
