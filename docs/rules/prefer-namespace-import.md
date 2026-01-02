# zod-x/prefer-namespace-import

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📝 Enforce importing zod as a namespace import (`import * as z from 'zod'`).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces using namespace imports (`import * as z from 'zod'`) when importing Zod.
It ensures consistent import patterns across your codebase and prevents mixing different import styles.

## Why?

Using namespace imports for Zod provides several benefits:

1. **Better Tree-Shaking**: Namespace imports can potentially lead to better tree-shaking as the bundler has a clearer picture of what's being imported.

2. **Consistent Code Style**: Having a single way to import Zod makes the codebase more maintainable and easier to read.

3. **Clear Module Origin**: When using `z.string()` or `z.number()`, it's immediately clear that these methods come from Zod, improving code readability.

4. **Easier Refactoring**: Having all Zod functionality under a single namespace makes it easier to:
   - Find and replace Zod usage
   - Rename the import identifier if needed
   - Track Zod usage throughout the codebase

5. **Prevention of Naming Conflicts**: Using a namespace helps avoid potential naming conflicts with other libraries or variables.

## Examples

### ❌ Invalid

```ts
import { z } from 'zod';
import z from 'zod';
import { object, string } from 'zod';
import z, { object } from 'zod';
```

### ✅ Valid

```ts
import * as z from 'zod'; // valid usage
import type * as z from 'zod'; // type imports
```

## When Not To Use It

If you prefer using named imports for better IDE auto-imports or have specific build configurations that work better with named imports, you might want to disable this rule.

However, using namespace imports is generally recommended for better maintainability and clarity.

## Further Reading

- [Zod - Installation](https://zod.dev/?id=installation)
- [TypeScript - Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html)
- [JavaScript - Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
