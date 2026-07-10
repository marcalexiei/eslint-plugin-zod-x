# zod/prefer-tuple-over-array-length

📝 Prefer `z.tuple()` over a length-constrained `z.array()` so the length is preserved in the inferred type.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

A length-constrained `z.array()` validates the length at runtime, but the constraint is lost at the type level — `z.array(z.string()).length(2)` still infers as `string[]`.\
`z.tuple()` encodes the length in the type, so the inferred type is `[string, string]`.

This rule flags `z.array()` schemas that carry a length constraint:

- `.length(n)`
- `.min(n)`
- `.max(n)`

## Why?

```ts
import * as z from 'zod';

const pair = z.array(z.string()).length(2);
//    ^? z.infer<typeof pair> → string[]        // length lost

const pair = z.tuple([z.string(), z.string()]);
//    ^? z.infer<typeof pair> → [string, string] // precise
```

A tuple:

1. Preserves the element count in the inferred type
2. Lets TypeScript catch out-of-bounds access at compile time
3. Communicates a fixed-shape value more clearly than a runtime length check

## Examples

### ❌ Invalid

```ts
import * as z from 'zod';

z.array(z.string()).length(2);
z.array(z.string()).min(2);
z.array(z.string()).max(5);
```

### ✅ Valid

```ts
import * as z from 'zod';

z.tuple([z.string(), z.string()]);

// A variable-length array without a length constraint is fine
z.array(z.string());

// `nonempty()` already produces a typed `[string, ...string[]]`
z.array(z.string()).nonempty();
```

## Autofix Behavior

Only the fixed-length `.length(n)` form is autofixed, because it maps 1:1 to a tuple. The rule repeats the element schema `n` times and drops the length check:

```ts
// Before
z.array(z.string()).length(2);

// After
z.tuple([z.string(), z.string()]);
```

### Limitations

`.min()` and `.max()` are reported but **not** autofixed — there is no single behavior-preserving tuple equivalent for an open-ended bound.

Autofix is also **not applied** when:

- The count is not a non-negative integer literal (e.g. `z.array(x).length(n)`)
- The array is referenced via named imports (e.g. `import { array } from 'zod'`), since the fix would need to add a `tuple` import
- The `z.array()` call does not have exactly one element-schema argument

In these cases the rule still reports but leaves the code unchanged.

## When Not To Use It

You may want to disable this rule if:

- You intentionally validate array length at runtime without wanting a fixed-shape type
- You prefer `z.array().min()`/`.max()` for variable-length bounded collections

## Further Reading

- [Zod – Tuples](https://zod.dev/api?id=tuples)
- [Zod – Arrays](https://zod.dev/api?id=arrays)
