# zod/no-number-schema-with-safe

📝 Disallow deprecated `z.number().safe()`. Use `z.int()`; `.safe()` is now identical to `.int()`.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule disallows `z.number().safe(...)` in favor of `z.int(...)` (with the same parameters where applicable), matching Zod’s migration guidance.

## Examples

### Invalid

```ts
import { z } from 'zod';

z.number().safe();
z.number().safe('message');
z.number().safe().min(0);
```

### Valid

```ts
import { z } from 'zod';

z.int();
z.int().min(0);
```

## When Not To Use It

If you are stuck on a Zod version where the deprecation does not apply, you can turn this rule off.

## Further Reading

- [Zod v4 – Integers](https://zod.dev/api?id=integers)
