# Disallow usage of `z.number().int()` as it is considered legacy (`zod-x/no-number-schema-with-int`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent the usage of the legacy `z.number().int()` method chain in favor of the more concise `z.int()` method.

## Examples

### ❌ Invalid

```ts
const schema = z.number().int();
const schemaWithOtherMethods = z.number().min(0).int().max(100);
```

### ✅ Valid

```ts
const schema = z.int();
const schemaWithOtherMethods = z.int().min(0).max(100);
```

## When Not To Use It

If you’re not concerned about using a legacy API, you can disable this rule.

## Further Reading

- [Zod Documentation - Numbers](https://zod.dev/?id=numbers)
- [Zod Documentation - Integers](https://zod.dev/?id=integers)
- [Zod v4 migration - .int() accepts safe integers only](https://zod.dev/v4/changelog?id=int-accepts-safe-integers-only)
