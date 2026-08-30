---
'@eslint-zod/utils': minor
---

feat: add the `prefer-top-level-factory` rule pattern

`buildPreferTopLevelFactoryCreate(options)` rewrites a deprecated method chained on a factory into the top-level factory that replaces it (`z.string().uuid()` → `z.uuid()`), keeping the methods in between.
