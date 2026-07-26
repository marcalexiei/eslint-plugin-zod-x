import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferEnumOverLiteralUnion } from './prefer-enum-over-literal-union.js';

const ruleTester = new RuleTester();

ruleTester.run(preferEnumOverLiteralUnion.name, preferEnumOverLiteralUnion, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'union with a non-literal element',
      code: dedent`
        import * as z from 'zod/mini';
        z.union([z.literal('foo'), z.literal('bar'), z.int()])
      `,
    },
    {
      name: 'should error only for literal strings',
      code: dedent`
        import * as z from 'zod/mini';
        z.union([z.literal('foo'), z.literal(5)])
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), z.literal('bar')])
      `,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      code: dedent`
        import * as z from 'zod/mini';
        z.union([z.string(), z.number()])
      `,
    },
    {
      code: dedent`
        import * as z from 'zod/mini';
        z.looseObject({
          modifiedTime: z.optional(z.string()),
          size: z.union([z.string(), z.number()]),
        });
      `,
    },
    {
      name: 'computed union access yields no walkable chain',
      code: dedent`
        import * as z from 'zod/mini';
        z['union']([z.literal('foo'), z.literal('bar')]);
      `,
    },
    {
      name: 'members passed through a variable instead of an array literal',
      code: dedent`
        import * as z from 'zod/mini';
        const members = [z.literal('foo'), z.literal('bar')] as const;
        z.union(members);
      `,
    },
    {
      name: 'sparse member array',
      code: dedent`
        import * as z from 'zod/mini';
        z.union([z.literal('foo'), , z.literal('bar')]);
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.union([z.literal('foo'), z.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'namespace import (keeps original string format)',
      code: dedent`
        import * as z from 'zod/mini';
        z.union([z.literal("foo"), z.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.enum(["foo", 'bar'])
      `,
    },
    {
      name: 'namespace import different from z',
      code: dedent`
        import * as zod from 'zod/mini';
        zod.union([zod.literal('foo'), zod.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as zod from 'zod/mini';
        zod.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { union, literal } from 'zod/mini';
        union([literal('foo'), literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: null,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        z.union([z.literal('foo'), z.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import { z } from 'zod/mini';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.union([z.literal('foo'), z.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/v4-mini';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'with check method (namespace import)',
      code: dedent`
        import * as z from 'zod/mini';
        z.union([z.literal('foo'), z.literal('bar')]).check(z.refine(() => true));
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.enum(['foo', 'bar']).check(z.refine(() => true));
      `,
    },
    {
      name: 'nested (namespace import)',
      code: dedent`
        import * as z from 'zod/mini';
        z.looseObject({
          size: z.union([z.literal('foo'), z.literal('bar')]),
        });
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.looseObject({
          size: z.enum(['foo', 'bar']),
        });
      `,
    },
  ],
});
