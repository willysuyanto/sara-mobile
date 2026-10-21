import { render, screen, waitFor } from '@testing-library/react-native';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Splashscreen, { SPLASH_DURATION_MS } from './Splashscreen';

const NAVIGATE_GRACE_MS = 100;

describe('Splashscreen screen should render correctly', () => {
  test('renders the brand wordmark and tagline, then navigates forward after the min display time', async () => {
    const navigation = { reset: jest.fn() };

    render(
      <TestAppWrapper>
        <Splashscreen
          {...({
            navigation,
            route: {},
          } as unknown as RootScreenProps<Paths.Splashscreen>)}
        />
      </TestAppWrapper>,
    );

    expect(screen.getByText('SARA.')).toBeDefined();
    expect(
      screen.getByText('Smart Assistant for Responsive Automation'),
    ).toBeDefined();

    await waitFor(
      () => {
        expect(navigation.reset).toHaveBeenCalled();
      },
      { timeout: SPLASH_DURATION_MS + NAVIGATE_GRACE_MS },
    );
  });
});
