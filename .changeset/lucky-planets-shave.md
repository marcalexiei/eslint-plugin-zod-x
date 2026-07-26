---
'@eslint-zod/utils': minor
---

feat: add `canonicalizeZodConstraintName` and `getZodCheckDescriptor`

One source of truth for what a Zod check is called and what it means, so rules
no longer keep private spelling tables. Also adds `ZOD_STRING_FORMAT_METHODS`.
