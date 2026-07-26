---
'eslint-plugin-zod': patch
---

fix: `consistent-import` alias collision between two zod sources

Every rewritten import group received the alias `z`, so a file importing from both `zod` and `zod/v3` was fixed into two `import * as z` declarations. Each group now gets a distinct alias.
