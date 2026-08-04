---
'eslint-plugin-zod-mini': patch
---

fix: `prefer-meta` autofix corrupting a computed `z['describe'](…)` call

The fixer renamed the callee's property to `meta` without checking that it was an identifier, so a computed key was rewritten into the undeclared identifier `meta`: `z['describe']('x')` became `z[meta]({ description: 'x' })`.
Such a call is now reported without a fix.
