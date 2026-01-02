# zod-x/consistent-import-source

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

📝 Enforce consistent source from Zod imports.

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces consistent import sources for Zod across your project.
It helps maintain uniformity in how Zod is imported, especially when dealing with different versions or import paths.

---

This rule is disabled by default since equivalent behavior can be enforced by other, more specialized rules.

- <https://eslint.org/docs/latest/rules/no-restricted-imports>
- <https://typescript-eslint.io/rules/no-restricted-imports>

Any feedback regarding this topic is welcome. Feel free to open issue to share your opinion.

## Why?

Maintaining consistent import sources for Zod is important because:

1. **Version Consistency**: Prevents mixing different versions of Zod in the same project, which could lead to compatibility issues.

2. **Predictable Dependencies**: Makes it easier to track and update Zod dependencies when all imports use the same source.

3. **Easier Migration**: When upgrading Zod versions, having consistent imports makes it simpler to update all import statements at once.

4. **Better Maintainability**: Having a single source of truth for Zod imports makes the codebase more maintainable and reduces confusion.

## Options

<!-- begin auto-generated rule options list -->

| Name      | Description                             | Type     |
| :-------- | :-------------------------------------- | :------- |
| `sources` | An array of allowed Zod import sources. | String[] |

<!-- end auto-generated rule options list -->

## Examples

### ❌ Invalid

```ts
// When sources is set to ['zod/v4']
import z from 'zod';
import { string } from 'zod/v3';

// When sources is set to ['zod']
import z from 'zod/v4';
```

### ✅ Valid

```ts
// Default configuration (sources: ['zod'])
import z from 'zod';

// With sources: ['zod/v4']
import z from 'zod/v4';

// With sources: ['zod', 'zod/v4']
import z from 'zod';
import other from 'zod/v4';
```

## Configuration Examples

### Default Configuration

```json
{
  "rules": {
    "zod-x/consistent-import-source": "error"
  }
}
```

This will only allow imports from 'zod'.

### Specific Version Configuration

```json
{
  "rules": {
    "zod-x/consistent-import-source": [
      "error",
      {
        "sources": ["zod/v4"]
      }
    ]
  }
}
```

This will only allow imports from 'zod/v4'.

### Multiple Sources Configuration

```json
{
  "rules": {
    "zod-x/consistent-import-source": [
      "error",
      {
        "sources": ["zod", "zod/v4"]
      }
    ]
  }
}
```

This will allow imports from both `'zod'` and `'zod/v4'`.

## When Not To Use It

If you need to:

- Use multiple versions of Zod in the same project for compatibility reasons
- Gradually migrate from one version to another
- Have different parts of your application use different Zod versions
- You are using other rules to achieve these behavior:
  - <https://eslint.org/docs/latest/rules/no-restricted-imports>
  - <https://typescript-eslint.io/rules/no-restricted-imports>

## Further Reading

- [Zod - Installation Guide](https://zod.dev/?id=installation)
- [Node.js - Package Versioning](https://nodejs.org/docs/latest/api/packages.html#packages_package_entry_points)
