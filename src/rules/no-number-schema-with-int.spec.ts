import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNumberSchemaWithInt } from './no-number-schema-with-int.js';

const ruleTester = new RuleTester();

ruleTester.run('no-number-schema-with-int', noNumberSchemaWithInt, {
  valid: [
    {
      name: 'valid usage',
      code: dedent`
        import * as z from 'zod';
        z.int();
      `,
    },
    {
      name: 'valid usage (named)',
      code: dedent`
        import int from 'zod';
        int();
      `,
    },
    {
      name: 'standard + chain method',
      code: dedent`
        import * as z from 'zod';
        z.int().min(5);
      `,
    },
    {
      name: 'number without .int()',
      code: dedent`
        import * as z from 'zod';
        z.number().optional();
      `,
    },
    {
      name: 'unrelated to zod',
      code: 'something.number().int().min(5)',
    },
    {
      name: 'nested valid usage',
      code: dedent`
        import * as z from 'zod';
        z.object({ age: z.int(), count: z.number() });
      `,
    },
  ],
  invalid: [
    {
      name: 'number + int',
      code: `
        import * as z from 'zod';
        z.number().int();
      `,
      errors: [{ messageId: 'removeNumber' }],
      output: `
        import * as z from 'zod';
        z.int();
      `,
    },
    {
      name: 'number + int (named)',
      code: `
        import { number } from 'zod';
        number().int();
      `,
      errors: [{ messageId: 'removeNumber' }],
      output: null,
    },
    {
      name: 'number + int + other method',
      code: `
        import * as z from 'zod';
        z.number().int().min(1);
      `,
      errors: [{ messageId: 'removeNumber' }],
      output: `
        import * as z from 'zod';
        z.int().min(1);
      `,
    },
    {
      name: 'number + other method + int',
      code: `
        import * as z from 'zod';
        z.number().min(1).int();
      `,
      errors: [{ messageId: 'removeNumber' }],
      output: `
        import * as z from 'zod';
        z.int().min(1);
      `,
    },
    {
      name: 'nested in object',
      code: `
        import * as z from 'zod';
        z.object({ age: z.number().int() });
      `,
      errors: [{ messageId: 'removeNumber' }],
      output: `
        import * as z from 'zod';
        z.object({ age: z.int() });
      `,
    },
  ],
});
