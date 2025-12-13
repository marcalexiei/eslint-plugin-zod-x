---
'eslint-plugin-zod-x': major
---

feat(prefer-strict-object)!: remove rule

Use `consistent-object-schema-type` instead:

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
-       'zod-x/prefer-strict-object': 'error',
+       'zod-x/consistent-object-schema-type': [
+         'error',
+         { allow: ['strictObject'] },
+       ],
      }
    }
  );
```
