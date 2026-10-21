# SARA Mobile — Design System

This document describes the design foundation of the SARA mobile app: where
tokens come from, how they are structured in code, and how to consume them.

## Overview

The design system is organised in three layers:

1. **Source tokens** — W3C DTCG JSON exports from Figma.
2. **Typed token modules** — hand-ported, strongly typed TypeScript (`src/theme/tokens/`).
3. **Theme API** — a runtime theme object consumed via `useTheme()` and the
   `Text` atom.

There is **no build pipeline** (no Style Dictionary). Token JSON is treated as
the source of truth and ported into TypeScript by hand.

## Token Sources

| File | Contents |
| --- | --- |
| `src/theme/tokens/tokens.tokens.json` | Primitive colors, semantic colors, spacing, radius. |
| `src/theme/tokens/textStyles.json` | 24 Figma text styles (typography). |

## Directory Layout

```
src/theme/
├── tokens/
│   ├── primitives.ts        # primitive color ramps
│   ├── semantic.ts          # semantic colors (light + dark)
│   ├── scales.ts            # spacing + radius scales
│   ├── typography.ts        # text styles (Inter ramp)
│   ├── index.ts             # barrel re-export
│   ├── tokens.tokens.json   # Figma source (colors/spacing/radius)
│   └── textStyles.json      # Figma source (typography)
├── _config.ts               # assembles the theme configuration
├── components.ts            # component presets (buttonCircle, …)
├── layout.ts                # static layout helpers
├── theme/types/             # derived theme types
└── index.ts                 # exports useTheme + ThemeProvider
```

## Color System

### Primitive scales

Defined in `src/theme/tokens/primitives.ts` as `primitiveColors`. Anchors come
from `tokens.tokens.json`; the remaining steps are curated to give every ramp a
complete 050→900 (neutral 000→1000) range.

| Scale | Steps |
| --- | --- |
| `neutral` | `000 #ffffff`, `050 #f8f8fa`, `100 #f0f1f5`, `200 #e2e3f0`, `300 #bcbfcc`, `400 #979ba7`, `500 #868899`, `600 #74758b`, `700 #585970`, `800 #3c3d55`, `900 #20213a`, `1000 #000000` |
| `violet` | `050 #f6f5ff` … `500 #7570d8` … `900 #2a2680` |
| `amber` | `050 #fbf7ef` … `500 #c49b54` … `900 #776645` |
| `green` | `050 #edf5f0` … `500 #549679` … `900 #224036` |
| `red` | `050 #fff5f5` … `500 #c87777` … `900 #662f2f` |

> Primitive tokens may be referenced directly **only** inside the theme layer
> (token modules, `_config.ts`). Application code must use semantic tokens.

### Semantic tokens

Defined in `src/theme/tokens/semantic.ts` as `semanticColorsLight` and
`semanticColorsDark`. Each entry aliases a primitive.

| Group | Tokens | Light → Dark alias |
| --- | --- | --- |
| Accent | `accentWarm` | `amber500` → `amber400` |
| Background | `backgroundPrimary`, `backgroundSecondary` | `neutral000` → `neutral1000` / `neutral900` |
| Border | `borderAccent`, `borderControl`, `borderPrimary`, `borderSecondary`, `borderSubtle` | `neutral200` → `neutral700` / `neutral800` |
| Brand | `brandLogo`, `buttonPrimaryBackground` | `violet800` / `violet600` → `violet200` / `violet400` |
| Error | `errorForeground`, `errorForeground2` | `red600` / `red200` → `red400` / `red800` |
| Icon | `iconDisabled`, `iconMuted`, `iconOnPrimary`, `iconSecondary` | `neutral400` / `neutral000` / `neutral600` → paired variants |
| Navigation | `navigationActive`, `primary` | `violet800` / `violet600` → `violet200` / `violet400` |
| Secondary | `secondary2`, `secondaryBackground` | `violet800` / `violet100` → `violet200` / `neutral800` |
| Success | `successBackground`, `successForeground`, `successIcon`, `successSurface` | `green050` / `green600` → `green900` / `green300` |
| Surface | `surfaceAccent`, `surfaceCard`, `surfaceCardHighlight`, `surfaceNeutral`, `surfaceOverlay`, `surfacePrimary`, `surfaceSecondary`, `surfaceSubtle`, `surfaceTertiary` | `violet*` / `neutral*` → `neutral*` / `violet*` |
| System | `systemBlack`, `systemIndicator`, `systemOutline` | `neutral1000` / `neutral900` / `neutral600` → inverted |
| Text | `textAccent`, `textDisabled`, `textDisabledMuted`, `textHelper`, `textMuted`, `textOn*`, `textPrimary`, `textSecondary`, `textStrong`, `textSubtle`, `textSupporting`, `textTertiary` | `neutral600`–`neutral900` / `violet800` → paired variants |
| Warning | `warningBackground`, `warningBorder`, `warningForeground` | `amber050` / `amber200` / `amber800` → `amber900` / `amber700` / `amber200` |

