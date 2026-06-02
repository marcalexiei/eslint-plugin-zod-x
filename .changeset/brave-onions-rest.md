---
'eslint-plugin-zod-mini': minor
'eslint-plugin-zod': minor
---

feat: add `no-coerce-boolean` rule

Disallow `z.coerce.boolean()`, which relies on `Boolean()` and treats any non-empty string (including `"false"`) as `true`.\
The rule offers a suggestion to replace it with `z.stringbool()`.
