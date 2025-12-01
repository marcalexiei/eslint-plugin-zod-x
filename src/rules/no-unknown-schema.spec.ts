import dedent from 'dedent';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noUnknownSchema } from './no-unknown-schema.js';

const ruleTester = new RuleTester();

ruleTester.run('no-unknown-schema', noUnknownSchema, {
  valid: [
    {
      name: 'with another zod schema',
      code: dedent`
        import * as z from 'zod';
        const schema = z.string();
      `,
    },
    {
      code: dedent`
        import * as z from 'zod';
        const schema = z.object({ name: z.string() });
      `,
    },
    {
      name: 'not zod',
      code: 'something.unknown()',
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        const schema = z.unknown();
      `,
      errors: [{ messageId: 'noZUnknown' }],
    },
    {
      name: 'named import',
      code: dedent`
        import { unknown } from 'zod';
        const schema = unknown();
      `,
      errors: [{ messageId: 'noZUnknown' }],
    },
    {
      name: 'namespace import within an object',
      code: dedent`
        import * as z from 'zod';
        const schema = z.object({ prop: z.unknown() });
      `,
      errors: [{ messageId: 'noZUnknown', line: 2, column: 33, endColumn: 44 }],
    },
  ],
});
