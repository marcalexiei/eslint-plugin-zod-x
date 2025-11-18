import dedent from 'dedent';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noAny } from './no-any.js';

const ruleTester = new RuleTester();

ruleTester.run('no-any', noAny, {
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
      code: 'something.any()',
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        const schema = z.any();
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import * as z from 'zod';
                const schema = z.unknown();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named import',
      code: dedent`
        import { any } from 'zod';
        const schema = any();
      `,
      errors: [{ messageId: 'noZAny' }],
    },
    {
      name: 'namespace import within an object',
      code: dedent`
        import * as z from 'zod';
        const schema = z.object({ prop: z.any() });
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import * as z from 'zod';
                const schema = z.object({ prop: z.unknown() });
              `,
            },
          ],
        },
      ],
    },
  ],
});
