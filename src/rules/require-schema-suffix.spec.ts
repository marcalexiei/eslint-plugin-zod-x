import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireSchemaSuffix } from './require-schema-suffix.js';

const ruleTester = new RuleTester();

ruleTester.run('require-schema-suffix', requireSchemaSuffix, {
  valid: [
    {
      code: 'const mySchema = z.string()',
    },
    {
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
      name: 'Ignore non-zod',
      code: 'const myVar = 1',
    },
    {
      name: 'Ignore z.codec',
      code: `const stringToDate = z.codec(
              z.iso.datetime(),
              z.date(),
              {
                decode: (isoString) => new Date(isoString),
                encode: (date) => date.toISOString(),
              }
            );`,
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
