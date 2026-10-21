import { fireEvent, render, screen } from '@testing-library/react-native';

import { semanticColorsLight } from '@/theme/tokens';

import TestAppWrapper from '@/tests/TestAppWrapper';

import SearchInput from './SearchInput';

const DEFAULT_PLACEHOLDER = 'Cari activity atau jadwal';
const PLACEHOLDER = 'Cari jadwal minggu ini';
const FIELD_HEIGHT = 44;
const FIELD_RADIUS = 10;

describe('SearchInput', () => {
  it('renders the search icon and the default placeholder', () => {
    render(<SearchInput />, { wrapper: TestAppWrapper });

    expect(screen.getByText('search')).toBeTruthy();
    expect(screen.getByPlaceholderText(DEFAULT_PLACEHOLDER)).toBeTruthy();
  });

  it('renders the given placeholder', () => {
    render(<SearchInput placeholder={PLACEHOLDER} />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeTruthy();
  });

  it('applies the default state', () => {
    render(<SearchInput testID="search-input" />, { wrapper: TestAppWrapper });

    expect(screen.getByTestId('search-input-field')).toHaveStyle({
      backgroundColor: semanticColorsLight.surfaceCard,
      borderColor: semanticColorsLight.borderControl,
      borderRadius: FIELD_RADIUS,
      borderWidth: 1,
      height: FIELD_HEIGHT,
    });
    expect(screen.getByText('search')).toHaveStyle({
      color: semanticColorsLight.iconSecondary,
    });
    expect(screen.getByPlaceholderText(DEFAULT_PLACEHOLDER)).toHaveProp(
      'placeholderTextColor',
      semanticColorsLight.textSecondary,
    );
  });

  it('applies the disabled state', () => {
    render(<SearchInput disabled testID="search-input" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('search-input-field')).toHaveStyle({
      backgroundColor: semanticColorsLight.surfaceNeutral,
      borderColor: semanticColorsLight.borderControl,
      borderWidth: 1,
    });
    expect(screen.getByText('search')).toHaveStyle({
      color: semanticColorsLight.iconDisabled,
    });
    expect(screen.getByPlaceholderText(DEFAULT_PLACEHOLDER)).toHaveProp(
      'placeholderTextColor',
      semanticColorsLight.textDisabled,
    );
    expect(screen.getByTestId('search-input')).toHaveProp('editable', false);
    expect(screen.getByTestId('search-input')).toHaveProp(
      'accessibilityState',
      {
        disabled: true,
      },
    );
  });

  it('renders the given value', () => {
    render(<SearchInput testID="search-input" value="Rapat tim" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByDisplayValue('Rapat tim')).toBeTruthy();
  });

  it('calls onChangeText when the value changes', () => {
    const onChangeText = jest.fn();
    render(<SearchInput onChangeText={onChangeText} testID="search-input" />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.changeText(screen.getByTestId('search-input'), 'Rapat tim');

    expect(onChangeText).toHaveBeenCalledTimes(1);
  });

  it('calls the focus and blur handlers', () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();
    render(
      <SearchInput onBlur={onBlur} onFocus={onFocus} testID="search-input" />,
      { wrapper: TestAppWrapper },
    );

    fireEvent(screen.getByTestId('search-input'), 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent(screen.getByTestId('search-input'), 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
