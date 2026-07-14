import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noConflictingChecks } from './no-conflicting-checks.js';

const ruleTester = new RuleTester();

ruleTester.run(noConflictingChecks.name, noConflictingChecks, {
  valid: [
    {
      name: 'compatible string bounds',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(1), z.maxLength(10));
      `,
    },
    {
      name: 'compatible number checks',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.gt(0), z.multipleOf(2));
      `,
    },
    {
      name: 'gte and lte with the same value match exactly that value',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.gte(5), z.lte(5));
      `,
    },
    {
      name: 'one prefix extending the other',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.startsWith('a'), z.startsWith('abc'));
      `,
    },
    {
      name: 'unknown check arguments are ignored',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true), z.minLength(2));
      `,
    },
    {
      name: 'either format via a union is intentional',
      code: dedent`
        import * as z from 'zod/mini';
        z.union([z.uuid(), z.email()]);
      `,
    },
    {
      name: 'non-literal bounds are not analyzed',
      code: dedent`
        import * as z from 'zod/mini';
        declare const n: number;
        z.string().check(z.minLength(n), z.maxLength(2));
      `,
    },
    {
      name: 'not a zod import',
      code: dedent`
        import { string, minLength, maxLength } from 'not-zod';
        string().check(minLength(4), maxLength(2));
      `,
    },
    {
      name: 'computed-member format factory is not analyzed (no crash)',
      code: dedent`
        import * as z from 'zod/mini';
        z['uuid']();
      `,
    },
    {
      name: 'computed-member literal factory is not analyzed (no crash)',
      code: dedent`
        import * as z from 'zod/mini';
        z['literal']('foo');
      `,
    },
    {
      name: 'impossible cases can be disabled',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.gt(10), z.lt(5));
      `,
      options: [{ checkImpossibleCases: false }],
    },
    {
      name: 'confusing cases can be disabled',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(1), z.minLength(3));
      `,
      options: [{ checkConfusingCases: false }],
    },
    {
      name: 'inapplicable checks can be disabled',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.minLength(1));
      `,
      options: [{ checkInapplicableChecks: false }],
    },
  ],
  invalid: [
    {
      name: 'empty number range in one check',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.gt(10), z.lt(5));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'length min greater than max in one check',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(4), z.maxLength(2));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'empty bigint range with mixed number/bigint literals (plain JS)',
      code: dedent`
        import * as z from 'zod/mini';
        z.bigint().check(z.gt(5n), z.lte(5));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'length bounds conflicting across separate checks',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.minLength(4)).check(z.maxLength(2));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'mutually exclusive string formats',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.url(), z.email());
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'mutually exclusive ip formats',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.ipv4(), z.ipv6());
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'mutually exclusive iso formats',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.iso.date(), z.iso.time());
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'format conflicting with a length bound',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.ipv4(), z.maxLength(3));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'format factory conflicting with a length bound',
      code: dedent`
        import * as z from 'zod/mini';
        z.uuid().check(z.maxLength(1));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'literal shorter than a minimum length',
      code: dedent`
        import * as z from 'zod/mini';
        z.literal('foo').check(z.minLength(4));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'literal longer than a maximum length',
      code: dedent`
        import * as z from 'zod/mini';
        z.literal('foo').check(z.maxLength(2));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'literal contradicting a prefix',
      code: dedent`
        import * as z from 'zod/mini';
        z.literal('foo').check(z.startsWith('bar'));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'number literal outside a bound',
      code: dedent`
        import * as z from 'zod/mini';
        z.literal(5).check(z.gt(10));
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'number literal contradicting a sign check',
      code: dedent`
        import * as z from 'zod/mini';
        z.literal(5).check(z.negative());
      `,
      errors: [{ messageId: 'impossibleCase' }],
    },
    {
      name: 'literal already satisfying a check is pointless',
      code: dedent`
        import * as z from 'zod/mini';
        z.literal('foo').check(z.minLength(2));
      `,
      errors: [{ messageId: 'pointlessCheck' }],
    },
    {
      name: 'number literal already satisfying a sign check is pointless',
      code: dedent`
        import * as z from 'zod/mini';
        z.literal(42).check(z.positive());
      `,
      errors: [{ messageId: 'pointlessCheck' }],
    },
    {
      name: 'checking unknown defeats its purpose',
      code: dedent`
        import * as z from 'zod/mini';
        z.unknown().check(z.uuid());
      `,
      errors: [{ messageId: 'pointlessCheck' }],
    },
    {
      name: 'checking any defeats its purpose',
      code: dedent`
        import * as z from 'zod/mini';
        z.any().check(z.email());
      `,
      errors: [{ messageId: 'pointlessCheck' }],
    },
    {
      name: 'never already matches nothing',
      code: dedent`
        import * as z from 'zod/mini';
        z.never().check(z.uuid());
      `,
      errors: [{ messageId: 'pointlessCheck' }],
    },
    {
      name: 'weaker minimum length is redundant',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(1), z.minLength(3));
      `,
      errors: [{ messageId: 'redundantCheck' }],
    },
    {
      name: 'lowercase combined with uppercase',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.lowercase(), z.uppercase());
      `,
      errors: [{ messageId: 'confusingCombination' }],
    },
    {
      name: 'length check on a number schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.minLength(1));
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'string content check on a number schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.startsWith('a'));
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'format check on a number schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.uuid());
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'sign check on a string schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.positive());
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'sign check on an array schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.array(z.string()).check(z.positive());
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'length check on a boolean schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.boolean().check(z.minLength(1));
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'format check on a date schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.date().check(z.email());
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'length check on a bigint schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.bigint().check(z.minLength(1));
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'format check on a number sub-type schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.int32().check(z.email());
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'length check on a stringbool schema (boolean output)',
      code: dedent`
        import * as z from 'zod/mini';
        z.stringbool().check(z.minLength(1));
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'sign check on an object schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({}).check(z.positive());
      `,
      errors: [{ messageId: 'inapplicableCheck' }],
    },
    {
      name: 'several problems in one chain are all reported',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.maxLength(1), z.uuid(), z.email()).check(z.positive());
      `,
      errors: [
        { messageId: 'impossibleCase' },
        { messageId: 'impossibleCase' },
        { messageId: 'inapplicableCheck' },
      ],
    },
  ],
});
