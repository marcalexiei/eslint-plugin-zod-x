---
'eslint-plugin-zod-x': patch
---

fix: simplify plugin type

Refactor plugin `rules` object to use `Record<string, TSESLint.LooseRuleDefinition>` type.
This eliminates the need to export rule options from individual rule files, fixing the `TS4023` TypeScript error:

```text
Exported variable 'eslintPluginZodX' has or is using name 'Options' from external module "./src/rules/array-style" but cannot be named.
```
