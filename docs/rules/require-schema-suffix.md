# Require schema suffix when declaring a Zod schema (`zod-x/require-schema-suffix`)

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces a consistent naming convention for Zod schema variables by requiring them to end with a specified suffix (default: 'Schema').
This helps identify schema declarations and maintains consistent naming across your codebase.

The rule ignores:

- Variables that store parsed values (e.g., `.parse()`, `.safeParse()`)
- Variables that use `z.codec()` transformations
- Non-Zod variable declarations

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

## Why is there no autofix or suggestion?

**TL;DR:** Use your IDE’s rename functionality, it’s far more robust and already battle-tested.
Adding a custom autofix here would essentially reinvent the wheel.

---

Renaming variables safely is surprisingly complex.
An ESLint rule cannot reliably handle all the cases involved, including:

- handling linked `import` / `export` statements
- avoiding naming conflicts within the same scope
- preventing accidental shadowing of variables in inner or outer scopes
- applying changes across multiple files (e.g., when the variable is exported)

Because of these limitations, this rule only reports an error and does not provide an automated fix.
To resolve the issue, rely on your IDE’s rename tools.
They’re designed to manage all of the above scenarios correctly.

## Examples

### Default

```json
{
  "rules": {
    "zod-x/require-schema-suffix": ["error"]
  }
}
```

❌ Invalid

```ts
const user = z.string();
const address = z.object({ street: z.string() });
const userType = z.string();
```

✅ Valid

```ts
const userSchema = z.string();
const addressSchema = z.object({ street: z.string() });
const userTypeSchema = z.string();

// Non-schema declarations are ignored
const parsedValue = z.string().parse('test');
const result = someOtherFunction();

// Codec transformations are ignored
const stringToDate = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
});
```

### Custom `suffix`

```json
{
  "rules": {
    "zod-x/require-schema-suffix": ["error", { "suffix": "_schema" }]
  }
}
```

❌ Invalid

```ts
const user = z.string();
const address = z.object({ street: z.string() });
const user = z.string();
```

✅ Valid

```ts
const user_schema = z.string();
const address_schema = z.object({ street: z.string() });
const user_type_schema = z.string();

// Non-schema declarations are ignored
const parsed_value = z.string().parse('test');
const result = someOtherFunction();

// Codec transformations are ignored
const string_to_date = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
});
```

## When Not To Use It

- Have an existing codebase with different naming conventions
- Prefer a different way to identify schema variables
- Use Zod schemas in a context where the suffix would be redundant

## Further Reading

- [TypeScript Naming Conventions](https://typescript-eslint.io/rules/naming-convention)
