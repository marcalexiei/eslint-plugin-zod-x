---
'@eslint-zod/utils': minor
---

feat: add `tracker.createSchemaVisitor({ schemaType, onSchema })`

Builds the `{ ImportDeclaration, CallExpression }` visitor a schema rule returns, with detection and the `schemaType` filter applied.
Replaces the hand-wired preamble, where omitting `ImportDeclaration` silently disabled detection for the whole file.