The `skeleton` token is defined alongside these in `_config.ts`
(`neutral200` light / `neutral800` dark).

### Consuming colors

```tsx
const { colors } = useTheme();

<View style={{ backgroundColor: colors.surfaceNeutral }} />
<IconByVariant stroke={colors.primary} />
```

Prefer the semantic key that describes intent (`textSecondary`) over a
primitive (`neutral600`).

## Spacing

Defined in `src/theme/tokens/scales.ts` as `spacing`:

```
1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27
```

`_config.ts` appends `32, 40, 80` to form `gutters`, which the theme exposes as
`gutters.marginTop_16`, `gutters.paddingHorizontal_32`, `gutters.gap_16`, etc.

```tsx
<View style={[gutters.padding_16, gutters.marginTop_40]} />
```

## Radius & Borders

`radius` (integers only — the numeric radius generator requires whole pixels):

```
1, 3, 4, 5, 6, 8, 10, 12, 13, 16, 18, 19, 100, 125
```

Border widths: `[1, 2]`. Access via `borders.radius_16`, `borders.width_1`, …
and component presets such as `components.buttonCircle`.

## Typography

All text uses the **Inter** family. The ramp is derived from
`textStyles.json`, mapped to Inter, rebalanced around `bodyPrimary = 14px`,
and normalised to even font sizes.

| Variant | Size | Weight | Letter spacing |
| --- | --- | --- | --- |
| `accentPrimary` | 28 | 700 | -0.9 |
| `bodyPrimary` | 14 | 400 | 0 |
| `bodySecondary` | 12 | 400 | 0 |
| `captionPrimary` | 10 | 400 | 0 |
| `captionSecondary` | 10 | 400 | 0 |
| `captionSmall` | 8 | 400 | 0 |
| `headingBrand` | 24 | 800 | -0.7 |
| `headingPrimary` | 30 | 700 | -0.8 |
| `headingSecondary` | 28 | 700 | -0.9 |
| `headingTertiary` | 16 | 700 | -0.3 |
| `labelActive` | 10 | 700 | 0 |
| `labelButton` | 14 | 700 | 0 |
| `labelButtonSmall` | 12 | 600 | 0 |
| `labelControl` | 10 | 400 | 0 |
| `labelLink` | 10 | 400 | 0 |
| `labelMuted` | 10 | 500 | -0.3 |
| `labelPrimary` | 16 | 700 | 0 |
| `labelSecondary` | 12 | 600 | 0 |
| `labelStatus` | 10 | 600 | 0 |
| `overlinePrimary` | 10 | 700 | 1.2 |
| `overlineSecondary` | 8 | 700 | 1.6 |
| `overlineSmall` | 8 | 600 | 0.8 |
| `systemSignal` | 12 | 700 | -2 |
| `titleDisabled` | 16 | 600 | 0 |
| `titlePrimary` | 16 | 600 | 0 |
| `titleSecondary` | 20 | 700 | 0 |

Weights map: Regular `400`, Medium `500`, SemiBold `600`, Bold `700`,
ExtraBold `800`. `textCase: ORIGINAL` styles omit casing.

### The `Text` atom

Always render text through the `Text` atom from `@/components/atoms` rather
than React Native's `Text`.

