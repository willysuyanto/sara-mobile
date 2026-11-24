import type { LoginPayload } from './schema';

import { useMutation } from '@tanstack/react-query';

import { AuthServices } from './authService';
import { saveSession } from './session';

const useLoginMutation = () =>
  useMutation({
    gcTime: 0,
    mutationFn: async (payload: LoginPayload) =>
      saveSession(await AuthServices.login(payload)),
  });

const useRegisterMutation = () =>
  useMutation({
    gcTime: 0,
    mutationFn: AuthServices.register,
  });

const useResendOtpMutation = () =>
  useMutation({ mutationFn: AuthServices.resendOtp });

const useVerifyEmailMutation = () =>
  useMutation({ gcTime: 0, mutationFn: AuthServices.verifyEmail });

export const useAuth = () => ({
  useLogin: useLoginMutation,
  useRegister: useRegisterMutation,
  useResendOtp: useResendOtpMutation,
  useVerifyEmail: useVerifyEmailMutation,
});
