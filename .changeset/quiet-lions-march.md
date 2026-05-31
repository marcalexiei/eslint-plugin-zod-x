---
'eslint-plugin-zod-mini': minor
---

feat: add `no-duplicate-schema-methods` rule

Disallows calling the same schema method more than once in a single chain.\
Methods that are valid to repeat are excluded from the check:

- `and`
- `check`
- `or`
- `register`