```tsx
import { Text } from '@/components/atoms';

<Text variant="headingPrimary">Welcome</Text>
<Text color="textSecondary" variant="bodyPrimary">Subtitle</Text>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `TypographyVariant` | `bodyPrimary` | Key from `textStyles`. |
| `color` | `keyof Colors \| string` | `textPrimary` | Semantic key, or any raw color string. |
| `style` | RN `TextStyle` | — | Merged last, so it can override the preset. |

All other React Native `TextProps` (`numberOfLines`, `onPress`, `testID`, …)
pass through.

### Font installation

Fonts live in `src/theme/assets/fonts/` and are linked via
`react-native.config.js` (`assets: ['./src/theme/assets/fonts']`):

- `Inter.ttf` — variable Inter, `wght` 100–900 (default 400).
- `Inter-Italic.ttf` — variable Inter Italic.

Both share the family name **`Inter`**, which is the `fontFamily` used by every
text style. After adding or changing fonts, re-link and rebuild (a Metro reload
is not enough):

```bash
npx react-native-asset
cd ios && pod install && cd ..
```

`react-native-asset` writes the fonts into the iOS `Resources` build phase /
`UIAppFonts` and copies them to `android/app/src/main/assets/fonts/`.

> **Weight caveat.** The ramp requests weights `400`–`800`, satisfied by the
> variable `wght` axis. iOS CoreText resolves these from the axis; on Android,
> variable-font weight selection is OS-dependent, so heavier weights may fall
> back to Regular on some devices. If exact Android weights are required, add
> static per-weight files (e.g. `Inter-Medium.ttf`, `Inter-SemiBold.ttf`,
> `Inter-Bold.ttf`, `Inter-ExtraBold.ttf`).

## Component Layer

Reusable UI lives in `src/components`:

- `atoms/` — `AssetByVariant`, `Button`, `IconByVariant`, `Skeleton`, `Text`.
- `molecules/` — e.g. `DefaultError`, `FormInput`, `Input`.
- `templates/` — e.g. `SafeScreen`.

Import from the barrel (`@/components/atoms`); never refactor colour or type
strings into ad-hoc literals — extend the tokens instead.

### The `Input` molecule

`Input` (`src/components/molecules/Input`) is a single-line text field with a
label above it and an optional message below it. Its state is derived
internally (focus tracking + `error`), there is no `state` prop.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | Required; rendered with `labelSecondary`. |
| `size` | `'md' \| 'lg'` | `md` | Field height 44 / 56. |
| `error` | `boolean` | `false` | Error palette + `circle-alert` icon. |
| `errorMessage` | `string` | — | Replaces the helper message while `error` is set. |
| `helperMessage` | `string` | — | Shown when there is no error. |

All other React Native `TextInputProps` pass through. The disabled state uses
the `lock-keyhole` icon and the muted text/icon tokens.

### Icons

Icons come from **Lucide** (`@react-native-vector-icons/lucide`), imported from
the `/static` subpath so no runtime font loading is needed:

```tsx
import { Lucide } from '@react-native-vector-icons/lucide/static';

<Lucide color={colors.textSecondary} name="circle-alert" size={18} />
```

The font (`Lucide.ttf`) is registered in `ios/SaraMobile/Info.plist`
(`UIAppFonts`); Android bundles it through the library's gradle plugin.

## Forms

Forms are handled by `react-hook-form` with a zod schema.

```tsx
const schema = z.object({ email: z.email() });

function Form() {
  const { control, handleSubmit } = useZodForm(schema, {
    defaultValues: { email: '' },
  });

  return (
    <>
      <FormInput control={control} label="Email" name="email" />
      <Button onPress={handleSubmit((data) => save(data.email))} />
    </>
  );
}
```

- `useZodForm` (`src/hooks/form/useZodForm.ts`) is `useForm` + `zodResolver`. It
  validates on every change by default (`mode: 'onChange'`).
- Field values are typed from the schema **input**; `handleSubmit` receives the
  schema **output** (coercions and transforms applied).
- `FormInput` (`src/components/molecules/FormInput`) binds a field to `Input`
  through `useController` and maps the field error to the input's error state.

## Adding or Changing Tokens

1. Update the source JSON (`tokens.tokens.json` / `textStyles.json`).
2. Port the change into the matching module in `src/theme/tokens/`.
3. Re-export anything new from `src/theme/tokens/index.ts` (the barrel is
   alphabetically sorted).
4. Run the checks below.

### Conventions

- Object keys and named imports are kept in alphabetical order
  (`perfectionist/recommended-alphabetical`). Fix with `eslint --fix`.
- `no-magic-numbers` is disabled for `**/theme/*.ts` and
  `**/theme/tokens/*.ts` only.
- Radius values must stay integers (numeric radius generator limitation).

## Verifying Changes

```bash
yarn lint:type-check   # tsc
yarn lint:rules        # eslint
yarn lint:code-format  # prettier --check
yarn lint:fix          # auto-fix eslint + prettier
```
