import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferTupleOverArrayLength } from './prefer-tuple-over-array-length.js';

const ruleTester = new RuleTester();

ruleTester.run(preferTupleOverArrayLength.name, preferTupleOverArrayLength, {
  valid: [
    {
      name: 'already a tuple',
      code: dedent`
        import * as z from 'zod/mini';
        z.tuple([z.string(), z.string()])
      `,
    },
    {
      name: 'array without a length constraint',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string())
      `,
    },
    {
      name: 'check without a length constraint',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.refine(() => true))
      `,
    },
    {
      name: 'length constraint on a non-array schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(2))
      `,
    },
    {
      name: 'not a zod import',
      code: dedent`
        import { array } from 'not-zod';
        array(string()).check(length(2))
      `,
    },
  ],
  invalid: [
    {
      name: 'check(z.length()) autofixes to a tuple',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.length(2))
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.tuple([z.string(), z.string()])
      `,
    },
    {
      name: 'length(0) autofixes to an empty tuple',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.length(0))
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.tuple([])
      `,
    },
    {
      name: 'preserves trailing chain methods',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.length(2)).brand('Pair')
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.tuple([z.string(), z.string()]).brand('Pair')
      `,
    },
    {
      name: 'namespace import different from z',
      code: dedent`
        import * as zod from 'zod/mini';
        zod.array(zod.string()).check(zod.length(2))
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: dedent`
        import * as zod from 'zod/mini';
        zod.tuple([zod.string(), zod.string()])
      `,
    },
    {
      name: 'nested inside an object schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({
          pair: z.array(z.string()).check(z.length(2)),
        });
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.object({
          pair: z.tuple([z.string(), z.string()]),
        });
      `,
    },
    {
      name: 'minLength() is report-only (no autofix)',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.minLength(2))
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: null,
    },
    {
      name: 'maxLength() is report-only (no autofix)',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.maxLength(5))
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: null,
    },
    {
      name: 'sibling checks are report-only (no autofix)',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.minLength(1), z.length(2))
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: null,
    },
    {
      name: 'non-literal length is report-only (no autofix)',
      code: dedent`
        import * as z from 'zod/mini';
        const n = 2;
        z.array(z.string()).check(z.length(n))
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: null,
    },
    {
      name: 'named import is report-only (no autofix)',
      code: dedent`
        import { array, string, length } from 'zod/mini';
        array(string()).check(length(2))
      `,
      errors: [{ messageId: 'preferTuple' }],
      output: null,
    },
  ],
});
