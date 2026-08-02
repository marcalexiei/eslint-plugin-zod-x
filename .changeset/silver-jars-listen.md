---
'@eslint-zod/utils': minor
---

feat: add `getZodChainedMethodNames(meta)`

The methods chained onto a schema, factory removed — `meta.methods` includes it
for a namespace schema but not for a named import, so `methods.includes('safe')`
also matches `import { number as safe }`.

Also fixes rule-builder crashes on `z.coerce['boolean']()`, `z.string().refine()`
and `z.literal()`; restores `prefer-nullish`'s guard against autofixing
`optional.foo(nullable(1))`; and makes `ZOD_IMMUTABLE_SCHEMA_TYPES` spread
`ZOD_STRING_FORMAT_NAMES`, which had drifted (`mac` was missing).
