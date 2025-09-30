# Require schema suffix when declaring a Zod schema (`zod-x/require-schema-suffix`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces a consistent naming convention for Zod schema variables by requiring them to end with a specified suffix (default: 'Schema').
This helps identify schema declarations and maintains consistent naming across your codebase.

## Why?

Using a consistent suffix for Zod schemas provides several benefits:

1. **Clear Identification**: Makes it immediately obvious which variables contain Zod schemas
2. **Better Code Navigation**: Easier to find schema declarations when all follow the same pattern
3. **Self-Documenting Code**: The suffix helps document the variable's purpose
4. **Consistency**: Maintains a uniform naming convention across the project

## Options

<!-- begin auto-generated rule options list -->

| Name     | Description                                  | Type   |
| :------- | :------------------------------------------- | :----- |
| `suffix` | The required suffix for Zod schema variables | String |

<!-- end auto-generated rule options list -->

## Examples

### ❌ Invalid

```ts
// With default options ({ suffix: 'Schema' })
const user = z.string();
const address = z.object({ street: z.string() });

// With custom suffix ({ suffix: 'Type' })
const user = z.string();
```

### ✅ Valid

```ts
// With default options ({ suffix: 'Schema' })
const userSchema = z.string();
const addressSchema = z.object({ street: z.string() });

// With custom suffix ({ suffix: 'Type' })
const userType = z.string();

// Non-schema declarations are ignored
const parsedValue = z.string().parse('test');
const result = someOtherFunction();
```

## Configuration

### Default

```json
{
  "rules": {
    "zod-x/require-schema-suffix": ["error"]
  }
}
```

### Custom Suffix

```json
{
  "rules": {
    "zod-x/require-schema-suffix": ["error", { "suffix": "Type" }]
  }
}
```

## When Not To Use It

If you:

- Have an existing codebase with different naming conventions
- Prefer a different way to identify schema variables
- Use Zod schemas in a context where the suffix would be redundant

## Further Reading

- [TypeScript Naming Conventions](https://typescript-eslint.io/rules/naming-convention)
