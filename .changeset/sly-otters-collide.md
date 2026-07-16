---
'@eslint-zod/utils': minor
---

feat: add `no-conflicting-checks` rule builder and `getZodSchemaBaseType`

New `@eslint-zod/utils/rule-builders/no-conflicting-checks` export:

`buildNoConflictingChecksCreate(scope)` analyzes a schema's checks (via `collectZodSchemaConstraints`, both API styles) for impossible, redundant/confusing, and type-inapplicable combinations. The module also exports the `NoConflictingChecksOptions` and `NoConflictingChecksMessageIds` contracts.

The package root gains `getZodSchemaBaseType` (schema factory name → base type category) and `ZOD_STRING_FORMAT_NAMES` (the top-level string-format factory names).
