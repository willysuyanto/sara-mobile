# SARA — Smart Assistant for Responsive Automation

**SARA (Smart Assistant for Responsive Automation)** merupakan aplikasi smart assistant yang dikembangkan untuk membantu pengguna dalam mengelola aktivitas, tugas, dan jadwal sehari-hari melalui interaksi bahasa alami, automation, reminder, dan assistance berbasis aktivitas pengguna.

Repositori ini adalah aplikasi **mobile** SARA yang dibangun menggunakan **React Native** dan **TypeScript**.

---

## 🚀 Fitur Utama

- **Natural Language Interaction** — interaksi bahasa alami untuk mengelola aktivitas, tugas, dan jadwal.
- **Automation** — otomatisasi tugas/aktivitas rutin pengguna.
- **Reminder** — pengingat jadwal dan aktivitas.
- **Activity-based Assistance** — bantuan yang dipersonalisasi berdasarkan aktivitas pengguna.

## 🧰 Tech Stack

| Area | Teknologi |
| --- | --- |
| Framework | [React Native](https://reactnative.dev/) `0.84.0` dengan [React](https://react.dev/) `19.x` |
| Bahasa | [TypeScript](https://www.typescriptlang.org/) `5.x` |
| Navigasi | [React Navigation](https://reactnavigation.org/) (native & stack) |
| Manajemen State / Server State | [TanStack Query](https://tanstack.com/query) `^5.x` |
| HTTP Client | [ky](https://github.com/sindresorhus/ky) `^1.x` |
| Penyimpanan Lokal | [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) `^4.x` |
| Animasi & Gesture | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) `^4.x`, [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) `^2.x`, [react-native-worklets](https://docs.swmansion.com/react-native-worklets/) `^0.x` |
| Internationalization (i18n) | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) |
| Validasi | [zod](https://zod.dev/) `^4.x` |
| Asset & UI | [react-native-svg](https://github.com/software-mansion/react-native-svg) `^15.x`, [react-native-safe-area-context](https://github.com/software-mansion/react-native-safe-area-context), [react-native-screens](https://github.com/software-mansion/react-native-screens) |
| Error Handling | [react-error-boundary](https://github.com/bvaughn/react-error-boundary) |
| Testing | [Jest](https://jestjs.io/) `^30.x` + [Testing Library](https://callstack.github.io/react-native-testing-library/) |
| Linting & Formatting | [ESLint](https://eslint.org/) `9.x`, [Prettier](https://prettier.io/) `3.x` |
| Build Tooling | [Babel](https://babeljs.io/), [Metro](https://reactnative.dev/docs/metro), [react-native-svg-transformer](https://github.com/kristerkari/react-native-svg-transformer) |
| Dev Tools | [Reactotron](https://github.com/infinitered/reactotron) (termasuk plugin MMKV & React Query) |

## 📁 Struktur Proyek

```
SaraMobile/
├── android/                  # Proyek native Android
├── ios/                      # Proyek native iOS
├── src/
│   ├── components/           # Komponen UI yang dapat digunakan kembali
│   ├── hooks/                # Custom hooks
│   ├── navigation/           # Konfigurasi navigasi & path
│   ├── screens/              # Layar / halaman aplikasi
│   ├── services/             # Lapisan komunikasi API (ky instance)
│   ├── tests/                # Utilitas & setup testing
│   ├── theme/                # Theme, warna, font, spacing
│   ├── translations/         # File terjemahan i18next (en-EN, fr-FR)
│   ├── App.tsx               # Komponen root aplikasi
│   └── reactotron.config.ts  # Konfigurasi Reactotron (dev)
├── .env                      # Variabel lingkungan
├── babel.config.js
├── metro.config.js
├── package.json
└── tsconfig.json
```

## ✅ Prasyarat

- **Node.js** `>= 22.11.0`
- **npm** atau **Yarn** (proyek ini dilengkapi `package-lock.json` dan `yarn.lock`)
- **Android**: Android Studio / Android SDK dengan emulator atau perangkat fisik
- **iOS** (macOS only): Xcode, CocoaPods, dan simulator atau perangkat fisik
- **JDK 17+** untuk build Android

## 🛠️ Menjalankan Proyek

### 1. Install Dependencies

```bash
# Dengan npm
npm install

# atau dengan yarn
yarn install
```

Untuk project iOS, jalankan juga instalasi CocoaPods setelah `install`:

```bash
cd ios && pod install && cd ..
# atau lewat script yang tersedia
yarn pod-install
```

### 2. Konfigurasi Variabel Lingkungan

Salin/isi file `.env` pada root proyek:

```env
API_URL=https://jsonplaceholder.typicode.com
```

> `API_URL` adalah base URL dari backend yang akan digunakan oleh `src/services/instance.ts`. Sesuaikan dengan endpoint backend SARA yang sebenarnya.

### 3. Jalankan Metro Bundler

```bash
npm start
# atau
yarn start
```

### 4. Build & Jalankan Aplikasi

Buka terminal terpisah, lalu jalankan:

```bash
# Android
npm run android
# atau
yarn android

# iOS (macOS only)
npm run ios
# atau
yarn ios
```

## 🧪 Testing & Kualitas Kode

```bash
# Menjalankan semua test
yarn test

# Menjalankan test dengan laporan coverage + junit
yarn test:report

# Lint: ESLint rules + Prettier + TypeScript
yarn lint

# Auto-fix lint & format
yarn lint:fix

# Menjalankan masing-masing lint
yarn lint:rules      # ESLint
yarn lint:code-format  # Prettier (check)
yarn lint:type-check   # TypeScript (tsc)
```

## 📜 Scripts

| Script | Deskripsi |
| --- | --- |
| `start` | Menjalankan Metro bundler |
| `android` | Build & run aplikasi di Android |
| `ios` | Build & run aplikasi di iOS |
| `test` | Menjalankan test dengan Jest |
| `test:report` | Menjalankan test dengan coverage & reporter JUnit |
| `lint` | Menjalankan seluruh lint (rules, format, type-check) |
| `lint:rules` | ESLint check |
| `lint:code-format` | Prettier check |
| `lint:type-check` | TypeScript type checking (`tsc`) |
| `lint:fix` | Auto-fix ESLint & Prettier |
| `pod-install` | Menjalankan `npx pod-install` untuk iOS |