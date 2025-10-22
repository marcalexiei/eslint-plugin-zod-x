import { RuleTester } from '@typescript-eslint/rule-tester';

import { noNumberSchemaWithInt } from './no-number-schema-with-int.js';

const ruleTester = new RuleTester();

ruleTester.run('no-number-schema-with-int', noNumberSchemaWithInt, {
  valid: [
    {
      name: 'standard',
      code: 'z.int()',
    },
    {
      name: 'standard + chain method',
      code: 'z.int().min(5)',
    },
    {
      name: 'number without .int()',
      code: 'z.number().optional()',
    },
    {
      name: 'unrelated to zod',
      code: 'something.number().int().min(5)',
    },
    {
      name: 'nested valid usage',
      code: 'z.object({ age: z.int(), count: z.number() })',
    },
  ],
  invalid: [
    {
      name: 'number + int',
      code: 'z.number().int()',
      errors: [{ messageId: 'removeNumber' }],
      output: 'z.int()',
    },
    {
      name: 'number + int + other method',
      code: 'z.number().int().min(1)',
      errors: [{ messageId: 'removeNumber' }],
      output: 'z.int().min(1)',
    },
    {
      name: 'number + other method + int',
      code: 'z.number().min(1).int()',
      errors: [{ messageId: 'removeNumber' }],
      output: 'z.int().min(1)',
    },
    {
      name: 'nested in object',
      code: 'z.object({ age: z.number().int() })',
      errors: [{ messageId: 'removeNumber' }],
      output: 'z.object({ age: z.int() })',
    },
  ],
});
