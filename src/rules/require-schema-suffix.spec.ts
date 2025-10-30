import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireSchemaSuffix } from './require-schema-suffix.js';

const ruleTester = new RuleTester();

ruleTester.run('require-schema-suffix', requireSchemaSuffix, {
  valid: [
    {
      name: 'valid usage',
      code: 'const mySchema = z.string()',
    },
    {
      name: 'valid usage with multiple declarations',
      code: 'const mySchema = z.string(), addressSchema = z.object({ street: z.string() });',
    },
    {
      name: 'with parse()',
      code: 'const value = z.string().parse("asd")',
    },
    {
      code: 'const myVar = z.string()',
      options: [{ suffix: 'Var' }],
    },
    {
      name: 'ignores non-zod',
      code: 'const myVar = 1',
    },
    {
      name: 'ignores z.codec',
      code: `
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
      code: `
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
      code: 'const data = z.array(z.string()).safeParse([]).success',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/71
      name: 'should handle methods after spa (alias for safeParseAsync)',
      code: 'const data = z.array(z.string()).spa([]).then(result => result.success)',
    },
  ],

  invalid: [
    {
      code: 'const myVar = z.string()',
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: 'Schema' } }],
      output: 'const myVarSchema = z.string()',
    },
    {
      name: 'handle snake_case suffix',
      code: 'const my_string = z.string()',
      options: [{ suffix: '_schema' }],
      errors: [{ messageId: 'noSchemaSuffix', data: { suffix: '_schema' } }],
      output: 'const my_string_schema = z.string()',
    },
  ],
});
