---
'@eslint-zod/utils': minor
---

feat: export `ZodImportScope`, `detectZodSchemaRootNode` and the tracker types

`ZodImportScope` is the parameter type of every rule builder but was not
exported, so a custom scope could not be typed. Also exports `DetectData`,
`DetectResult`, `ZodSchemaImportTracker` and `ZodChainItem`.
