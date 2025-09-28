# Enforce usage of .strictObject() over .object() and/or .looseObject() (`zod-x/prefer-strict-object`)

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces the use of `.strictObject()` over `.object()` and/or `.looseObject()` when creating Zod object schemas.
By default, it requires using `.strictObject()` exclusively, but can be configured to allow other methods.

## Why?

Using `.strictObject()` provides several benefits:

1. **Type Safety**: Strict objects will throw an error if they receive unexpected properties, preventing potential bugs from typos or unintended data.

2. **Explicit Behavior**: Makes it clear that unknown properties are not allowed, improving code readability and maintainability.

3. **Better Runtime Validation**: Helps catch data structure mismatches early by failing fast when unexpected properties are present.

4. **Consistent Validation**: Ensures that objects match their schema exactly, which is particularly important when:
   - Validating API payloads
   - Parsing configuration objects
   - Working with user input
   - Implementing strict data contracts

## Options

<!-- begin auto-generated rule options list -->

| Name    | Description                                | Type     |
| :------ | :----------------------------------------- | :------- |
| `allow` | Decides which style for zod array function | String[] |

<!-- end auto-generated rule options list -->

## Examples

### ❌ Invalid

```ts
const schema1 = z.object({ foo: z.string() });
const schema2 = z.looseObject({ bar: z.number() });
```

### ✅ Valid

```ts
const schema = z.strictObject({ foo: z.string() });
```

---

## With Options

### Default (strict-only)

```json
{
  "rules": {
    "prefer-strict-object": "error"
  }
}
```

✅ Allows only `z.strictObject()`
❌ Reports both `z.object()` and `z.looseObject()`

### Allow `object`

```json
{
  "rules": {
    "zod-x/prefer-strict-object": ["error", { "allow": ["object"] }]
  }
}
```

✅ Allows `z.object()` and `z.strictObject()`
❌ Reports `z.looseObject()`

### Allow `object` and `looseObject`

```json
{
  "rules": {
    "zod-x/prefer-strict-object": [
      "error",
      {
        "allow": ["object", "looseObject"]
      }
    ]
  }
}
```

✅ Allows all three (`object`, `looseObject`, `strictObject`)
⚠️ Rule is effectively disabled in this config

## Further Reading

- [Zod Object Schemas](https://zod.dev/?id=objects)
- [Strict vs. Strip in Zod](https://zod.dev/?id=strict)
