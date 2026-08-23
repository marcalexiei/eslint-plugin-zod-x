---
'eslint-plugin-zod-mini': minor
---

feat: add `no-native-enum` and `no-promise-schema` rules

Flag the deprecated `z.nativeEnum()` (autofixed to `z.enum()` for namespace calls) and `z.promise()`. Both enabled in `recommended`.
