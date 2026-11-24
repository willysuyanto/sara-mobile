import { fireEvent, render, screen } from '@testing-library/react-native';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Splashscreen from './Splashscreen';

describe('Splashscreen screen should render correctly', () => {
  test('renders the brand while checking the session', () => {
    render(<Splashscreen failed={false} onRetry={jest.fn()} />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByText('SARA.')).toBeDefined();
    expect(
      screen.getByText('Smart Assistant for Responsive Automation'),
    ).toBeDefined();

    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('offers retry when the session check fails', () => {
    const retry = jest.fn();
    render(<Splashscreen failed onRetry={retry} />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByRole('alert')).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button'));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
