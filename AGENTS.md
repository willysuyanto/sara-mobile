# AGENTS.md

Guide for AI agents and contributors working in this repository.

## What this project is

**SARA — Smart Assistant for Responsive Automation.** A mobile smart-assistant app that helps users manage activities, tasks, and schedules through natural-language interaction, automation, reminders, and activity-based assistance.

This repository is the **React Native mobile app** (not the backend). It is an early-stage app bootstrapped from a community template, so some scaffolding (e.g. the `jsonplaceholder` API URL) is placeholder code to be replaced with real SARA features.

Project docs: [`README.md`](./README.md) (setup, in Indonesian), [`DESIGN.md`](./DESIGN.md) (design system).

## Tech stack

- **Framework**: React Native `0.84.0`, React `19.x` (New Architecture by default).
- **Language**: TypeScript `5.x`, strict.
- **Navigation**: `@react-navigation/native` + `@react-navigation/stack`.
- **Server state**: `@tanstack/react-query` `^5`.
- **HTTP**: `ky` (`src/services/instance.ts`, base URL from `process.env.API_URL`).
- **Local storage**: `react-native-mmkv` `^4` (synchronous KV).
- **Validation**: `zod` `^4`.
- **Forms**: `react-hook-form` `^7` + `@hookform/resolvers` `^6` (zod resolver).
- **Icons**: `@react-native-vector-icons/lucide` `^14` (Lucide set only, imported from the `/static` subpath).
- **i18n**: `i18next` + `react-i18next` (`intl-pluralrules`).
- **Animation/gestures**: `react-native-reanimated` `^4`, `react-native-worklets`, `react-native-gesture-handler`.
- **UI/assets**: `react-native-svg` + `react-native-svg-transformer`, `safe-area-context`, `screens`, `masked-view`.
- **Errors**: `react-error-boundary`.
- **Native modules**: `@react-native-firebase/{app,messaging}`, `react-native-permissions`.
- **Testing**: Jest `^30` + `@testing-library/react-native`.
- **Lint/format**: ESLint `9` (flat config) + Prettier `3`.
- **Dev tools**: Reactotron (+ MMKV & React Query plugins).
- **Package manager**: **Yarn v1** (`yarn.lock`). Node `>= 22.11.0`.

## Commands

```bash
yarn install            # install deps
yarn pod-install        # iOS pods (after install)
yarn start              # Metro bundler
yarn android            # build & run Android
yarn ios                # build & run iOS

yarn test               # Jest
yarn test:report        # Jest + coverage + junit
yarn lint               # eslint . && prettier --check && tsc
yarn lint:rules         # ESLint
yarn lint:code-format   # Prettier check
yarn lint:type-check    # tsc
yarn lint:fix           # eslint --fix && prettier --write
```

Always run `yarn lint` **and** `yarn test` before considering a task done. Do not commit unless explicitly asked.

## Project structure

```
src/
├── App.tsx                 # root: providers + exported queryClient & storage
├── AppHeadlessCheck.tsx    # headless (messaging) entry
├── components/             # atoms / molecules / organisms / templates (barrel index.ts each)
├── hooks/                  # custom hooks; domain hooks in hooks/domain/<entity>/, forms in hooks/form/
├── navigation/             # Application.tsx navigator, paths.ts, types.ts
├── screens/                # screen components (barrel index.ts)
├── services/               # ky HTTP instance, firebase messaging
├── theme/                  # theme system + design tokens (see src/theme/AGENTS.md)
├── translations/           # i18next setup + en-EN / fr-FR JSON
├── tests/                  # test wrappers + native mocks (see src/tests/AGENTS.md)
└── reactotron.config.ts    # Reactotron setup (dev)
```

Path alias: **`@/*` → `./src/*`** (configured in `tsconfig.json` and `babel.config.js`).

## Architecture / patterns

