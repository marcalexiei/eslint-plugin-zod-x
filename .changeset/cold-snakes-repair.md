---
'eslint-plugin-zod-x': minor
---

This release adds support for Zod named exports.
All rules should now work with default, namespace, and named import styles,
this required a major rewrite.

---

Some rules do not yet provide automatic fixes when using named imports.
Fixes for those cases are more complex because they often require modifying import statements.

---

🤕🤕🤕
This is not a major release since doesn't add any breaking change,
however there might be some issues due to the major refactor.
