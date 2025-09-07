# Enforce importing zod as a namespace import (import \* as z from 'zod') (`zod-x/prefer-namespace-import`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Examples

### Valid

```ts
import * as z from 'zod'; // correct usage
import * as myZod from 'zod'; // alias is fine
import type * as myZod from 'zod'; // type imports
import { something } from 'react'; // unrelated imports
```

### Invalid

```ts
// ❌ Named import
import { z } from 'zod';
// ✅ Corrected
import * as z from 'zod';

// ❌ Default import
import z from 'zod';
// ✅ Corrected
import * as z from 'zod';

// ❌ Multiple named imports
import { object, string } from 'zod';
// ✅ Corrected (uses first specifier)
import * as object from 'zod';

// ❌ Mixed default + named
import z, { object } from 'zod';
// ✅ Corrected
import * as z from 'zod';
```
