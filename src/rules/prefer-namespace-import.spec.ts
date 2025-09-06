import { RuleTester } from '@typescript-eslint/rule-tester';

import { preferNamespaceImport } from './prefer-namespace-import.js';

const ruleTester = new RuleTester({});

ruleTester.run('prefer-namespace-import', preferNamespaceImport, {
  valid: [
    // Correct usage
    {
      code: `import * as z from "zod";`,
    },
    // Alias is fine
    {
      code: `import * as myZod from "zod";`,
    },
    // Type imports
    {
      code: `import type * as myZod from "zod";`,
    },
    // Unrelated imports
    {
      code: `import { something } from "react";`,
    },
  ],

  invalid: [
    // Named import
    {
      code: `import { z } from "zod";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as z from 'zod';`,
    },
    // Default import
    {
      code: `import z from "zod";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as z from 'zod';`,
    },
    // Multiple named imports
    {
      code: `import { object, string } from "zod";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as object from 'zod';`, // fixes to first specifier name
    },
    // Mixed default + named
    {
      code: `import z, { object } from "zod";`,
      errors: [{ messageId: 'useNamespace' }],
      output: `import * as z from 'zod';`,
    },
  ],
});
