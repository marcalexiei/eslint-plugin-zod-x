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

By default, `function` is used to maintain consistency with TypeScript’s `Array` generic syntax.
For more details on the reasoning behind this, see <https://tkdodo.eu/blog/array-types-in-type-script>.

## Examples

### `function`

#### Valid

```ts
z.array(z.string());
```

#### Invalid

```ts
z.string().array();

z.string().trim().array();
```

### `method`

#### Valid

```ts
z.string().array(); // method
```

#### Invalid

```ts
z.array(z.string());

z.array(z.string().trim());
```
