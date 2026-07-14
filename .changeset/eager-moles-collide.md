---
'eslint-plugin-zod': minor
---

feat: add `no-conflicting-checks` rule

Flags check combinations that can never match (`.gt(10).lt(5)`, `.uuid().email()`, `.uuid().max(1)`) or are redundant/confusing (`.gt(0).positive()`, `.lowercase().uppercase()`).

Three option-gated categories, all on by default; no autofix.
