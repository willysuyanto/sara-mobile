# AI Coding Harness

Start with the repository's [AGENTS.md](../AGENTS.md). It defines project conventions; the scoped guides for [theme](../src/theme/AGENTS.md) and [tests](../src/tests/AGENTS.md) add rules for those directories. This workflow works with any coding assistant that can read the repo and run shell commands.

## Before editing

1. Check `git status --short`. Read the relevant implementation, callers, and tests. Preserve existing changes; if they overlap and you cannot safely work around them, ask before editing.
2. Identify the requested behavior, what must stay unchanged, and the smallest check that would catch a regression. Ask only when missing information blocks a safe change.
3. Keep the change focused. If delegating, give each writer a separate scope and a focused check. Review every writer's diff before running the final gate.

Use local fixtures or mocks by default. Keep credentials and `.env` values out of patches, logs, and handoffs.

## Verify

Use the smallest relevant check while iterating, then run the same gate as [PR Checks](../.github/workflows/pr-checks.yml) from the repository root:

```sh
sh scripts/verify.sh
```

The gate attempts lint, the full Jest suite, and Markdown formatting for `docs/`, even when one fails. A nonzero exit means the gate did not pass. Run `git diff --check` and `git diff --cached --check`, then inspect the final changes, including new files. Do not weaken checks or fix unrelated failures to make the gate green. Call a failure pre-existing only when you have baseline evidence.

Beyond the gate, pick evidence that matches the change:

- **UI, navigation, theme, or translations:** Test the affected interaction. For visible layout changes, check the affected screen on a simulator or device and note the themes and locales checked.
- **API, auth, or forms:** Test affected success and failure paths and validate boundary data. Mocked responses do not verify a live backend.
- **Native integrations or assets:** Build and exercise the behavior on each affected platform. Jest mocks do not verify native behavior.
- **Documentation:** Check new or changed relative links. For commands you cannot run, state what remains unverified.

## Hand off

Summarize what changed, which commands passed or failed, and what you could not verify. For failures, include the affected check and the first actionable error. Do not commit, push, or change shared environments unless the user asks.
