import type { LoginPayload, RegisterPayload, Session } from './schema';

import { useMutation } from '@tanstack/react-query';

import { AuthServices } from './authService';

const useLoginMutation = () =>
  useMutation<Session, Error, LoginPayload>({
    mutationFn: AuthServices.login,
  });

const useRegisterMutation = () =>
  useMutation<Session, Error, RegisterPayload>({
    mutationFn: AuthServices.register,
  });

export const useAuth = () => ({
  useLogin: useLoginMutation,
  useRegister: useRegisterMutation,
});