- **Providers** are composed in `src/App.tsx`: `GestureHandlerRootView` → `QueryClientProvider` (`queryClient`) → `ThemeProvider` (`storage`) → `ApplicationNavigator`. i18n is initialized via a side-effect import (`import '@/translations'`).
- **Data layer** follows a service + hook split per entity:
  - `hooks/domain/<entity>/schema.ts` — zod schema + inferred types.
  - `hooks/domain/<entity>/<entity>Service.ts` — calls using the `ky` `instance`.
  - `hooks/domain/<entity>/use<Entity>.ts` — TanStack Query hooks (query keys as a `const enum`, query + invalidation helpers).
  - Access config via `process.env.*` (inlined by `babel-plugin-inline-dotenv`), never hardcode URLs.
- **Navigation**: register screens in `src/navigation/Application.tsx` using `Paths` (`paths.ts`) and the `RootStackParamList` type (`types.ts`). Screen names come from `Paths`.
- **i18n**: `src/translations/index.ts` initializes i18next (`defaultNS: 'saramobile'`, fallback `fr-FR`). Add keys under the `saramobile` namespace in **both** `en-EN.json` and `fr-FR.json`. Use the `capitalize` formatter for capitalization. Translation keys are typed via `src/translations/i18next.d.ts` (module augmentation) — keep the JSON shape and the augmentation in sync.
- **Components** are grouped by atomic-design level with a barrel `index.ts` exporting each. Import via `@/components/...`.
- **Forms**: `useZodForm` (`src/hooks/form/useZodForm.ts`) wraps `useForm` with the zod resolver — field values are typed from the schema **input**, submitted values from its **output** (coercions/transforms applied). `FormInput` (`src/components/molecules/FormInput`) binds a field to the `Input` molecule and maps the field error to the input's error state.
- **Theme** is consumed with the `useTheme()` hook; see `DESIGN.md` and `src/theme/AGENTS.md`.

## Environment

- `.env` is local and git-ignored. Copy `.env.example` → `.env` and set values.
- Current var: `API_URL` (used by `src/services/instance.ts`).
- **Any new env var must also be added to `.env.example`.**

## Conventions & guardrails

ESLint is strict (`strictTypeChecked` + `stylisticTypeChecked` + `unicorn/all` + `perfectionist/recommended-alphabetical`) and Prettier uses `singleQuote: true`. Notable enforced rules:

- **Type definitions** must use `type` (not `interface`) — `@typescript-eslint/consistent-type-definitions`.
- **Import order** is alphabetical and grouped (`theme/hooks/navigation/translations`, then `components/screens`, then `test`, then internal), with one blank line between groups. Let `eslint --fix` sort them.
- **`no-magic-numbers`** is an error (ignore: -1..6). Exempt under `**/theme/*.ts` and `**/theme/tokens/*.ts`.
- **`no-console`** allows only `console.warn` / `console.error`.
- `react/require-default-props`, `react/jsx-max-depth` (10), React 19 + hooks rules are enforced.
- `unicorn/prevent-abbreviations` (allow-list: `env`, `Param`, `props`, `Props`).
- No comments unless they add real value (project style favors self-documenting code).

## Native / build notes

- Assets (fonts, icons) are declared in **`react-native.config.js`** (`assets: ['./src/theme/assets/fonts']`). After changing fonts/assets, `npx react-native-asset` + a **full native rebuild** is required (Metro reload is not enough).
- `babel.config.js`: `react-native-worklets/plugin` **must be the last plugin**.
- `metro.config.js`: SVG is a source extension handled by `react-native-svg-transformer`.
- If `android/gradlew` ever reports "Permission denied", fix with `chmod +x android/gradlew`.

## Testing

Jest uses the `react-native` preset with native-module mocks registered in `jest.setup.js`. Details and how to add mocks: [`src/tests/AGENTS.md`](./src/tests/AGENTS.md).

## Where to look first

- Design tokens / colors / typography: `DESIGN.md`, `src/theme/`.
- App wiring: `src/App.tsx`, `src/navigation/Application.tsx`.
- API pattern: `src/services/instance.ts`, `src/hooks/domain/user/*`.
- Env & commands: `README.md`, `package.json`.
