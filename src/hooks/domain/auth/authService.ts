import type { LoginPayload, RegisterPayload, Session } from './schema';

/**
 * Auth service against the SARA backend.
 *
 * TODO: replace the stubbed responses with real `instance` calls once the auth
 * endpoints (paths and payload shapes) are available — e.g.
 * `instance.post('auth/login', { json: payload }).json()`.
 */
export const AuthServices = {
  login: (payload: LoginPayload): Promise<Session> =>
    Promise.resolve({
      email: payload.email,
      name: payload.email.split('@')[0] ?? payload.email,
      token: 'stub-token',
    }),

  register: (payload: RegisterPayload): Promise<Session> =>
    Promise.resolve({
      email: payload.email,
      name: payload.fullName,
      token: 'stub-token',
    }),
};
