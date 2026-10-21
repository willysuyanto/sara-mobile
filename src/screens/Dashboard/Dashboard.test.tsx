import { render, screen } from '@testing-library/react-native';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Dashboard from './Dashboard';

describe('Dashboard screen', () => {
  it('renders the placeholder content', () => {
    render(<Dashboard />, { wrapper: TestAppWrapper });

    expect(screen.getByText('DASBOR')).toBeTruthy();
    expect(screen.getByText('Semuanya siap')).toBeTruthy();
    expect(
      screen.getByText(
        'Dasbor kamu sedang disiapkan. Semua yang kamu butuhkan akan ada di sini.',
      ),
    ).toBeTruthy();
  });
});
