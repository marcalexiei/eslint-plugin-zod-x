import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noUnnecessaryReadonly } from './no-unnecessary-readonly.js';

const ruleTester = new RuleTester();

ruleTester.run(noUnnecessaryReadonly.name, noUnnecessaryReadonly, {
  valid: [
    {
      name: 'readonly on an object schema is meaningful',
      code: dedent`
        import * as z from 'zod';
        z.object({ a: z.string() }).readonly();
      `,
    },
    {
      name: 'readonly on an array schema is meaningful',
      code: dedent`
        import * as z from 'zod';
        z.array(z.string()).readonly();
      `,
    },
    {
      name: 'readonly on a chained array() is meaningful',
      code: dedent`
        import * as z from 'zod';
        z.string().array().readonly();
      `,
    },
    {
      name: 'readonly on a map schema is meaningful',
      code: dedent`
        import * as z from 'zod';
        z.map(z.string(), z.number()).readonly();
      `,
    },
    {
      name: 'readonly after a transform is not analyzed',
      code: dedent`
        import * as z from 'zod';
        z.string().transform((s) => [s]).readonly();
      `,
    },
    {
      name: 'immutable schema without readonly',
      code: dedent`
        import * as z from 'zod';
        z.string().min(2);
      `,
    },
    {
      name: 'not a zod import',
      code: dedent`
        import { string } from 'not-zod';
        string().readonly();
      `,
    },
    {
      name: 'computed factory with a type-changing method — the chain walker cannot see `.transform()`',
      code: dedent`
        import * as z from 'zod';
        z['string']().transform((s) => [s]).readonly();
      `,
    },
  ],
  invalid: [
    {
      name: 'readonly on a string schema',
      code: dedent`
        import * as z from 'zod';
        z.string().readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.string();
      `,
    },
    {
      name: 'readonly on a number schema keeps its checks',
      code: dedent`
        import * as z from 'zod';
        z.number().min(2).readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.number().min(2);
      `,
    },
    {
      name: 'readonly on a date schema',
      code: dedent`
        import * as z from 'zod';
        z.date().readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.date();
      `,
    },
    {
      name: 'readonly on an enum schema',
      code: dedent`
        import * as z from 'zod';
        z.enum(['a', 'b']).readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.enum(['a', 'b']);
      `,
    },
    {
      name: 'readonly on a literal schema',
      code: dedent`
        import * as z from 'zod';
        z.literal('x').readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.literal('x');
      `,
    },
    {
      name: 'readonly on a top-level string format schema',
      code: dedent`
        import * as z from 'zod';
        z.creditCard().readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.creditCard();
      `,
    },
    {
      name: 'readonly in the middle of a chain keeps trailing methods',
      code: dedent`
        import * as z from 'zod';
        z.string().readonly().optional();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.string().optional();
      `,
    },
    {
      name: 'doubled readonly on a mutable schema flags only the second',
      code: dedent`
        import * as z from 'zod';
        z.object({ a: z.string() }).readonly().readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.object({ a: z.string() }).readonly();
      `,
    },
    {
      name: 'doubled readonly on an immutable schema flags both',
      code: dedent`
        import * as z from 'zod';
        z.string().readonly().readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }, { messageId: 'unnecessaryReadonly' }],
      // The two removals touch, so the first fix pass applies only one;
      // the second pass converges to `z.string()`.
      output: [
        dedent`
          import * as z from 'zod';
          z.string().readonly();
        `,
        dedent`
          import * as z from 'zod';
          z.string();
        `,
      ],
    },
    {
      name: 'readonly nested inside an object schema',
      code: dedent`
        import * as z from 'zod';
        z.object({ foo: z.string().readonly() });
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import * as z from 'zod';
        z.object({ foo: z.string() });
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string } from 'zod';
        string().readonly();
      `,
      errors: [{ messageId: 'unnecessaryReadonly' }],
      output: dedent`
        import { string } from 'zod';
        string();
      `,
    },
  ],
});
