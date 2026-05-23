# @eslint-zod/utils

[![CI Status][CIBadge]][CIURL]
[![Code style: prettier][CodeStyleBadge]][CodeStyleURL]
[![Lint: eslint][lintBadge]][lintURL]
[![Open on npmx][npmVersionBadge]][npmVersionURL]
[![Open issue tracker][issuesBadge]][issuesURL]

[CIBadge]: https://img.shields.io/github/actions/workflow/status/marcalexiei/eslint-zod/ci.yml?style=for-the-badge&logo=github&event=push&label=CI
[CIURL]: https://github.com/marcalexiei/eslint-zod/actions/workflows/CI.yml/badge.svg
[CodeStyleBadge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=prettier
[CodeStyleURL]: https://prettier.io
[lintBadge]: https://img.shields.io/badge/lint-eslint-3A33D1?logo=eslint&style=for-the-badge
[lintURL]: https://eslint.org
[npmVersionBadge]: https://img.shields.io/npm/v/@eslint-zod/utils.svg?style=for-the-badge&logo=npm
[npmVersionURL]: https://npmx.dev/package/@eslint-zod/utils
[issuesBadge]: https://img.shields.io/github/issues/marcalexiei/eslint-zod.svg?style=for-the-badge
[issuesURL]: https://github.com/marcalexiei/eslint-zod/issues

Shared AST utilities for

- `eslint-plugin-zod`
- `eslint-plugin-zod-mini`
- `eslint-plugin-zod-core`

> [!NOTE]
> This package is a dependency of all previously listed packages, so you do not need to install it directly.

## API

Every export carries JSDoc with usage notes — refer to the linked source files (or hover in your editor) for the full description and examples. This README only lists what's available.

### Root exports — `@eslint-zod/utils`

AST parsing, import tracking, traversal, and fixer helpers.

- `createZodSchemaImportTrack(scope)` — per-rule factory for tracking namespace and named imports
- `detectZodSchemaRootNode(node, namespaces, named)` — find the outermost Zod call in a chain
- `isZodNumberSchemaCallExpression(node, namespaces, named)` — detect `z.number()…` chains
- `findParentSchemaMatchingCondition(node, options)` — search up the AST for a matching ancestor schema call
- `buildZodChainRemoveMethodFix(opts)` / `buildZodChainReplacementFix(opts)` — fixer helpers
- `ZodImportScope` (class) and the pre-built instances `zodImportScope`, `zodMiniImportScope`, `zodCoreImportScope`
- `ZOD_MUTATING_CHECK_NAMES` — array of Zod check names that mutate the validated value
- `ZOD_NON_SCHEMA_PRODUCING_METHODS` — array of Zod method names that do not return a schema

### Shared rule builders — `@eslint-zod/utils/rule-builders/<rule-name>`

Each rule shared between `eslint-plugin-zod` and `eslint-plugin-zod-mini` exposes its `create(...)` factory from a dedicated subpath. Plugins keep rule metadata local and reuse the runtime logic.

- `buildConsistentImportCreate(scope)`
- `buildConsistentImportSourceCreate(scope)`
- `buildConsistentObjectSchemaTypeCreate(scope)`
- `buildConsistentSchemaOutputTypeStyleCreate(scope)`
- `buildConsistentSchemaVarNameCreate(scope)`
- `buildNoAnySchemaCreate(scope)`
- `buildNoEmptyCustomSchemaCreate(scope)`
- `buildNoThrowInRefineCreate(scope)`
- `buildNoTransformInRecordKeyCreate(scope, options)`
- `buildNoUnknownSchemaCreate(scope)`
- `buildPreferEnumOverLiteralUnionCreate(scope)`
- `buildRequireBrandTypeParameterCreate(scope)`
- `buildRequireErrorMessageCreate(scope)`
- `buildSchemaErrorPropertyStyleCreate(scope)`

The `consistent-import` builder additionally re-exports the import-syntax helpers used by its fixer: `IMPORT_SYNTAXES`, `ImportSyntax`, `isGroupFirstImportKindValidForSyntax`, `shouldIdentifierBeRenamed`, `getNamespaceAliasNameFrom`.
