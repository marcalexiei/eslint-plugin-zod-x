# Enforce consistent style for error messages in Zod schema validation (using ESQuery patterns) (`zod-x/schema-error-property-style`)

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name       | Description                                                | Type   |
| :--------- | :--------------------------------------------------------- | :----- |
| `example`  | Example code to help user understands the required pattern | String |
| `selector` | A ESQuery string to match the required pattern             | String |

<!-- end auto-generated rule options list -->

## Rule Details

This rule enforces how error messages should be formatted in Zod schema validation using `refine()` and `custom()` methods.

### ✅ Correct

```ts
// Default configuration (Literal or TemplateLiteral)
z.custom(() => true, { error: 'my error' });
z.custom(() => true, `my error`);

// Custom configuration with selector "Literal"
z.custom(() => true, { error: 'my error' });
```

### ❌ Incorrect

```ts
// Default configuration
z.custom(() => true, { error: () => 'my error' });
z.custom(() => true, { error: getError() });

// Custom configuration with selector "Literal"
z.custom(() => true, { error: `template string` });
```

### Default Options

```json
{
  "selector": "Literal,TemplateLiteral",
  "example": "'error message'"
}
```

### Custom Configuration Example

```json
{
  "rules": {
    "zod-x/schema-error-property-style": [
      "error",
      {
        "selector": "Literal",
        "example": "'static error message'"
      }
    ]
  }
}
```

## Further Reading

- [ESQuery Syntax Documentation](https://github.com/estools/esquery)
