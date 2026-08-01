import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferEnumOverLiteralUnion } from './prefer-enum-over-literal-union.js';

const ruleTester = new RuleTester();

ruleTester.run(preferEnumOverLiteralUnion.name, preferEnumOverLiteralUnion, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'union with a member that is not a call (identifier reference)',
      code: dedent`
        import * as z from 'zod';
        const Other = z.string();
        z.union([z.literal('foo'), Other])
      `,
    },
    {
      name: 'union with a non-literal element',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), z.literal('bar'), z.int()])
      `,
    },
    {
      // https://github.com/gajus/eslint-plugin-zod/issues/6
      name: 'should error only for literal strings',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), z.literal(5)])
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/189
      code: dedent`
        import * as z from 'zod';
        z.union([z.string(), z.number()]).optional()
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/189
      code: dedent`
      import * as z from 'zod';
        z.looseObject({
          modifiedTime: z.string().optional(),
          size: z.union([z.string(), z.number()]).optional(),
        });
      `,
    },
    {
      name: 'computed union access yields no walkable chain',
      code: dedent`
        import * as z from 'zod';
        z['union']([z.literal('foo'), z.literal('bar')]);
      `,
    },
    {
      name: 'members passed through a variable instead of an array literal',
      code: dedent`
        import * as z from 'zod';
        const members = [z.literal('foo'), z.literal('bar')] as const;
        z.union(members);
      `,
    },
    {
      name: 'sparse member array',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), , z.literal('bar')]);
      `,
    },
    {
      name: 'argument-less `z.literal()` — invalid zod, valid JS, must not crash',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal(), z.literal('bar')]);
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), z.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'namespace import (keeps original string format)',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal("foo"), z.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod';
        z.enum(["foo", 'bar'])
      `,
    },
    {
      name: 'namespace import different from z',
      code: dedent`
        import * as zod from 'zod';
        zod.union([zod.literal('foo'), zod.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as zod from 'zod';
        zod.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { union, literal } from 'zod';
        union([literal('foo'), literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: null,
    },
    {
      name: 'with chain method (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), z.literal('bar')]).optional();
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod';
        z.enum(['foo', 'bar']).optional();
      `,
    },
    {
      name: 'nested (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.looseObject({
          size: z.union([z.literal('foo'), z.literal('bar')]),
        });
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod';
        z.looseObject({
          size: z.enum(['foo', 'bar']),
        });
      `,
    },
    {
      name: 'nested with method (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.looseObject({
          size: z.union([z.literal('foo'), z.literal('bar')]).optional(),
        });
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod';
        z.looseObject({
          size: z.enum(['foo', 'bar']).optional(),
        });
      `,
    },
  ],
});
