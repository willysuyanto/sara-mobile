import { render, screen, within } from '@testing-library/react-native';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Activity from './Activity';

describe('Activity screen', () => {
  it('renders the sample agenda and marks both create actions as unavailable', () => {
    render(<Activity />, { wrapper: TestAppWrapper });

    expect(screen.getByRole('header', { name: 'Aktivitas' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Hari ini' })).toBeOnTheScreen();
    expect(
      screen.getByRole('header', { name: 'Akan datang' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('7 Okt')).toBeOnTheScreen();
    expect(screen.getByText('Meeting kelompok')).toBeOnTheScreen();
    expect(screen.getByText('Kerjakan tugas jaringan')).toBeOnTheScreen();
    expect(screen.getByText('Belajar algoritma')).toBeOnTheScreen();
    expect(screen.getByText('Submit laporan')).toBeOnTheScreen();
    expect(screen.getByText('15.00 · 9 Okt')).toBeOnTheScreen();
    expect(screen.getAllByText('Terjadwal')).toHaveLength(4);

    const createButtons = screen.getAllByRole('button', {
      disabled: true,
      name: 'Buat Aktivitas',
    });
    expect(createButtons).toHaveLength(2);
    expect(
      within(createButtons[1]).getByText('Buat Aktivitas'),
    ).toBeOnTheScreen();
  });
});
