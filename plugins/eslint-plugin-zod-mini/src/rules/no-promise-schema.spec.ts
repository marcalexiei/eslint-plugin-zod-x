import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noPromiseSchema } from './no-promise-schema.js';

const ruleTester = new RuleTester();

ruleTester.run(noPromiseSchema.name, noPromiseSchema, {
  valid: [
    {
      name: 'namespace import with regular schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.string();
      `,
    },
    {
      name: 'named import with regular schema',
      code: dedent`
        import { string } from 'zod/mini';
        string();
      `,
    },
    {
      name: 'not a zod import',
      code: dedent`
        import * as z from 'something-else';
        z.promise(z.string());
      `,
    },
    {
      name: 'unrelated promise helper',
      code: dedent`
        import promise from 'something-else';
        promise(z.string());
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.promise(z.string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'zod/v4-mini import source',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.promise(z.string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'named import',
      code: dedent`
        import { promise, string } from 'zod/mini';
        promise(string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'aliased named import',
      code: dedent`
        import { promise as zodPromise, string } from 'zod/mini';
        zodPromise(string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'promise schema inside optional wrapper',
      code: dedent`
        import * as z from 'zod/mini';
        z.optional(z.promise(z.string()));
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'promise schema inside object',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({ payload: z.promise(z.string()) });
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
  ],
});
