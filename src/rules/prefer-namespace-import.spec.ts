import { RuleTester } from '@typescript-eslint/rule-tester';

import { preferNamespaceImport } from './prefer-namespace-import.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-namespace-import', preferNamespaceImport, {
  valid: [
    {
      name: 'Correct usage',
      code: `import * as z from "zod";`,
    },
    {
      name: 'Alias is fine',
      code: `import * as myZod from "zod";`,
    },
    {
      name: 'Type imports',
      code: `import type * as myZod from "zod";`,
    },
    {
      name: 'Unrelated imports',
      code: `import { something } from "react";`,
    },
    {
      name: 'zod/mini',
      code: `import * as z from "zod/mini";`,
    },
  ],

  invalid: [
    {
      name: 'Named import',
      code: `import { z } from "zod";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as z from 'zod';`,
    },
    {
      name: 'Default import',
      code: `import z from "zod";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as z from 'zod';`,
    },
    {
      name: 'Multiple named imports',
      code: `import { object, string } from "zod";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as object from 'zod';`, // fixes to first specifier name
    },
    {
      name: 'Mixed default + named',
      code: `import z, { object } from "zod";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as z from 'zod';`,
    },
    {
      name: 'zod/mini',
      code: `import z from "zod/mini";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as z from 'zod/mini';`,
    },
  ],
});
