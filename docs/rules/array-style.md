# zod-x/array-style

📝 Enforce consistent Zod array style.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule details

This rule enforces a single, consistent style for defining Zod arrays: either the function style (`z.array(schema)`) or the method style (`schema.array()`).

It helps keep schemas uniform across a codebase, improves readability, and makes automated formatting/fixing predictable.

## Why?

- **Consistency**: reduces cognitive load when reading schemas.
- **Predictability**: codebase-wide conventions make reviews and diffs clearer.
- **Tooling**: the rule is automatically fixable, allowing batch or editor-driven fixes.

## Options

<!-- begin auto-generated rule options list -->

| Name    | Description                                | Type   | Choices              |
| :------ | :----------------------------------------- | :----- | :------------------- |
| `style` | Decides which style for zod array function | String | `function`, `method` |

<!-- end auto-generated rule options list -->

You can choose between:

- **Function style**: `z.array(...)`
- **Method style**: `.array()`

`function` is used as default to maintain consistency with TypeScript’s `Array` generic syntax.

## Examples

### `function`

#### ✅ Valid

```ts
z.array(z.string());
```

#### ❌ Invalid

```ts
z.string().array();

z.string().trim().array();
```

### `method`

#### ✅ Valid

```ts
z.string().array(); // method
```

#### ❌ Invalid

```ts
z.array(z.string());

z.array(z.string().trim());
```

## Further Reading

- [Array Types in TypeScript](https://tkdodo.eu/blog/array-types-in-type-script)
