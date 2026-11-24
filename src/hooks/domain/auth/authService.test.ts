import type { Input } from 'ky';

import { AuthApiError, AuthServices } from './authService';
import { loginSchema, registerSchema, verifyEmailSchema } from './schema';

const mockFetch = jest.fn<Promise<Response>, [Input]>();
let lastRequestBody: string | undefined;

jest.mock('@/services/instance', () => {
  const ky = jest.requireActual<typeof import('ky')>('ky');
  return {
    getInstance: () =>
      Promise.resolve(
        ky.default.create({
          fetch: mockFetch,
          prefixUrl: 'https://api.test/',
        }),
      ),
  };
});

const CREATED_STATUS = 201;
const OK_STATUS = 200;
const UNAUTHORIZED_STATUS = 401;
const UNAVAILABLE_STATUS = 503;

const user = { email: 'user@example.com', id: 1, name: 'Jane Doe' };
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.sig';
const loginBody = { data: { token, user }, success: true };

function getRequest() {
  const input = mockFetch.mock.calls.at(-1)?.[0];
  if (!(input instanceof Request)) {
    throw new TypeError('Expected a Request.');
  }
  return input;
}

function getRequestBody(): unknown {
  if (lastRequestBody === undefined) {
    throw new Error('No request body.');
  }
  return JSON.parse(lastRequestBody);
}

function jsonResponse(body: unknown, status = OK_STATUS) {
  // eslint-disable-next-line unicorn/prefer-response-static-json -- Response.json is not in React Native's types.
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });
}

function mockResponse(body: unknown, status = OK_STATUS) {
  mockFetch.mockImplementationOnce(async (input) => {
    lastRequestBody = await readRequestBody(input);
    return jsonResponse(body, status);
  });
}

async function readRequestBody(input: Input) {
  if (!(input instanceof Request)) {
    throw new TypeError('Expected a Request.');
  }
  return input.text();
}

beforeEach(() => {
  lastRequestBody = undefined;
  mockFetch.mockReset();
});

it('unwraps a valid login envelope without sending a bearer', async () => {
  mockResponse(loginBody);

  await expect(
    AuthServices.login({ email: 'user@example.com', password: 'Passw0rd!' }),
  ).resolves.toEqual(loginBody.data);

  const request = getRequest();
  expect(request.url).toBe('https://api.test/auth/login');
  expect(request.method).toBe('POST');
  expect(request.headers.get('Authorization')).toBeNull();
  expect(getRequestBody()).toEqual({
    email: 'user@example.com',
    password: 'Passw0rd!',
  });
});

const invalidLoginBodies: [string, unknown][] = [
  ['missing success', { data: loginBody.data }],
  ['success false', { ...loginBody, success: false }],
  ['empty token', { data: { ...loginBody.data, token: '' }, success: true }],
  [
    'whitespace token',
    { data: { ...loginBody.data, token: 'abc def' }, success: true },
  ],
  [
    'control character token',
    { data: { ...loginBody.data, token: 'abc\ndef' }, success: true },
  ],
];

it.each(invalidLoginBodies)(
  'rejects a login envelope with %s',
  async (_name, body) => {
    mockResponse(body);

    await expect(
      AuthServices.login({ email: 'user@example.com', password: 'Passw0rd!' }),
    ).rejects.toMatchObject({ message: 'common_error', status: 0 });
  },
);

it('unwraps a valid me envelope with an explicit bearer', async () => {
  const meUser = { ...user, emailVerified: true };
  mockResponse({ data: meUser, success: true });

  await expect(AuthServices.me('abc.DEF-123_456~+/=')).resolves.toEqual(meUser);

  const request = getRequest();
  expect(request.url).toBe('https://api.test/auth/me');
  expect(request.method).toBe('GET');
  expect(request.headers.get('Authorization')).toBe(
    'Bearer abc.DEF-123_456~+/=',
  );
});

it('rejects a me envelope that is missing success', async () => {
  mockResponse({ data: { ...user, emailVerified: false } });

  await expect(AuthServices.me(token)).rejects.toMatchObject({
    message: 'common_error',
    status: 0,
  });
});

it('rejects a bearer token with control characters before fetching', async () => {
  await expect(AuthServices.me('abc\ndef')).rejects.toMatchObject({
    message: 'common_error',
    status: UNAUTHORIZED_STATUS,
  });
  expect(mockFetch).not.toHaveBeenCalled();
});

