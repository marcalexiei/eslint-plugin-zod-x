import { RuleTester } from '@typescript-eslint/rule-tester';

import { preferNamespaceImport } from './prefer-namespace-import.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-namespace-import', preferNamespaceImport, {
  valid: [
    {
      name: 'valid usage',
      code: 'import * as z from "zod";',
    },
    {
      name: 'alias is fine',
      code: 'import * as myZod from "zod";',
    },
    {
      name: 'type imports',
      code: 'import type * as myZod from "zod";',
    },
    {
      name: 'unrelated imports',
      code: 'import { useState } from "react";',
    },
    {
      name: 'zod/mini',
      code: 'import * as z from "zod/mini";',
    },
  ],

  invalid: [
    {
      name: 'named import',
      code: 'import { z } from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod";',
    },
    {
      name: 'default import',
      code: 'import z from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod";',
    },
    {
      name: 'multiple named imports',
      code: 'import { object, string } from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as object from "zod";',
    },
    {
      name: 'mixed default + named',
      code: 'import z, { object } from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod";',
    },
    {
      name: 'zod/mini',
      code: 'import z from "zod/mini";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod/mini";',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/39
      name: 'named type import',
      code: 'import type { z } from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import type * as z from "zod";',
    },
    {
      name: 'value import and type import',
      code: [
        'import { z } from "zod";',
        'import type { ZodType } from "zod";',
      ].join('\n'),
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'removeDuplicate', line: 2 },
      ],
      output: 'import * as z from "zod";\n',
    },
    {
      name: 'type import and Value import',
      code: [
        'import type { z } from "zod";',
        'import { object } from "zod";',
      ].join('\n'),
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'removeDuplicate', line: 2 },
      ],
      output: 'import * as z from "zod";\n',
    },
  ],
});
