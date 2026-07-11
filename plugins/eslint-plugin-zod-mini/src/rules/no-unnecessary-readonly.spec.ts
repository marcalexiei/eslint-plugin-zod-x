import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noUnnecessaryReadonly } from './no-unnecessary-readonly.js';

const ruleTester = new RuleTester();

ruleTester.run(noUnnecessaryReadonly.name, noUnnecessaryReadonly, {
  valid: [
    {
      name: 'readonly on an object schema is meaningful',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.object({ a: z.string() }));
      `,
    },
    {
      name: 'readonly on an array schema is meaningful',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.array(z.string()));
      `,
    },
    {
      name: 'readonly on a map schema is meaningful',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.map(z.string(), z.number()));
      `,
    },
    {
      name: 'readonly on a schema reference is not analyzed',
      code: dedent`
        import * as z from 'zod/mini';
        const inner = z.object({ a: z.string() });
        z.readonly(inner);
      `,
    },
    {
      name: 'readonly on a pipe is not analyzed',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.pipe(z.string(), z.transform((s) => [s])));
      `,
    },
    {
      name: 'immutable schema without readonly',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(2));
      `,
    },
    {
      name: 'not a zod import',
      code: dedent`
        import { readonly, string } from 'not-zod';
        readonly(string());
      `,
    },
  ],
  invalid: [
    {
      name: 'readonly on a string schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.string());
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.string();
      `,
    },
    {
      name: 'readonly on a string schema with checks keeps the checks',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.string().check(z.minLength(2)));
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(2));
      `,
    },
    {
      name: 'readonly on a date schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.date());
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.date();
      `,
    },
    {
      name: 'readonly on an enum schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.enum(['a', 'b']));
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.enum(['a', 'b']);
      `,
    },
    {
      name: 'readonly on a literal schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.literal('x'));
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.literal('x');
      `,
    },
    {
      name: 'readonly on an optional-wrapped immutable schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.optional(z.string()));
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.optional(z.string());
      `,
    },
    {
      name: 'readonly wrapper keeps its chained methods',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.string()).check(z.minLength(2));
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(2));
      `,
    },
    {
      name: 'doubled readonly on a mutable schema flags only the outer',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.readonly(z.object({ a: z.string() })));
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.object({ a: z.string() }));
      `,
    },
    {
      name: 'doubled readonly on an immutable schema flags both',
      code: dedent`
        import * as z from 'zod/mini';
        z.readonly(z.readonly(z.string()));
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }, { messageId: 'unnecessaryReadonly' }],
      // The inner unwrap overlaps the outer one, so the first fix pass
      // applies only the outer; the second pass converges to `z.string()`.
      output: [
        dedent`
          import * as z from 'zod/mini';
          z.readonly(z.string());
        `,
        dedent`
          import * as z from 'zod/mini';
          z.string();
        `,
      ],
    },
    {
      name: 'readonly nested inside an object schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({ foo: z.readonly(z.string()) });
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.object({ foo: z.string() });
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { readonly, string } from 'zod/mini';
        readonly(string());
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import { readonly, string } from 'zod/mini';
        string();
      `,
    },
  ],
});
