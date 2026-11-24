import type { StackScreenProps } from '@react-navigation/stack';

import type { Paths } from '@/navigation/paths';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Dashboard]: undefined;
  [Paths.ForgotPassword]: undefined;
  [Paths.Landing]: undefined;
  [Paths.Login]: { email?: string } | undefined;
  [Paths.Register]: undefined;
  [Paths.VerifyEmail]: { email: string; message?: string };
};

export type RootTabParamList = {
  [Paths.Aktivitas]: undefined;
  [Paths.Beranda]: undefined;
  [Paths.Pengaturan]: undefined;
  [Paths.Riwayat]: undefined;
  [Paths.Sara]: undefined;
};