it('preserves the HTTP status and error details', async () => {
  mockResponse(
    {
      code: 'ACCOUNT_CREATED',
      message: 'Account already created',
      requestId: 'req-1',
    },
    UNAVAILABLE_STATUS,
  );

  await expect(
    AuthServices.register({
      email: 'user@example.com',
      fullName: 'Jane Doe',
      password: 'Passw0rd!',
    }),
  ).rejects.toMatchObject({
    code: 'ACCOUNT_CREATED',
    message: 'Account already created',
    requestId: 'req-1',
    status: UNAVAILABLE_STATUS,
  });
  expect(mockFetch).toHaveBeenCalledTimes(1);
});

it('preserves the HTTP status when the error body is not JSON', async () => {
  mockFetch.mockImplementationOnce(async (input) => {
    lastRequestBody = await readRequestBody(input);
    return new Response('<html>', { status: UNAVAILABLE_STATUS });
  });

  await expect(
    AuthServices.register({
      email: 'user@example.com',
      fullName: 'Jane Doe',
      password: 'Passw0rd!',
    }),
  ).rejects.toMatchObject({
    message: 'common_error',
    status: UNAVAILABLE_STATUS,
  });
});

it('does not leak network errors', async () => {
  mockFetch.mockRejectedValueOnce(new Error('token=secret'));

  const error: unknown = await AuthServices.login({
    email: 'user@example.com',
    password: 'Passw0rd!',
  }).catch((error: unknown) => error);

  expect(error).toBeInstanceOf(AuthApiError);
  expect(error).toMatchObject({ message: 'common_error', status: 0 });
  expect(String(error)).not.toContain('secret');
});

it('omits a blank confirmPassword and returns the success message', async () => {
  mockResponse({ message: 'Check your email', success: true }, CREATED_STATUS);

  const payload = registerSchema.parse({
    confirmPassword: '',
    email: ' USER@Example.COM ',
    fullName: 'Jane Doe',
    password: 'Passw0rd!',
  });

  await expect(AuthServices.register(payload)).resolves.toEqual({
    message: 'Check your email',
    success: true,
  });
  expect(getRequestBody()).toEqual({
    email: 'user@example.com',
    fullName: 'Jane Doe',
    password: 'Passw0rd!',
  });
});

it('accepts punctuation in names and Unicode passwords with ASCII letters/digits', () => {
  expect(
    registerSchema.parse({
      email: 'user@example.com',
      fullName: '  Jean-Luc O’Neill 2nd ',
      password: 'Pässwörd1',
    }),
  ).toMatchObject({
    fullName: 'Jean-Luc O’Neill 2nd',
    password: 'Pässwörd1',
  });
});

it('rejects registration passwords without an ASCII letter or digit', () => {
  expect(
    registerSchema.safeParse({
      email: 'user@example.com',
      fullName: 'Jane Doe',
      password: 'Парольаб',
    }).success,
  ).toBe(false);
  expect(
    registerSchema.safeParse({
      email: 'user@example.com',
      fullName: 'Jane Doe',
      password: 'Пароль12',
    }).success,
  ).toBe(false);
});

it('requires a password at sign-in without applying registration rules', () => {
  expect(
    loginSchema.safeParse({
      email: 'user@example.com',
      password: ' Я ',
    }).success,
  ).toBe(true);
  expect(
    loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    }).success,
  ).toBe(false);
});

it('treats only an empty confirmPassword as omitted', () => {
  expect(
    registerSchema.safeParse({
      confirmPassword: '',
      email: 'user@example.com',
      fullName: 'Jane Doe',
      password: 'Passw0rd!',
    }).success,
  ).toBe(true);
  expect(
    registerSchema.safeParse({
      confirmPassword: '   ',
      email: 'user@example.com',
      fullName: 'Jane Doe',
      password: 'Passw0rd!',
    }).success,
  ).toBe(false);
});

it('requires an exact six digit OTP', () => {
  expect(
    verifyEmailSchema.safeParse({ code: '123456', email: 'user@example.com' })
      .success,
  ).toBe(true);
  expect(
    verifyEmailSchema.safeParse({ code: '12345', email: 'user@example.com' })
      .success,
  ).toBe(false);
  expect(
    verifyEmailSchema.safeParse({ code: '1234567', email: 'user@example.com' })
      .success,
  ).toBe(false);
});
