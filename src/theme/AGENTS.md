# AGENTS.md — Theme & design tokens

Scope: everything under `src/theme/`. Read this before touching colors, spacing, radius, or typography. The user-facing reference is [`DESIGN.md`](../../DESIGN.md).

## Two layers

1. **Design tokens** (`src/theme/tokens/`) — the source of truth, ported by hand from the Figma exports. No build step.
2. **Theme config** (`src/theme/_config.ts`) — wires tokens into the template's `ThemeConfiguration`, which `ThemeProvider` flattens into the object returned by `useTheme()`.

## Token files

| File                   | Exports                                     | Notes                                                                                                    |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `tokens/primitives.ts` | `primitiveColors`                           | Raw palette (`neutral*`, `violet*`, `amber*`, `red*`, `green*`). Never use these directly in components. |
| `tokens/semantic.ts`   | `semanticColorsLight`, `semanticColorsDark` | Semantic aliases of primitives. **Dark must mirror every light key.**                                    |
| `tokens/scales.ts`     | `spacing`, `radius`                         | Spacing = px from Figma; radius = **integers only**.                                                     |
| `tokens/typography.ts` | `textStyles`, `TypographyVariant`           | Text styles (all Inter). Consume via the `Text` atom.                                                    |
| `tokens/index.ts`      | —                                           | Barrel; import from `@/theme/tokens`.                                                                    |

Source JSON: `tokens/tokens.tokens.json` (colors/spacing/radius) and `tokens/textStyles.json` (Figma text styles). These are references only — nothing reads them at runtime.

## Config wiring (`_config.ts`)

- `colorsLight = { ...primitiveColors, ...semanticColorsLight, skeleton: primitiveColors.neutral200 }`.
- `colorsDark = { ...semanticColorsDark, skeleton: primitiveColors.neutral800 }`.
- `gutters = [...spacing, 32, 40, 80]` (extra sizes retained from the template).
- `borders.radius = radius`; `borders.widths = [1, 2]`.
- Variants: `default` (light) and `dark` only. `Variant` is a `const enum`.

`generateConfig()` (`ThemeProvider/generateConfig.ts`) deep-merges the selected variant on top of the default config.

## Consuming the theme

```tsx
const {
  colors,
  gutters,
  borders,
  fonts,
  backgrounds,
  components,
  variant,
  navigationTheme,
} = useTheme();
```

`useTheme()` throws outside `ThemeProvider`. Components use **semantic** color keys (`colors.textPrimary`, `colors.surfaceCard`, …) — not primitive names.

## How to add / change a token

1. New raw color → add a primitive in `tokens/primitives.ts`.
2. Expose it → add a semantic alias in `tokens/semantic.ts` for **both** light and dark.
3. Spacing/radius → add to the relevant array in `tokens/scales.ts` (radius must stay integer).
4. Typography → edit `tokens/typography.ts`, then use the `Text` atom (`@/components/atoms/Text`) with the new `variant`.
5. Verify with `yarn lint` and `yarn test`.

Notes:

- `skeleton` is a theme-only key added in `_config.ts` (not in `semantic.ts`) — keep it in both `colorsLight` and `colorsDark`.
- Enum-like keys (e.g. a new `TypographyVariant`) come from the `const` objects; don't hand-write unions elsewhere.

## The `Text` atom

`src/components/atoms/Text/Text.tsx` renders themed text: `variant` (default `bodyPrimary`) sets the text style, `color` (default `textPrimary`) accepts either a semantic color key or any raw color string. Prefer it over React Native `Text` so typography and color stay consistent.

## Fonts

- Files live in `src/theme/assets/fonts/` and are declared in `react-native.config.js`.
- The app ships variable **Inter** (`Inter.ttf`, `Inter-Italic.ttf`); the ramp uses weights 400–800.
- After adding/renaming fonts, run `npx react-native-asset` and do a **full native rebuild** (Metro reload is not enough).

## Conventions & guardrails

- Use `type`, never `interface` (`@typescript-eslint/consistent-type-definitions`).
- Object keys are alphabetical (perfectionist auto-fix): run `./node_modules/.bin/eslint . --fix`.
- `no-magic-numbers` is **disabled** for `**/theme/*.ts` and `**/theme/tokens/*.ts`.
- Token files may carry short doc comments; components should stay self-documenting.

## Gotchas

- The theme variant is persisted in MMKV under the `'theme'` key (`storage.getString('theme')`).
- Forgetting a dark counterpart in `semantic.ts` yields an untested/undefined color in dark mode.
- Radius values must be whole pixels — `borders` only supports integers.
