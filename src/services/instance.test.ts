import {
  fetchAndActivate,
  getString,
} from '@react-native-firebase/remote-config';

const fallbackUrl = 'https://fallback.example.test/api';
const remoteUrl = 'https://remote.example.test/v1/';
const originalBaseUrl = process.env.BASE_URL;
const originalDevelopment = __DEV__;

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(fetchAndActivate).mockResolvedValue(true);
  process.env.BASE_URL = fallbackUrl;
  Object.assign(globalThis, { __DEV__: false });
});

afterEach(() => {
  Object.assign(globalThis, { __DEV__: originalDevelopment });
  if (originalBaseUrl === undefined) {
    delete process.env.BASE_URL;
  } else {
    process.env.BASE_URL = originalBaseUrl;
  }
});

async function getRequestUrl() {
  let requestUrl: string | undefined;
  await jest.isolateModulesAsync(async () => {
    const { getInstance } =
      jest.requireActual<typeof import('./instance')>('./instance');
    const pendingClient = getInstance();
    expect(getInstance()).toBe(pendingClient);
    const client = await pendingClient;
    await client.get('users/1', {
      fetch: (input) => {
        requestUrl = input instanceof Request ? input.url : String(input);
        return Promise.resolve(new Response('{}'));
      },
    });
  });
  return requestUrl;
}

it('uses the activated HTTPS URL and fetches only once per session', async () => {
  jest.mocked(getString).mockReturnValue(`  ${remoteUrl}  `);

  expect(await getRequestUrl()).toBe(`${remoteUrl}users/1`);
  expect(fetchAndActivate).toHaveBeenCalledTimes(1);
  expect(getString).toHaveBeenCalledWith(expect.anything(), 'base_url');
});

it.each([
  '',
  'not-a-url',
  'http://remote.example.test',
  `${remoteUrl}?env=prod`,
])('uses BASE_URL when base_url is invalid (%s)', async (value) => {
  jest.mocked(getString).mockReturnValue(value);
  expect(await getRequestUrl()).toBe(`${fallbackUrl}/users/1`);
});

it('uses BASE_URL when Firebase fails and no activated URL exists', async () => {
  jest.mocked(fetchAndActivate).mockRejectedValue(new Error('Offline'));
  jest.mocked(getString).mockReturnValue('');

  expect(await getRequestUrl()).toBe(`${fallbackUrl}/users/1`);
});

it('keeps the previously activated URL when Firebase fails', async () => {
  jest.mocked(fetchAndActivate).mockRejectedValue(new Error('Offline'));
  jest.mocked(getString).mockReturnValue(remoteUrl);

  expect(await getRequestUrl()).toBe(`${remoteUrl}users/1`);
});

it('uses the local environment URL instead of Remote Config in debug builds', async () => {
  Object.assign(globalThis, { __DEV__: true });
  process.env.BASE_URL = 'http://10.0.2.2:3000/api/';
  jest.mocked(getString).mockReturnValue(remoteUrl);

  expect(await getRequestUrl()).toBe('http://10.0.2.2:3000/api/users/1');
  expect(fetchAndActivate).not.toHaveBeenCalled();
});

it('rejects cleartext fallback URLs in release builds', async () => {
  process.env.BASE_URL = 'http://localhost:3000/api';
  jest.mocked(getString).mockReturnValue('');

  await expect(getRequestUrl()).rejects.toThrow('Set a valid API base URL');
});
