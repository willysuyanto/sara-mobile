import { fireEvent, render, screen } from '@testing-library/react-native';

import { semanticColorsLight } from '@/theme/tokens';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Radio from './Radio';
import RadioGroup from './RadioGroup';

const LABEL = 'Hari ini';

describe('Radio', () => {
  it('renders its label', () => {
    render(<Radio label={LABEL} />, { wrapper: TestAppWrapper });

    expect(screen.getByText(LABEL)).toBeTruthy();
  });

  it('applies the unselected state', () => {
    render(<Radio label={LABEL} testID="radio" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('radio')).toHaveProp('accessibilityState', {
      checked: false,
      disabled: false,
    });
    expect(screen.getByTestId('radio-indicator')).toHaveStyle({
      borderColor: semanticColorsLight.borderControl,
    });
    expect(screen.queryByTestId('radio-dot')).toBeNull();
  });

  it('applies the selected state and shows the dot', () => {
    render(<Radio label={LABEL} selected testID="radio" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('radio')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
    expect(screen.getByTestId('radio-indicator')).toHaveStyle({
      borderColor: semanticColorsLight.buttonPrimaryBackground,
    });
    expect(screen.getByTestId('radio-dot')).toHaveStyle({
      backgroundColor: semanticColorsLight.buttonPrimaryBackground,
    });
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Radio label={LABEL} onPress={onPress} testID="radio" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('radio'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Radio disabled label={LABEL} onPress={onPress} testID="radio" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(screen.getByTestId('radio'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByTestId('radio')).toHaveProp('accessibilityState', {
      checked: false,
      disabled: true,
    });
  });

  it('applies the design tokens to the indicator', () => {
    render(<Radio label={LABEL} />, { wrapper: TestAppWrapper });

    expect(screen.getByTestId('radio-indicator')).toHaveStyle({
      borderRadius: 100,
      borderWidth: 1.5,
      height: 20,
      width: 20,
    });
  });
});

describe('RadioGroup', () => {
  it('selects the radio matching the group value', () => {
    render(
      <RadioGroup value="b">
        <Radio label="A" testID="radio-a" value="a" />
        <Radio label="B" testID="radio-b" value="b" />
      </RadioGroup>,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByTestId('radio-a')).toHaveProp('accessibilityState', {
      checked: false,
      disabled: false,
    });
    expect(screen.getByTestId('radio-b')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
  });

  it('calls onChange with the pressed radio value', () => {
    const onChange = jest.fn();
    render(
      <RadioGroup onChange={onChange} value="a">
        <Radio label="A" testID="radio-a" value="a" />
        <Radio label="B" testID="radio-b" value="b" />
      </RadioGroup>,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('radio-b'));

    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('disables every radio in the group', () => {
    const onPress = jest.fn();
    render(
      <RadioGroup disabled value="a">
        <Radio label="A" onPress={onPress} testID="radio-a" value="a" />
      </RadioGroup>,
      { wrapper: TestAppWrapper },
    );

    fireEvent.press(screen.getByTestId('radio-a'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByTestId('radio-a')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: true,
    });
  });
});
