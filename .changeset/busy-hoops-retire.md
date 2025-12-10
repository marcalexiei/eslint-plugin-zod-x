---
'eslint-plugin-zod-x': major
---

feat!: rename `no-any` to `no-any-schema`

The `no-any` rule has been renamed to `no-any-schema` to align with the naming convention used by other rules such as `no-unknown-schema` and `consistent-object-schema-type`.

If you are using the `recommend` configuration, no changes are required.

For manual configurations, update your rule key as shown below:

```diff
  // eslint.config.js
  import { defineConfig } from 'eslint/config';
  import eslintPluginZodX from 'eslint-plugin-zod-x';

  export default defineConfig(
    {
      plugins: {
        'zod-x': eslintPluginZodX,
      },
      rules: {
-       'zod-x/no-any': 'error',
+       'zod-x/no-any-schema': 'error',
      }
    }
  );
```
