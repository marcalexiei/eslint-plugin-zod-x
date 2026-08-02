---
'@eslint-zod/utils': major
---

fix!: `collectZodChainMethods` returns `[]` instead of a partial chain

When the walk hits a call it cannot name (`z['string']()`), the whole chain is
dropped rather than truncated, so `chain[0]` is always the factory and `chain[i]`
always matches `collectZodSchemaConstraints`' `chainIndex`. Rules that index the
chain must handle the empty case — detection stays permissive.
