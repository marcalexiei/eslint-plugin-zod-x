---
'@eslint-zod/utils': minor
---

feat: add `no-coerce-boolean` rule builder

New `@eslint-zod/utils/rule-builders/no-coerce-boolean` export exposing `buildNoCoerceBooleanCreate(scope)`, which flags `z.coerce.boolean()` and suggests `z.stringbool()`.
