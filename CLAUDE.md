# CLAUDE.md

## Repository overview

pnpm monorepo containing two ESLint plugins and a shared utilities package for [Zod](https://zod.dev) v4.

| Package                  | Directory                         | Published |
| ------------------------ | --------------------------------- | --------- |
| `eslint-plugin-zod`      | `plugins/eslint-plugin-zod/`      | yes       |
| `eslint-plugin-zod-mini` | `plugins/eslint-plugin-zod-mini/` | yes       |
| `@eslint-zod/utils`      | `packages/utils/`                 | yes       |

`@eslint-zod/utils` is a dependency of each plugin — consumers do not need to install it directly.

## Common commands

```bash
# from repo root
pnpm build          # build all packages
pnpm test           # run all test suites
pnpm typecheck      # tsc -b (project references, no emit)
pnpm lint           # lint:js + lint:docs + lint:knip
pnpm format         # prettier --write

# per-plugin (run from plugin directory or with --filter)
pnpm build:docs     # rebuild plugin + regenerate rule docs
pnpm lint:docs      # check rule docs are up to date
```

## Architecture

### Import source scoping

Each plugin is scoped to its own import source via `ZodImportAllowedSource` (`'zod'` or `'zod-mini'`). This type lives in `packages/utils/src/zod-import-scope.ts` alongside the `ZodImportScope` class and the two pre-built instances `zodImportScope` and `zodMiniImportScope`. There is no `'all'` union — rules in `eslint-plugin-zod` never fire on `zod/mini` imports and vice versa. Each rule guards itself with `scope.isAllowed(sourceValue)` at the top of its visitor.

### Shared utilities (`@eslint-zod/utils`)

`@eslint-zod/utils` exposes two groups of export paths:

- `@eslint-zod/utils` (`packages/utils/src/`) — AST parsing, import tracking, traversal, and fixer helpers
- `@eslint-zod/utils/rule-builders/<rule-name>` (`packages/utils/src/rule-builders/`) — one export per shared rule builder; the file name matches the rule name (e.g. `consistent-import.ts` → `@eslint-zod/utils/rule-builders/consistent-import`)

Available rule builder exports: `consistent-import`, `consistent-import-source`, `consistent-object-schema-type`, `consistent-schema-output-type-style`, `consistent-schema-var-name`, `no-any-schema`, `no-empty-custom-schema`, `no-throw-in-refine`, `no-transform-in-record-key`, `no-unknown-schema`, `prefer-enum-over-literal-union`, `require-brand-type-parameter`, `require-error-message`, `schema-error-property-style`.

`IMPORT_SYNTAXES` and `ImportSyntax` are exported from `@eslint-zod/utils/rule-builders/consistent-import` (not from the root).

AST helpers exported from `@eslint-zod/utils`:

- `createZodSchemaImportTrack()` — tracks namespace and named imports; returns an object with `isZodNamespace`, `getNamedImportOriginal`, `collectZodChainMethods`, and listener hooks
- `detectZodSchemaRootNode()` — finds the outermost Zod call expression in a chain
- `buildZodChainRemoveMethodFix` / `buildZodChainReplacementFix` — fixer helpers
- `zodImportScope` / `zodMiniImportScope` — pre-built `ZodImportScope` instances; use `scope.isAllowed(source)` to check whether a source belongs to the plugin's scope
- `ZOD_NON_SCHEMA_PRODUCING_METHODS` — array of method names that do not return a schema (parse, codec, error formatters)
- `ZOD_MUTATING_CHECK_NAMES` — array of Zod check names that mutate the validated value (`trim`, `toLowerCase`, `toUpperCase`, `normalize`, `overwrite`); used in `zod` as chained methods and in `zod-mini` as standalone `.check(...)` arguments

Rule metadata (name, `meta`, `defaultOptions`) lives entirely per-plugin. When a rule's `create` logic is identical across plugins and differs only by import scope, extract a `build*Create(scope)` factory into `packages/utils/src/rule-builders/<rule-name>.ts`, add it to the `package.json` exports map, and import it in each plugin from `@eslint-zod/utils/rule-builders/<rule-name>`.

### TypeScript resolution

Each package has a `@eslint-zod/source` custom export condition pointing to its `.ts` source. `tsconfig.base.json` sets `customConditions: ["@eslint-zod/source"]`, so any tool that creates a TypeScript program from a tsconfig that extends the base (IDE language server, `@typescript-eslint/parser`) resolves `@eslint-zod/utils` to its `.ts` source without a prior build.

**Two tsconfigs per package/plugin:**

- `tsconfig.json` — used by `tsc -b`. Has `composite: true`, `outDir`, and `references` to other workspace packages for correct incremental build ordering.
- `tsconfig.eslint.json` — used by `eslint.config.js` (`parserOptions.project`). Has no `composite`, no `references`, and no `outDir`. Without project references, `@typescript-eslint/parser` resolves cross-package imports via `customConditions` → source, so type errors in `@eslint-zod/utils` propagate live to plugin callers in both the CLI and the IDE ESLint extension.

## zod vs zod/mini API differences

This is the most important thing to know when working on `eslint-plugin-zod-mini` rules.

**`zod` (full)** — validation methods are chained:

```ts
z.string().min(1).max(10).optional().describe('desc').meta({ description: 'desc' });
```

**`zod/mini`** — validation methods are standalone `$ZodCheck` functions passed to `.check()`:

```ts
z.string().check(z.min(1), z.max(10));
z.optional(z.string());
z.string().check(z.refine(() => true));
z.string().check(z.describe('desc')); // z.describe is a standalone call
z.string().check(z.meta({ description: 'desc' }));
```

Methods that ARE chained in `zod/mini`: `check()`, `brand()`, `parse()`, `safeParse()`, `parseAsync()`, `safeParseAsync()`.

### Consequence for rule authoring

Rules that look for chained methods (via `tracker.collectZodChainMethods`) work correctly in both plugins because `detectZodSchemaRootNode` identifies the outermost call — including calls in argument position (e.g. `z.refine(fn)` inside `.check(z.refine(fn))` is the root of its own expression).

The exception is `prefer-meta` in `eslint-plugin-zod-mini`: since `z.describe()` is not a chain method, detection uses direct namespace/import tracking (`isZodNamespace`, `getNamedImportOriginal`) instead of `tracker.collectZodChainMethods`.

## Shared rules between plugins

Several rules exist in both `eslint-plugin-zod` and `eslint-plugin-zod-mini` with the same name and intent but different API examples (see the API differences section above). When updating a rule that exists in both plugins, keep the counterpart in sync:

- **Docs** (`docs/rules/<rule-name>.md`): mirror structure and content, but adapt all code examples to the correct import source (`zod` vs `zod/mini`) and API style (chained methods vs standalone `$ZodCheck` functions passed to `.check()`).
- **Specs** (`src/rules/<rule-name>.spec.ts`): mirror the test cases, but again adapt import sources and API. Valid/invalid cases should cover the same scenarios in both plugins.

Rules that exist in both plugins: `consistent-import`, `consistent-import-source`, `consistent-object-schema-type`, `consistent-schema-output-type-style`, `consistent-schema-var-name`, `no-any-schema`, `no-empty-custom-schema`, `no-throw-in-refine`, `no-unknown-schema`, `prefer-enum-over-literal-union`, `prefer-meta`, `require-brand-type-parameter`, `require-error-message`, `schema-error-property-style`.

## Quality expectations

Every change must be properly tested and documented:

- Add or update specs to cover the new or modified behavior
- Update rule docs (`docs/rules/*.md`) when rule behavior changes; run `pnpm build:docs` from the plugin directory afterward
- Update package READMEs when public API changes
- Update this file when architecture, utilities, or conventions change

## Adding a new rule

1. Create `src/rules/<rule-name>.ts` and `src/rules/<rule-name>.spec.ts` in the relevant plugin.
2. Export the rule from `src/index.ts` and add it to the plugin's `rules` object.
3. If it belongs in the `recommended` config, add it there too.
4. Run `pnpm build:docs` from the plugin directory — this creates the rule doc stub and updates the README table.
5. Fill in the doc at `docs/rules/<rule-name>.md`.

## Docs generation

`eslint-doc-generator` is configured per-plugin (`.eslint-doc-generatorrc.js` in each plugin directory). It does not traverse past `package.json` boundaries, so a root-level config alone is not sufficient. The root README is a hand-maintained monorepo overview — it has no auto-generated sections.

## Knip

Two intentional suppressions in `knip.config.ts`:

- `ignoreBinaries: [/^eslint@/]` — the CI matrix runs `eslint@${{ matrix.eslint }}` to test multiple ESLint versions; the template syntax confuses knip.
- `ignoreDependencies: ['eslint']` per plugin — `eslint` is an optional peer referenced only for `satisfies` type checks in `src/index.ts`, not a real devDependency.
