---
'eslint-plugin-zod': patch
---

fix(no-duplicate-schema-methods): allow chaining of array methods

Repeated `.array()` calls are now recognized as valid nested array schemas instead of being flagged as duplicate schema method usage.
