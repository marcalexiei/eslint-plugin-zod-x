---
'@eslint-zod/utils': patch
---

fix: `buildNoAnySchemaCreate` crash on an empty schema chain

The builder destructured the first chain item unconditionally, throwing when a computed factory call produced no walkable chain.
