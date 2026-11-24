import { render, screen } from '@testing-library/react-native';

import TestAppWrapper from '@/tests/TestAppWrapper';

import Dashboard from './Dashboard';

describe('Dashboard screen', () => {
  it('renders the greeting, the agenda and the SARA prompt', () => {
    render(<Dashboard />, { wrapper: TestAppWrapper });

    expect(screen.getByText('Selamat pagi, Adi')).toBeTruthy();
    expect(screen.getByText('Harimu, selangkah\nlebih teratur.')).toBeTruthy();
    expect(screen.getByText('2 Aktivitas menanti hari ini')).toBeTruthy();
    expect(screen.getByText('Buat Aktivitas')).toBeTruthy();
    expect(screen.getByText('Punya rencana? Ceritakan ke SARA.')).toBeTruthy();
  });

  it('renders today activities with their status', () => {
    render(<Dashboard />, { wrapper: TestAppWrapper });

    expect(screen.getByText('Aktivitas hari ini')).toBeTruthy();
    expect(screen.getByText('Lihat semua')).toBeTruthy();
    expect(screen.getByText('Review materi APPL')).toBeTruthy();
    expect(screen.getByText('Meeting kelompok')).toBeTruthy();
    expect(screen.getByText('Kerjakan tugas jaringan')).toBeTruthy();
    expect(screen.getByText('Selesai')).toBeTruthy();
    expect(screen.getAllByText('Terjadwal')).toHaveLength(2);
  });

  it('renders the upcoming entry and the privacy note', () => {
    render(<Dashboard />, { wrapper: TestAppWrapper });

    expect(screen.getByText('Akan datang')).toBeTruthy();
    expect(screen.getByText('Buka agenda')).toBeTruthy();
    expect(screen.getByText('Belajar algoritma')).toBeTruthy();
    expect(screen.getByText('Kamis · 10.00 WIB')).toBeTruthy();
    expect(
      screen.getByText('Hanya kamu yang melihat Aktivitas ini.'),
    ).toBeTruthy();
  });
});
