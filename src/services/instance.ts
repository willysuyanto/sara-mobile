import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
} from '@react-native-firebase/remote-config';
import ky from 'ky';

const FETCH_TIMEOUT_MILLISECONDS = 3000;
const MINIMUM_FETCH_INTERVAL_MILLISECONDS = 300_000;
const MAXIMUM_PORT = 65_535;
const BASE_URL_PATTERN =
  /^https?:\/\/[\da-z](?:[\da-z-]*[\da-z])?(?:\.[\da-z](?:[\da-z-]*[\da-z])?)*(?::(\d{1,5}))?(?:\/[^\s#?\\]*)?$/i;

let instance: ReturnType<typeof createInstance> | undefined;
let baseUrl: ReturnType<typeof resolveBaseUrl> | undefined;

export function getApiBaseUrl() {
  baseUrl ??= resolveBaseUrl().catch((error: unknown) => {
    baseUrl = undefined;
    throw error;
  });
  return baseUrl;
}

export function getInstance() {
  // Keep one backend per app session so React Query cannot mix servers' data.
  instance ??= createInstance().catch((error: unknown) => {
    instance = undefined;
    throw error;
  });
  return instance;
}

async function createInstance() {
  return ky.extend({
    headers: {
      Accept: 'application/json',
    },
    prefixUrl: await getApiBaseUrl(),
  });
}

async function getRemoteBaseUrl() {
  try {
    const config = getRemoteConfig();
    config.settings = {
      fetchTimeoutMillis: FETCH_TIMEOUT_MILLISECONDS,
      minimumFetchIntervalMillis: MINIMUM_FETCH_INTERVAL_MILLISECONDS,
    };
    // A failed fetch can still leave a valid previously activated value.
    await fetchAndActivate(config).catch(() => undefined);
    const url = getString(config, 'base_url').trim();
    return url.startsWith('https://') && isBaseUrl(url) ? url : undefined;
  } catch {
    return undefined;
  }
}

function isBaseUrl(value: string) {
  // React Native's built-in URL constructor does not validate absolute URLs.
  const match = BASE_URL_PATTERN.exec(value);
  return match !== null && Number(match[1] || 0) <= MAXIMUM_PORT;
}

async function resolveBaseUrl() {
  const fallback = process.env.BASE_URL?.trim();
  const debugUrl = __DEV__ && fallback ? fallback : undefined;
  const selected = debugUrl ?? (await getRemoteBaseUrl()) ?? fallback;

  if (
    !selected ||
    !isBaseUrl(selected) ||
    (!__DEV__ && !selected.startsWith('https://'))
  ) {
    throw new Error('Set a valid API base URL in BASE_URL or Remote Config.');
  }

  return selected.replace(/\/+$/, '');
}
