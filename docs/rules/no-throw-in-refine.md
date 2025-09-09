# Disallow throwing errors directly inside Zod refine callbacks (`zod-x/no-throw-in-refine`)

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

This ESLint rule detects and prevents **throw statements directly inside Zod `.refine()` callbacks**. It ignores throws in nested functions but ensures the call is a **Zod expression** (starts with `z.`).

## Examples

### Valid

```ts
z.number()
  .min(0)
  .refine((val) => true);

z.string().refine((val) => {
  const fn = () => {
    throw new Error('nested');
  }; // Nested function is OK
  return val.length > 0;
});
```

### Invalid

```ts
z.number().refine((val) => {
  if (val < 0) throw new Error('Invalid'); // ❌ flagged
});

z.string().refine(() => {
  throw new Error('No');
}); // ❌ flagged
```
