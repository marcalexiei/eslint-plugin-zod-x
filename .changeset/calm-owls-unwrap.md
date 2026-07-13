---
'@eslint-zod/utils': minor
---

feat: add `no-unnecessary-readonly` rule builder

New `@eslint-zod/utils/rule-builders/no-unnecessary-readonly` export:

`buildNoUnnecessaryReadonlyCreate(scope)` detects the chained `.readonly()` (`zod`) and the `z.readonly(...)` wrapper (`zod/mini`) with the same logic.

The package root also gains `buildZodWrapperUnwrapFix` (replace a single-argument wrapper call with its argument) and `ZOD_IMMUTABLE_SCHEMA_TYPES`
(schema factories whose output is already immutable).
