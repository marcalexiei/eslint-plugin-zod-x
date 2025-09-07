# Enforce consistent Zod array style (`zod-x/array-style`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name    | Description                                | Type   | Choices              |
| :------ | :----------------------------------------- | :----- | :------------------- |
| `style` | Decides which style for zod array function | String | `function`, `method` |

<!-- end auto-generated rule options list -->

This rule enforces a consistent style for defining arrays in Zod schemas. You can choose between:

- **Function style**: `z.array(...)`
- **Method style**: `.array()`

## Examples

### Valid

```ts
z.array(z.string()); // default / function
z.string().array(); // method
```

### Invalid

```ts
// ❌ Method used when function is required
z.string().array();
// ✅ Correct
z.array(z.string());

// ❌ Function used when method is required
z.array(z.string());
// ✅ Correct
z.string().array();

// ❌ Function with chained methods
z.array(z.string().trim());
// ✅ Correct
z.string().trim().array();
```
