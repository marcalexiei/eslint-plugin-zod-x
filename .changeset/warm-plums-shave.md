---
'eslint-plugin-zod-core': patch
---

fix: `consistent-import` alias collision between two zod sources

Every rewritten import group received the alias `z`, so a file importing from two sources was fixed into two `import * as z` declarations.
Each group now gets a distinct alias.
