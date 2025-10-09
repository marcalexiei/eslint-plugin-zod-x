import { RuleTester } from '@typescript-eslint/rule-tester';

import { consistentImportSource } from './consistent-import-source.js';

const ruleTester = new RuleTester();

ruleTester.run('consistent-import-source', consistentImportSource, {
  valid: [
    { code: 'import z from "zod"' },
    { code: 'import z from "zod"', options: [{ sources: ['zod'] }] },
    { code: 'import z from "zod/v4"', options: [{ sources: ['zod/v4'] }] },
    { code: 'import z from "zod/mini"', options: [{ sources: ['zod/mini'] }] },
    {
      code: 'import z from "zod/v4-mini"',
      options: [{ sources: ['zod/v4-mini'] }],
    },
  ],
  invalid: [
    {
      code: 'import z from "zod"',
      options: [{ sources: ['zod/v4'] }],
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod', sources: '"zod/v4"' },
        },
      ],
    },
    {
      code: 'import z from "zod/v4"',
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v4', sources: '"zod"' },
        },
      ],
    },
    {
      code: 'import z from "zod/mini"',
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/mini', sources: '"zod"' },
        },
      ],
    },
  ],
});
