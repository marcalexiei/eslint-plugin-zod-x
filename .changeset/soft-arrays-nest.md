---
'eslint-plugin-zod': patch
---

fix: allow chained array methods in no-duplicate-schema-methods

The `no-duplicate-schema-methods` rule now treats repeated `.array()` calls as valid nested array schema construction.
