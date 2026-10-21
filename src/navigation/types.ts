import type { StackScreenProps } from '@react-navigation/stack';

import type { Paths } from '@/navigation/paths';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Dashboard]: undefined;
  [Paths.ForgotPassword]: undefined;
  [Paths.Landing]: undefined;
  [Paths.Login]: undefined;
  [Paths.Register]: undefined;
  [Paths.Splashscreen]: undefined;
};
