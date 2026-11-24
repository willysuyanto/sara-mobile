# Architecture

SARA Mobile is a React Native client for Android and iOS. This repository does not contain the backend.

## App startup and navigation

[`App.tsx`](../src/App.tsx) provides gesture handling, TanStack Query, and the theme, and initializes i18next. The theme provider uses MMKV to persist the selected theme. On iOS, [`AppHeadlessCheck.tsx`](../src/AppHeadlessCheck.tsx) skips rendering during a background-only messaging launch.

[`Application.tsx`](../src/navigation/Application.tsx) registers the splash, landing, login, register, forgot-password, and dashboard screens. When adding a route, update [`paths.ts`](../src/navigation/paths.ts), [`types.ts`](../src/navigation/types.ts), and the navigator together.

## Data and forms

- [`src/hooks/domain`](../src/hooks/domain) groups Zod schemas, service functions, and TanStack Query hooks by domain. The [sample user service](../src/hooks/domain/user/userService.ts) validates its HTTP response with Zod.
- [`src/services/instance.ts`](../src/services/instance.ts) resolves the API base URL from Firebase Remote Config (`base_url`) or `BASE_URL` and shares one `ky` client per app session. The [auth service](../src/hooks/domain/auth/authService.ts) currently returns stub sessions for login and registration; it does not call a backend.
- [`useZodForm`](../src/hooks/form/useZodForm.ts) connects React Hook Form with Zod. [`FormInput`](../src/components/molecules/FormInput/FormInput.tsx) connects a field to the shared input component and displays field errors.

## UI and localization

Screens live in [`src/screens`](../src/screens). Reusable UI lives in [`src/components`](../src/components); use the [design system](../DESIGN.md) for theme tokens and typography.

Add user-facing strings to both [`en-EN.json`](../src/translations/en-EN.json) and [`id-ID.json`](../src/translations/id-ID.json) under `saramobile`. Indonesian (`id-ID`) is the default and fallback locale.
