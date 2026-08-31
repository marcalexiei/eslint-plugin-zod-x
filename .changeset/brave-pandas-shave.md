---
'@eslint-zod/utils': patch
'eslint-plugin-zod': patch
'eslint-plugin-zod-mini': patch
---

fix(consistent-schema-var-name): stop reporting `z.validate()` and `z.validateAsync()` results, which are booleans rather than schemas
