---
'eslint-plugin-zod': patch
'eslint-plugin-zod-mini': patch
'@eslint-zod/utils': patch
---

fix(consistent-schema-var-name): refine prefix/suffix handling

accept a bare token matching either affix case-insensitively when only one side is configured, and use the configured affix casing in rename suggestions
