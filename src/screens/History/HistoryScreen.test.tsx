import { render, screen } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/translations';

import TestAppWrapper from '@/tests/TestAppWrapper';

import HistoryScreen from './HistoryScreen';

describe('History screen', () => {
  it('shows three read-only updates and connects consecutive entries', () => {
    render(<HistoryScreen />, { wrapper: TestAppWrapper });

    expect(screen.getByRole('header', { name: 'Riwayat' })).toBeOnTheScreen();
    expect(
      screen.getByRole('header', { name: 'Terakhir diperbarui' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Aktivitas selesai')).toBeOnTheScreen();
    expect(screen.getByText('Pengingat dikonfigurasi')).toBeOnTheScreen();
    expect(screen.getByText('Aktivitas dibuat')).toBeOnTheScreen();
    expect(screen.getAllByTestId('timeline-connector')).toHaveLength(2);
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('localizes entry copy and timestamps in English', () => {
    render(
      <I18nextProvider i18n={i18n.cloneInstance({ lng: 'en-EN' })}>
        <HistoryScreen />
      </I18nextProvider>,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByRole('header', { name: 'History' })).toBeOnTheScreen();
    expect(screen.getByText('Activity completed')).toBeOnTheScreen();
    expect(screen.getByText('Review APPL materials')).toBeOnTheScreen();
    expect(screen.getByText('Today, 9:45 a.m.')).toBeOnTheScreen();
    expect(
      screen.getByText('History only shows your activities.'),
    ).toBeOnTheScreen();
  });
});
