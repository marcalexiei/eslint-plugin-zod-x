import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noAnySchema } from './no-any-schema.js';

const ruleTester = new RuleTester();

ruleTester.run(noAnySchema.name, noAnySchema, {
  valid: [
    {
      name: 'not triggered with another schema',
      code: dedent`
        import * as z from 'zod';
        const schema = z.string();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/174
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        const schema = z.string();
      `,
    },
    {
      name: 'nested schema declaration',
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
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        const schema = z.any();
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import { z } from 'zod';
                const schema = z.unknown();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named z import with rename',
      code: dedent`
        import { z as pippo } from 'zod';
        const schema = pippo.any();
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import { z as pippo } from 'zod';
                const schema = pippo.unknown();
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
    {
      // https://github.com/marcalexiei/eslint-zod/issues/143
      name: 'should correctly fix any schema with chained method',
      code: dedent`
        import * as z from 'zod';
        export const aSchema = z.any().refine((value) => value)
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import * as z from 'zod';
                export const aSchema = z.unknown().refine((value) => value)
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named import with a chained method — reported without a rename suggestion',
      code: dedent`
        import { any } from 'zod';
        const schema = any().optional();
      `,
      errors: [{ messageId: 'noZAny', suggestions: [] }],
    },
    {
      name: 'computed factory access — reported without a rename suggestion',
      code: dedent`
        import * as z from 'zod';
        const schema = z['any']();
      `,
      errors: [{ messageId: 'noZAny', suggestions: [] }],
    },
  ],
});
