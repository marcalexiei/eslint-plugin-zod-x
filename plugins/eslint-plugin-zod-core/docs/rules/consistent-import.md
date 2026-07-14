# zod-core/consistent-import

📝 Enforce a consistent import style for Zod core.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces a single import style for `zod/v4/core`: either the namespace form (`import * as core from 'zod/v4/core'`) or named imports (`import { $ZodString } from 'zod/v4/core'`).

## Options

<!-- begin auto-generated rule options list -->

| Name     | Description                                      | Type   | Choices              |
| :------- | :----------------------------------------------- | :----- | :------------------- |
| `syntax` | Specifies the import syntax to use for Zod core. | String | `namespace`, `named` |

<!-- end auto-generated rule options list -->

`namespace` is the default.

## Examples

With `{ "syntax": "namespace" }` (default):

### ❌ Invalid

```ts
import { $ZodString } from 'zod/v4/core';
const mySchema = new $ZodString({ type: 'string', checks: [] });
```

### ✅ Valid

```ts
import * as core from 'zod/v4/core';
const mySchema = new core.$ZodString({ type: 'string', checks: [] });
```
