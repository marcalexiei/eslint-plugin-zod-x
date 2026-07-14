# zod-core/consistent-schema-output-type-style

📝 Enforce consistent use of core.infer or core.output for schema type inference.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

`zod/v4/core` exposes two equivalent ways to infer a schema's output type: `core.output<...>` and its alias `core.infer<...>`. This rule enforces one of them consistently.

## Options

<!-- begin auto-generated rule options list -->

| Name    | Description                                          | Type   | Choices           |
| :------ | :--------------------------------------------------- | :----- | :---------------- |
| `style` | Decides which style to use for schema type inference | String | `infer`, `output` |

<!-- end auto-generated rule options list -->

`output` is the default.

## Examples

With `{ "style": "output" }` (default):

### ❌ Invalid

```ts
import * as core from 'zod/v4/core';
type SchemaType = core.infer<typeof Schema>;
```

### ✅ Valid

```ts
import * as core from 'zod/v4/core';
type SchemaType = core.output<typeof Schema>;
```
