# zod/no-string-schema-with-uuid

📝 Disallow usage of `z.string().uuid()` in favor of the dedicated `z.uuid()` schema.

❌ This rule is deprecated. Use `zod/prefer-top-level-string-formats` instead.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Deprecation notice

Use `zod/prefer-top-level-string-formats` instead:

```diff
  // eslint.config.js
  import { defineConfig } from 'eslint/config';
  import eslintPluginZod from 'eslint-plugin-zod';

  export default defineConfig(
    {
      plugins: {
        zod: eslintPluginZod,
      },
      rules: {
-       'zod/no-string-schema-with-uuid': 'error',
+       'zod/prefer-top-level-string-formats': 'error',
      }
    }
  );
```

## Rule Details

This rule aims to prevent the usage of `z.string().uuid()` in favor of the dedicated `z.uuid()` schema from Zod’s [string formats API](https://zod.dev/api#uuids).

## Examples

### ❌ Invalid

```ts
const schema = z.string().uuid();
const schemaWithOtherMethods = z.string().optional().uuid();
```

### ✅ Valid

```ts
const schema = z.uuid();
const schemaWithOtherMethods = z.uuid().optional();
```

## Autofix Behavior

The fix replaces the factory and the deprecated method in one go, keeping the methods in between:

```ts
// Before
z.string().uuid().min(1);
// After
z.uuid().min(1);
```

The rule reports but does **not** fix two cases, because the replacement cannot be written safely:

- A named import (`import { string } from 'zod'; string().uuid()`) — the fix would need a new import for the top-level factory
- A chain reached through a computed member (`z['string']().uuid()`), which the chain walker cannot name

## When Not To Use It

If you prefer the chained form or need to support an older Zod API, you can disable this rule.

## Further Reading

- [Zod - UUIDs](https://zod.dev/api#uuids)
