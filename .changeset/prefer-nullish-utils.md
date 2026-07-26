---
'@eslint-zod/utils': minor
---

feat: add `prefer-nullish` rule builder

New `@eslint-zod/utils/rule-builders/prefer-nullish` export: `buildPreferNullishCreate(scope)` detects the redundant optional + nullable combination across both API styles — adjacent chained methods (`zod`) and directly nested wrapper calls (`zod/mini`) — and autofixes it to `nullish`.
