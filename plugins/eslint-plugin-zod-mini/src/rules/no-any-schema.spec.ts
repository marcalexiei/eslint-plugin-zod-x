import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noAnySchema } from './no-any-schema.js';

const ruleTester = new RuleTester();

ruleTester.run(noAnySchema.name, noAnySchema, {
  valid: [
    {
      name: 'not triggered with another schema',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.string();
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        const userSchema = z.string();
      `,
    },
    {
      name: 'nested schema declaration',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.object({ name: z.string() });
      `,
    },
    {
      name: 'not zod',
      code: 'something.any()',
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        const userSchema = z.any();
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.any();
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import * as z from 'zod/mini';
                const userSchema = z.unknown();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        const userSchema = z.any();
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import { z } from 'zod/mini';
                const userSchema = z.unknown();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named import',
      code: dedent`
        import { any } from 'zod/mini';
        const userSchema = any();
      `,
      errors: [{ messageId: 'noZAny' }],
    },
    {
      name: 'namespace import within an object',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.object({ prop: z.any() });
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import * as z from 'zod/mini';
                const userSchema = z.object({ prop: z.unknown() });
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        const userSchema = z.any();
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import * as z from 'zod/v4-mini';
                const userSchema = z.unknown();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'chained method',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.any().check((value) => value)
      `,
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: dedent`
                import * as z from 'zod/mini';
                const userSchema = z.unknown().check((value) => value)
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named import with a chained method — reported without a rename suggestion',
      code: dedent`
        import { any, check } from 'zod/mini';
        const userSchema = any().check((value) => value);
      `,
      errors: [{ messageId: 'noZAny', suggestions: [] }],
    },
    {
      name: 'computed factory access — reported without a rename suggestion',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z['any']();
      `,
      errors: [{ messageId: 'noZAny', suggestions: [] }],
    },
  ],
});
