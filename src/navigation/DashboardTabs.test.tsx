import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

import { Landing } from '@/screens';

import TestAppWrapper from '@/tests/TestAppWrapper';

import DashboardTabs from './DashboardTabs';

const Stack = createStackNavigator<RootStackParamList>();

const renderTabs = () =>
  render(
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={DashboardTabs} name={Paths.Dashboard} />
          <Stack.Screen component={Landing} name={Paths.Landing} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>,
    { wrapper: TestAppWrapper },
  );

describe('DashboardTabs', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the five bottom destinations', () => {
    renderTabs();

    expect(screen.getByText('Beranda')).toBeTruthy();
    expect(screen.getByText('Aktivitas')).toBeTruthy();
    expect(screen.getByText('SARA')).toBeTruthy();
    expect(screen.getByText('Riwayat')).toBeTruthy();
    expect(screen.getByText('Pengaturan')).toBeTruthy();
  });

  it('opens Settings and returns to Landing after confirmed sign-out', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    renderTabs();

    fireEvent.press(screen.getByRole('tab', { name: 'Pengaturan' }));

    expect(
      screen.getByRole('tab', { name: 'Pengaturan', selected: true }),
    ).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button', { name: 'Keluar dari akun' }));

    const confirm = alert.mock.lastCall?.[2]?.find(
      ({ style }) => style === 'destructive',
    )?.onPress;
    expect(confirm).toBeDefined();
    await act(async () => {
      confirm?.();
      await Promise.resolve();
    });

    expect(
      screen.getByRole('button', { name: 'Mulai sekarang' }),
    ).toBeOnTheScreen();
    expect(screen.queryByRole('tab', { name: 'Pengaturan' })).toBeNull();
  });

  it('opens the Activity screen from its bottom tab', () => {
    renderTabs();

    fireEvent.press(screen.getByRole('tab', { name: 'Aktivitas' }));

    expect(
      screen.getByRole('tab', { name: 'Aktivitas', selected: true }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Akan datang')).toBeOnTheScreen();
  });

  it('opens the planner from the SARA tab', () => {
    renderTabs();

    fireEvent.press(screen.getByRole('tab', { name: 'SARA' }));

    expect(
      screen.getByRole('tab', { name: 'SARA', selected: true }),
    ).toBeOnTheScreen();
    expect(
      screen.getByPlaceholderText(
        'Misalnya, belajar algoritma besok jam 10 pagi',
      ),
    ).toBeOnTheScreen();
  });

  it('opens the history timeline from the Riwayat tab', () => {
    renderTabs();

    fireEvent.press(screen.getByRole('tab', { name: 'Riwayat' }));

    expect(
      screen.getByRole('tab', { name: 'Riwayat', selected: true }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Terakhir diperbarui')).toBeOnTheScreen();
  });
});
