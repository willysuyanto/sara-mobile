# AGENTS.md — Testing

Scope: `src/tests/` and Jest configuration. Run tests with `yarn test` (`yarn test:report` for coverage + JUnit).

## Setup

- `jest.config.js`: preset `react-native`; `setupFiles` loads `react-native-gesture-handler/jestSetup.js`; `setupFilesAfterEnv` loads `jest.setup.js`; `transformIgnorePatterns` allows `react-native`, `@react-native*`, `@react-native-community`, `@react-navigation`, `@react-native-vector-icons`, and `ky` to be transformed; `moduleNameMapper` sends `*.ttf` to `src/tests/__mocks__/fileMock.js`.
- `jest.setup.js` is the single entry that registers all mocks:
  ```ts
  import './src/tests/__mocks__/libs';
  import './src/tests/__mocks__/getAssetsContext';
  ```
- Test files: `**/*.test.ts?(x)` / `**/*.test.js?(x)`.

## Why native mocks exist

This app targets the New Architecture (RN `0.84`). Native modules such as `react-native-mmkv` (Nitro), `react-native-worklets`/`reanimated`, `react-native-permissions`, and `react-native-safe-area-context` cannot initialize in Node. Without mocks, a test fails with a WorkletsError / native-initialization crash. All of them are mocked in `src/tests/__mocks__/libs/`.

## `__mocks__/libs/`

`libs/index.ts` imports each mock for its side effect. **Order matters** — `react-native-mmkv` is first.

```ts
import './react-native-mmkv';
import './react-native-permissions';
import './react-native-reanimated';
import './react-native-safe-area-context';
import './react-native-vector-icons';
```

- `react-native-mmkv.ts` — maps `createMMKV` to the package's in-memory mock: `jest.requireActual('react-native-mmkv/lib/createMMKV/createMockMMKV')`.
- `react-native-reanimated.ts` — mocks `react-native-worklets` with its shipped `src/mock`, then calls `setUpTests()`.
- `react-native-permissions.ts` / `react-native-safe-area-context.ts` — use each package's official `.../mock` export.
- `react-native-vector-icons.ts` — mocks `@react-native-vector-icons/common` so `createIconSet` renders the **icon name** as text (e.g. `circle-alert`), which lets tests assert on the icon without a font.

## Adding a new native mock

1. Create `src/tests/__mocks__/libs/<package>.ts` with a `jest.mock('<package>', () => ...)` factory.
2. Register it in `src/tests/__mocks__/libs/index.ts` (respect ordering constraints).
3. Prefer the package's own `.../mock` export when it ships one.

Calling `jest.requireActual(...)` returns `any` and trips strict ESLint. To stay clean:

- Prefer the module's shipped mock export, or
- Use the generic parameter: `jest.requireActual<typeof import('path')>('path')` — but avoid `typeof import('...src/...')` for packages whose source has its own type errors (it pulls the file into `tsc`); use a neutral generic like `jest.requireActual<Record<string, unknown>>(...)` there.
- Do **not** assert with `as`: `@typescript-eslint/no-unnecessary-type-assertion` rejects an assertion on an `any` expression.

`src/tests/__mocks__/getAssetsContext.ts` mocks `@/theme/assets/getAssetsContext` so `AssetByVariant`/`IconByVariant` resolve deterministic URIs.

## Writing tests

Tests use `@testing-library/react-native` (`render`, `screen`, `fireEvent`).

- Wrap components that need app context with the same providers as `src/App.tsx`. `src/tests/TestAppWrapper.tsx` provides `GestureHandlerRootView` → `QueryClientProvider` → `ThemeProvider` (and imports `@/translations`) — use it (as in `src/screens/Landing/Landing.test.tsx`) as needed.
- `ThemeProvider` requires a `storage` prop; create one with `createMMKV()` (backed by the mock).
- Components with variant-dependent behavior (e.g. `Skeleton` colors) should assert against the **semantic token** value, not a hardcoded literal — when a token changes, update the expectation in the same change.
- `react-hook-form` validates asynchronously: a state update triggered by a field change is only rendered after an `act` flush. Fire the event, then flush:

  ```tsx
  fireEvent.changeText(screen.getByTestId('email'), 'bukan-email');

  await act(async () => {
    await Promise.resolve();
  });
  ```

  Without the flush, `waitFor` sees a stale tree (the form state is updated but the component has not re-rendered).

## Verifying

Always finish with `yarn test` **and** `yarn lint` (ESLint + Prettier + `tsc`).
