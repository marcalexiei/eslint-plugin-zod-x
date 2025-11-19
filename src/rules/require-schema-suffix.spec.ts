import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { requireSchemaSuffix } from './require-schema-suffix.js';

const ruleTester = new RuleTester();

ruleTester.run('require-schema-suffix', requireSchemaSuffix, {
  valid: [
    {
      name: 'valid usage',
      code: dedent`
        import * as z from 'zod';
        const mySchema = z.string();
      `,
    },
    {
      name: 'valid usage with multiple declarations',
      code: dedent`
        import * as z from 'zod';
        const mySchema = z.string(), addressSchema = z.object({ street: z.string() });
      `,
    },
    {
      name: 'with parse()',
      code: dedent`
        import * as z from 'zod';
        const value = z.string().parse("asd")
      `,
    },
    {
      name: 'with parse() (named)',
      code: dedent`
        import { string } from 'zod';
        const value = string().parse("asd")
      `,
    },
    {
      name: 'Custom suffix',
      code: dedent`
        import * as z from 'zod';
        const myVar = z.string()
      `,
      options: [{ suffix: 'Var' }],
    },
    {
      name: 'ignores non-zod',
      code: dedent`
        import * as z from 'zod';
        const myVar = 1
      `,
    },
    {
      name: 'ignores z.codec',
      code: dedent`
        import * as z from 'zod';
        const stringToDate = z.codec(
          z.iso.datetime(),
          z.date(),
          {
            decode: (isoString) => new Date(isoString),
            encode: (date) => date.toISOString(),
          }
        );
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/71
      name: 'should handle methods after parsing methods',
      code: dedent`
        import * as z from 'zod';
        const data1 = z.array(z.string()).parse([]).filter(() => true)
        const data2 = z.array(z.string()).safeParse([]).filter(() => true)
        const data3 = z.array(z.string()).encode([]).filter(() => true)
        const data4 = z.array(z.string()).decode([]).filter(() => true)
        const data5 = z.array(z.string()).safeEncode([]).filter(() => true)
        const data6 = z.array(z.string()).safeDecode([]).filter(() => true)
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/71
      name: 'should handle properties after `safeParse`',
      code: dedent`
        import * as z from 'zod';
        const data = z.array(z.string()).safeParse([]).success
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/71
      name: 'should handle methods after spa (alias for safeParseAsync)',
      code: dedent`
        import * as z from 'zod';
        const data = z.array(z.string()).spa([]).then(result => result.success)
      `,
    },
  ],

  invalid: [
    {
      code: dedent`
        import * as z from 'zod';
        const myVar = z.string();
      `,
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: 'Schema' } }],
      output: dedent`
        import * as z from 'zod';
        const myVarSchema = z.string();
      `,
    },
    {
      code: dedent`
        import { string } from 'zod';
        const myVar = string();
      `,
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: 'Schema' } }],
      output: dedent`
        import { string } from 'zod';
        const myVarSchema = string();
      `,
    },
    {
      code: dedent`
        import { string } from 'zod';
        const myVar = string().min(1);
      `,
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: 'Schema' } }],
      output: dedent`
        import { string } from 'zod';
        const myVarSchema = string().min(1);
      `,
    },
    {
      name: 'handle schema with chained methods',
      code: dedent`
        import * as z from 'zod';
        const myVar = z.string().min(1);
      `,
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: 'Schema' } }],
      output: dedent`
        import * as z from 'zod';
        const myVarSchema = z.string().min(1);
      `,
    },
    {
      name: 'handle schema with chained methods (named)',
      code: dedent`
        import { string } from 'zod';
        const myVar = string().min(1);
      `,
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: 'Schema' } }],
      output: dedent`
        import { string } from 'zod';
        const myVarSchema = string().min(1);
      `,
    },
    {
      name: 'handle snake_case suffix',
      code: dedent`
        import * as z from 'zod';
        const my_string = z.string()
      `,
      options: [{ suffix: '_schema' }],
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: '_schema' } }],
      output: dedent`
        import * as z from 'zod';
        const my_string_schema = z.string()
      `,
    },
    {
      name: 'handle snake_case suffix (named)',
      code: dedent`
        import { string } from 'zod';
        const my_string = string();
      `,
      options: [{ suffix: '_schema' }],
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: '_schema' } }],
      output: dedent`
        import { string } from 'zod';
        const my_string_schema = string();
      `,
    },
  ],
});
