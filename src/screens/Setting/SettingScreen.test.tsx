import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

import TestAppWrapper from '@/tests/TestAppWrapper';

import SettingScreen from './SettingScreen';

const checkPermission = jest.mocked(checkNotifications);
const requestPermission = jest.mocked(requestNotifications);
const openDeviceSettings = jest.mocked(openSettings);

describe('SettingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    checkPermission.mockResolvedValue({ settings: {}, status: RESULTS.DENIED });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('checks without prompting, then requests permission and shows the new status', async () => {
    requestPermission.mockResolvedValueOnce({
      settings: {},
      status: RESULTS.GRANTED,
    });
    render(<SettingScreen onSignOut={jest.fn()} />, {
      wrapper: TestAppWrapper,
    });

    const row = await screen.findByRole('button', {
      name: 'Izin notifikasi. Belum aktif',
    });
    expect(requestPermission).not.toHaveBeenCalled();
    expect(openDeviceSettings).not.toHaveBeenCalled();
    fireEvent.press(row);
    expect(requestPermission).toHaveBeenCalledWith(['alert', 'badge', 'sound']);
    fireEvent.press(
      await screen.findByRole('button', { name: 'Izin notifikasi. Aktif' }),
    );
    expect(openDeviceSettings).toHaveBeenCalledWith('notifications');
  });

  it('offers device settings after a blocked request without opening them automatically', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    requestPermission.mockResolvedValueOnce({
      settings: {},
      status: RESULTS.BLOCKED,
    });
    render(<SettingScreen onSignOut={jest.fn()} />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(
      await screen.findByRole('button', {
        name: 'Izin notifikasi. Belum aktif',
      }),
    );
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(
        'Izin notifikasi',
        'Kamu bisa mengaktifkan notifikasi di pengaturan perangkat.',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Buka pengaturan' }),
        ]),
      );
    });
    expect(openDeviceSettings).not.toHaveBeenCalled();
    const buttons = alert.mock.lastCall?.[2];
    buttons?.find(({ text }) => text === 'Buka pengaturan')?.onPress?.();
    expect(openDeviceSettings).toHaveBeenCalledWith('notifications');
  });

  it('lets users retry a failed check and disables unavailable permission', async () => {
    checkPermission.mockRejectedValueOnce(new Error('Unable to check'));
    checkPermission.mockResolvedValueOnce({
      settings: {},
      status: RESULTS.UNAVAILABLE,
    });
    render(<SettingScreen onSignOut={jest.fn()} />, {
      wrapper: TestAppWrapper,
    });

    fireEvent.press(
      await screen.findByRole('button', { name: /izin gagal diperiksa/i }),
    );
    expect(
      await screen.findByRole('button', {
        name: 'Izin notifikasi. Tidak tersedia di perangkat ini',
      }),
    ).toBeDisabled();
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it('keeps the private session informational and only signs out after confirmation', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const onSignOut = jest.fn();
    render(<SettingScreen onSignOut={onSignOut} />, {
      wrapper: TestAppWrapper,
    });
    await screen.findByText('Belum aktif');

    expect(
      screen.getByRole('button', { name: /sesi pribadi/i }),
    ).toBeDisabled();
    fireEvent.press(screen.getByRole('button', { name: 'Keluar dari akun' }));
    expect(alert).toHaveBeenCalledWith(
      'Keluar dari akun?',
      'Kamu perlu masuk lagi untuk mengakses akunmu.',
      [
        { style: 'cancel', text: 'Batal' },
        { onPress: onSignOut, style: 'destructive', text: 'Keluar' },
      ],
    );
    const buttons = alert.mock.lastCall?.[2];
    buttons?.find(({ style }) => style === 'cancel')?.onPress?.();
    expect(onSignOut).not.toHaveBeenCalled();
    buttons?.find(({ style }) => style === 'destructive')?.onPress?.();
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
