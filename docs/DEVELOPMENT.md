# Development

## Run locally

Use Node.js 22.11 or later and Yarn Classic (v1). Set up Android Studio, the Android SDK, and JDK 17 for Android; use macOS with Xcode and CocoaPods for iOS.

1. Run `yarn install`. For iOS, also run `yarn pod-install`.
2. Copy [`.env.example`](../.env.example) to `.env`. Set `BASE_URL` to the running SARA backend, including `/api`: use `http://localhost:3000/api` for the iOS simulator or `http://10.0.2.2:3000/api` for the Android emulator. On a physical device, use a reachable host address and check the server bind address and firewall. Keep `.env` local.
3. Start Metro with `yarn start`, then run `yarn android` or `yarn ios` in another terminal.

Real OTP delivery requires `RESEND_API_KEY` and `RESEND_FROM_EMAIL` on the **backend**. Use a verified sending domain for real recipients; the default Resend sender restricts delivery. Never put those values in the mobile `.env`. After adding the secure-storage dependency, rebuild both native apps before testing sign-in, relaunch, and sign-out.

## Change the API URL without a release

In the app's Firebase project, publish a Remote Config String parameter named `base_url`. Set it to an HTTPS URL, with an optional API path but no credentials, query string, or fragment.

Debug builds prefer a configured `BASE_URL`. Otherwise, the app checks Remote Config when it first needs the backend after a full restart. Firebase may reuse results for five minutes. A failed fetch can still use a previously activated URL; without a valid activated value, the app uses `BASE_URL`. Release builds require HTTPS. The selected URL stays fixed until the app restarts, and saved sessions are restored only against the backend that issued them.

## Verify a change

```bash
yarn test --runInBand path/to/file.test.tsx  # Run one test file while iterating
sh scripts/verify.sh                       # Run the same gate as PR Checks
```

Use [TestAppWrapper](../src/tests/TestAppWrapper.tsx) when a component needs app providers. Jest uses native-module mocks; use a simulator or device to verify behavior that depends on native modules. The [PR checks workflow](../.github/workflows/pr-checks.yml) runs lint and tests.

After adding or renaming a bundled font, run `npx react-native-asset` and rebuild the native app. Reloading Metro alone won't update the bundled files.
