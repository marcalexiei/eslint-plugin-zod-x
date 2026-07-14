---
'eslint-plugin-zod-mini': minor
---

feat: add `no-conflicting-checks` rule

Flags checks that can never match together (`z.check(z.gt(10), z.lt(5))`, `z.check(z.url(), z.email())`), redundant/confusing combinations, and checks that don't apply to the schema's base type (`z.number().check(z.minLength(1))` silently accepts everything).

Three option-gated categories, all on by default; no autofix.
