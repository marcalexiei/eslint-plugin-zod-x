import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferNullish } from './prefer-nullish.js';

const ruleTester = new RuleTester();

ruleTester.run(preferNullish.name, preferNullish, {
  valid: [
    {
      name: 'already using nullish',
      code: dedent`
        import * as z from 'zod';
        z.string().nullish();
      `,
    },
    {
      name: 'only optional',
      code: dedent`
        import * as z from 'zod';
        z.string().optional();
      `,
    },
    {
      name: 'only nullable',
      code: dedent`
        import * as z from 'zod';
        z.string().nullable();
      `,
    },
    {
      name: 'optional and nullable not adjacent',
      code: dedent`
        import * as z from 'zod';
        z.string().optional().describe('x').nullable();
      `,
    },
    {
      name: 'not a zod import',
      code: dedent`
        import { string } from 'not-zod';
        string().optional().nullable();
      `,
    },
  ],
  invalid: [
    {
      name: 'optional then nullable',
      code: dedent`
        import * as z from 'zod';
        z.string().optional().nullable();
      `,
      errors: [{ messageId: 'preferNullish' }],
      output: dedent`
        import * as z from 'zod';
        z.string().nullish();
      `,
    },
    {
      name: 'nullable then optional',
      code: dedent`
        import * as z from 'zod';
        z.string().nullable().optional();
      `,
      errors: [{ messageId: 'preferNullish' }],
      output: dedent`
        import * as z from 'zod';
        z.string().nullish();
      `,
    },
    {
      name: 'keeps preceding checks',
      code: dedent`
        import * as z from 'zod';
        z.string().min(2).optional().nullable();
      `,
      errors: [{ messageId: 'preferNullish' }],
      output: dedent`
        import * as z from 'zod';
        z.string().min(2).nullish();
      `,
    },
    {
      name: 'keeps trailing methods',
      code: dedent`
        import * as z from 'zod';
        z.string().optional().nullable().describe('x');
      `,
      errors: [{ messageId: 'preferNullish' }],
      output: dedent`
        import * as z from 'zod';
        z.string().nullish().describe('x');
      `,
    },
    {
      name: 'nested inside an object schema',
      code: dedent`
        import * as z from 'zod';
        z.object({ foo: z.string().optional().nullable() });
      `,
      errors: [{ messageId: 'preferNullish' }],
      output: dedent`
        import * as z from 'zod';
        z.object({ foo: z.string().nullish() });
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string } from 'zod';
        string().optional().nullable();
      `,
      errors: [{ messageId: 'preferNullish' }],
      output: dedent`
        import { string } from 'zod';
        string().nullish();
      `,
    },
  ],
});
