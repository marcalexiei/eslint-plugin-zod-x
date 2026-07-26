---
'eslint-plugin-zod': patch
---

fix: `no-any-schema` crash on a computed factory call

The rule threw on `z['any']()`. It now reports the schema without a rename suggestion.
