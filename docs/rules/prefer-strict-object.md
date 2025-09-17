# Enforce usage of .strictObject() over .object() and/or .looseObject() (`zod-x/prefer-strict-object`)

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name    | Description                                | Type     |
| :------ | :----------------------------------------- | :------- |
| `allow` | Decides which style for zod array function | String[] |

<!-- end auto-generated rule options list -->

## Examples

### Invalid

```ts
const schema1 = z.object({ foo: z.string() });
const schema2 = z.looseObject({ bar: z.number() });
```

### Valid

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
