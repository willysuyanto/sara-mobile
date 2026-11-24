import type {
  LoginPayload,
  MeUser,
  RegisterPayload,
  ResendOtpPayload,
  Session,
  VerifyEmailPayload,
} from './schema';

import { isHTTPError } from 'ky';
import * as z from 'zod';

import { getInstance } from '@/services/instance';

import { authUserSchema, meUserSchema, tokenSchema } from './schema';

const GENERIC_ERROR_MESSAGE = 'common_error';
const NETWORK_ERROR_STATUS = 0;
const NO_RETRY = 0;
const UNAUTHORIZED_STATUS = 401;

const messageResponseSchema = z.object({
  message: z.string(),
  success: z.literal(true),
});

const loginResponseSchema = z.object({
  data: z.object({
    token: tokenSchema,
    user: authUserSchema,
  }),
  success: z.literal(true),
});

const meResponseSchema = z.object({
  data: meUserSchema,
  success: z.literal(true),
});

const errorResponseSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  requestId: z.string().optional(),
});

type AuthApiErrorDetails = {
  code?: string;
  requestId?: string;
};

type AuthRequestOptions = {
  json?: unknown;
  method: 'get' | 'post';
  token?: string;
};

export class AuthApiError extends Error {
  readonly code?: string;
  readonly requestId?: string;
  readonly status: number;

  constructor(
    status: number,
    message: string,
    details: AuthApiErrorDetails = {},
  ) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.code = details.code;
    this.requestId = details.requestId;
  }
}

function parseResponse<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new AuthApiError(NETWORK_ERROR_STATUS, GENERIC_ERROR_MESSAGE);
  }
  return result.data;
}

async function request(path: string, options: AuthRequestOptions) {
  try {
    const instance = await getInstance();
    const response = await instance(path, {
      method: options.method,
      redirect: 'manual',
      retry: NO_RETRY,
      ...(options.json === undefined ? {} : { json: options.json }),
      ...(options.token === undefined
        ? {}
        : { headers: { Authorization: `Bearer ${options.token}` } }),
    });
    return await response.json();
  } catch (error) {
    throw await toAuthApiError(error);
  }
}

async function toAuthApiError(error: unknown) {
  if (!isHTTPError(error)) {
    return new AuthApiError(NETWORK_ERROR_STATUS, GENERIC_ERROR_MESSAGE);
  }

  const body: unknown = await error.response.json().catch(() => {});
  const details = errorResponseSchema.safeParse(body);
  const { code, message, requestId } = details.success ? details.data : {};

  return new AuthApiError(
    error.response.status,
    message ?? GENERIC_ERROR_MESSAGE,
    { code, requestId },
  );
}

export const AuthServices = {
  login: async (payload: LoginPayload): Promise<Session> => {
    const body = await request('auth/login', { json: payload, method: 'post' });
    return parseResponse(loginResponseSchema, body).data;
  },

  me: async (token: string): Promise<MeUser> => {
    if (!tokenSchema.safeParse(token).success) {
      throw new AuthApiError(UNAUTHORIZED_STATUS, GENERIC_ERROR_MESSAGE);
    }
    const body = await request('auth/me', { method: 'get', token });
    return parseResponse(meResponseSchema, body).data;
  },

  register: async (payload: RegisterPayload) => {
    const body = await request('auth/register', {
      json: payload,
      method: 'post',
    });
    return parseResponse(messageResponseSchema, body);
  },

  resendOtp: async (payload: ResendOtpPayload) => {
    const body = await request('auth/resend-otp', {
      json: payload,
      method: 'post',
    });
    return parseResponse(messageResponseSchema, body);
  },

  verifyEmail: async (payload: VerifyEmailPayload) => {
    const body = await request('auth/verify-email', {
      json: payload,
      method: 'post',
    });
    return parseResponse(messageResponseSchema, body);
  },
};
