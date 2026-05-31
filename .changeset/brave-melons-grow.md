---
'@eslint-zod/utils': minor
---

feat: add `no-duplicate-schema-methods` rule builder

Exposes `buildNoDuplicateSchemaMethodsCreate(scope, excludedMethods)` from `@eslint-zod/utils/rule-builders/no-duplicate-schema-methods`.
The builder reports a method called more than once in a single schema chain, skipping any method name passed in `excludedMethods`.
