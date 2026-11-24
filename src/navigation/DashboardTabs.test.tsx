import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TestAppWrapper from '@/tests/TestAppWrapper';

import DashboardTabs from './DashboardTabs';

const renderTabs = () =>
  render(
    <SafeAreaProvider>
      <NavigationContainer>
        <DashboardTabs />
      </NavigationContainer>
    </SafeAreaProvider>,
    { wrapper: TestAppWrapper },
  );

describe('DashboardTabs', () => {
  it('renders the five bottom destinations', () => {
    renderTabs();

    expect(screen.getByText('Beranda')).toBeTruthy();
    expect(screen.getByText('Aktivitas')).toBeTruthy();
    expect(screen.getByText('SARA')).toBeTruthy();
    expect(screen.getByText('Riwayat')).toBeTruthy();
    expect(screen.getByText('Pengaturan')).toBeTruthy();
  });

  it('opens a placeholder screen for the destinations without a design', () => {
    renderTabs();

    fireEvent.press(screen.getByText('Riwayat'));

    expect(screen.getByText('Segera hadir')).toBeTruthy();
  });

  it('opens the Activity screen from its bottom tab', () => {
    renderTabs();

    fireEvent.press(screen.getByRole('tab', { name: 'Aktivitas' }));

    expect(
      screen.getByRole('tab', { name: 'Aktivitas', selected: true }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Akan datang')).toBeOnTheScreen();
  });
});
