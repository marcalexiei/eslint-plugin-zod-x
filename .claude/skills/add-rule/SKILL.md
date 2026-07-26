---
name: add-rule
description: End-to-end checklist for adding a new ESLint rule to this monorepo — shared rule builder, per-plugin wiring, specs, docs, changesets, and verification. Use whenever creating a new rule (shared across zod/zod-mini or plugin-only) or promoting an existing rule to a shared builder.
---

# Adding a rule

Follow this file inventory exactly — the `index.spec.ts` consistency specs fail the build if any wiring step is skipped. Use PR #370 (`no-unnecessary-readonly`, commit `5547b24`) as the reference implementation for a shared rule.

## 0. Decide the shape

- **Shared rule** (same logic in `zod` + `zod-mini`, differs only by import scope): put `create` logic in a rule builder in `@eslint-zod/utils`. This is the default for schema-authoring rules.
- **Plugin-only rule**: skip the utils steps; write `create` directly in the plugin's rule file.
- **Same shape as an existing rule, different names?** If the new rule differs from one or more existing rules only in the names it mentions (a deprecated method, a factory to prefer), use or add a **rule pattern** in `packages/utils/src/rule-patterns/` — see step 1b. This applies even when every caller lives in one plugin.
- If part of the behavior is genuinely plugin-specific, the builder exports a typed contract (options interface / function signature) that each plugin implements — never fork the shared logic. First try to eliminate the difference via `collectZodSchemaConstraints`.

## 1. Rule builder (shared rules only)

1. `packages/utils/src/rule-builders/<rule-name>.ts` — export `build<PascalCaseRuleName>Create(scope: ZodImportScope)`. Guard the visitor with `scope.isAllowed(sourceValue)`. Get the tracker from `scope.createTracker()` inside `create`, and prefer `collectZodSchemaConstraints` so one builder handles both chained (`zod`) and `.check(...)` (`zod-mini`) styles.
2. **No exports-map entry to add** — `./rule-builders/*` is a single wildcard entry, so dropping the file in is enough. The flip side: everything in that directory is public, so a helper that is not a builder belongs at `src/` root instead.
3. If the rule reasons about check names, canonicalize through `canonicalizeZodConstraintName(constraint, baseType)` rather than writing a spelling table — chained names are type-dependent and the shared vocabulary already covers them. Add missing entries to `packages/utils/src/zod-check-vocabulary.ts`.
4. New generic helpers (fixers, constant lists) go in their own `packages/utils/src/<helper>.ts` with a co-located `.spec.ts`, re-exported from `packages/utils/src/index.ts`.

## 1b. Rule pattern (when the shape recurs)

`packages/utils/src/rule-patterns/<pattern-name>.ts` — export `build<PascalCasePatternName>Create(options)` taking a single options object (`scope` plus the names the callers differ in) and its exported `<PascalCase>Options` contract. Same wildcard subpath rule as builders: no exports-map entry, and the directory is public.

Name the file for the shape, not for a rule (`deprecated-schema-method`, not `no-schema-with-is-optional`). Existing patterns: `deprecated-schema-property`, `deprecated-schema-method`, `prefer-dedicated-factory`.

Don't extract a pattern when the rules differ in their _fix strategy_ rather than their names — two implementations behind one switch dedupes nothing.

## 2. Per-plugin rule file

`plugins/eslint-plugin-<zod|zod-mini>/src/rules/<rule-name>.ts` — metadata only, ~20 lines:

```ts
import { zodImportScope } from '@eslint-zod/utils';
import { buildXxxCreate } from '@eslint-zod/utils/rule-builders/<rule-name>';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const xxx = createZodPluginRule({
  name: '<rule-name>',
  meta: { type, fixable, docs: { description }, messages, schema: [] },
  defaultOptions: [],
  create: buildXxxCreate(zodImportScope),
});
```

Per plugin: `createZodPluginRule`/`zodImportScope` (zod), `createZodMiniPluginRule`/`zodMiniImportScope` (mini), `createZodCorePluginRule`/`zodCoreImportScope` (core). Adapt `docs.description` and messages to the plugin's API spelling (e.g. `` `.readonly()` `` vs `` `z.readonly()` ``).

## 3. Specs

`src/rules/<rule-name>.spec.ts` next to the rule. Conventions: `RuleTester` from `@typescript-eslint/rule-tester`, `dedent` for code, every case has a `name`, fixable rules assert `output`. Always include a "not a zod import" valid case. Mirror the same scenarios across plugins, translating API style (invoke the **sync-zod-mini** skill for the translation table). Specs must use only the plugin's own API style — never mix.

## 4. Plugin index wiring

In each plugin's `src/index.ts`: add the import (alphabetical), add to the `rules` object, and add to `recommendedConfig.rules` if it belongs there. `index.spec.ts` enforces: registered rules === files in `src/rules`, doc file per rule, recommended references only registered non-deprecated rules.

## 5. Docs

From each plugin directory run `pnpm build:docs` (builds first, then `eslint-doc-generator` creates the doc stub and updates the README table). Then fill `docs/rules/<rule-name>.md` following the section order in CLAUDE.md (“Rule doc layout”), and re-run `pnpm build:docs` after editing. Keep zod/zod-mini doc structure mirrored; adapt every example's import source and API style.

## 6. Bookkeeping

- Changesets (`minor`), one file per package: each plugin + `@eslint-zod/utils` when a builder export was added. `feat:` prefix; plugin changesets name the targeted methods, the utils changeset describes the new export.
- Update CLAUDE.md's AST-helper list if `@eslint-zod/utils` gained root exports (builder/pattern exports and shared-rule membership are derived from the filesystem, not listed in CLAUDE.md).
- Update `packages/utils/README.md` for **any** new `@eslint-zod/utils` export — a rule-builder or rule-pattern subpath (add it to the matching list), a root helper/constant, or an exported contract type. This README enumerates every public export by hand and is not verified by any check, so it silently rots if skipped.

## 7. Verify (from repo root)

```bash
pnpm build && pnpm test && pnpm typecheck && pnpm lint
```

`pnpm lint` includes `lint:docs` (fails if docs are stale) and knip (fails on unused/unexported code — a builder exported but not consumed by every intended plugin will surface here).
