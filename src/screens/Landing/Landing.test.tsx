import { fireEvent, render, screen } from '@testing-library/react-native';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Landing from './Landing';

const renderLanding = (navigation: { navigate: jest.Mock }) =>
  render(
    <TestAppWrapper>
      <Landing
        {...({
          navigation,
          route: {},
        } as unknown as RootScreenProps<Paths.Landing>)}
      />
    </TestAppWrapper>,
  );

describe('Landing screen', () => {
  it('renders the heading, body and call to action', () => {
    renderLanding({ navigate: jest.fn() });

    expect(
      screen.getByText(
        'Siap untuk bekerja dengan cara yang sedikit lebih cerdas?',
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Temukan cara favorit baru untuk menyelesaikan berbagai hal.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Mulai sekarang')).toBeTruthy();
  });

  it('renders the brand wordmark and tagline', () => {
    renderLanding({ navigate: jest.fn() });

    expect(screen.getByText('SARA.')).toBeTruthy();
    expect(
      screen.getByText('Smart Assistant for Responsive Automation'),
    ).toBeTruthy();
  });

  it('navigates to the login screen when the call to action is pressed', () => {
    const navigate = jest.fn();
    renderLanding({ navigate });

    fireEvent.press(screen.getByTestId('landing-cta'));

    expect(navigate).toHaveBeenCalledWith(Paths.Login);
  });
});
