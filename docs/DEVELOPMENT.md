# Development

## Run locally

Use Node.js 22.11 or later and Yarn Classic (v1). Set up Android Studio, the Android SDK, and JDK 17 for Android; use macOS with Xcode and CocoaPods for iOS.

1. Run `yarn install`. For iOS, also run `yarn pod-install`.
2. Copy [`.env.example`](../.env.example) to `.env`. Set `BASE_URL` to the fallback backend URL (rename `API_URL` in existing `.env` files). The example uses JSONPlaceholder for the sample user API; it is not a SARA backend. Keep `.env` local and document new variables in `.env.example`.
3. Start Metro with `yarn start`, then run `yarn android` or `yarn ios` in another terminal.

## Change the API URL without a release

In the app's Firebase project, publish a Remote Config String parameter named `base_url`. Set it to an HTTPS URL, with an optional API path but no credentials, query string, or fragment.

The app checks Remote Config before its first API request after a full restart. Firebase may reuse results for five minutes. A failed fetch can still use a previously activated URL; without a valid activated value, the app uses `BASE_URL`. The selected URL stays fixed until the app restarts to keep React Query data on one backend per session.

## Verify a change

```bash
yarn test --runInBand path/to/file.test.tsx  # Run one test file while iterating
sh scripts/verify.sh                       # Run the same gate as PR Checks
```

Use [TestAppWrapper](../src/tests/TestAppWrapper.tsx) when a component needs app providers. Jest uses native-module mocks; use a simulator or device to verify behavior that depends on native modules. The [PR checks workflow](../.github/workflows/pr-checks.yml) runs lint and tests.

After adding or renaming a bundled font, run `npx react-native-asset` and rebuild the native app. Reloading Metro alone won't update the bundled files.
