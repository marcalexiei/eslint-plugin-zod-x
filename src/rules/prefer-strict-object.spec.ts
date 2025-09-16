import { RuleTester } from '@typescript-eslint/rule-tester';

import { preferStrictObjet } from './prefer-strict-object.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-strict-object', preferStrictObjet, {
  valid: [
    {
      name: 'Correct usage',
      code: 'z.strictObject()',
    },
    {
      name: 'Correct usage with allow `object`',
      options: [{ allow: ['object'] }],
      code: 'z.object()',
    },
    {
      name: 'Correct usage with allow `looseObject`',
      options: [{ allow: ['looseObject'] }],
      code: 'z.looseObject()',
    },
  ],

  invalid: [
    {
      name: 'object',
      code: 'z.object({ foo: "bar" })',
      errors: [{ messageId: 'useStrictObject', data: { method: 'object' } }],
      output: null,
    },
    {
      name: 'looseObject',
      code: 'z.looseObject({ foo: "bar" })',
      errors: [
        { messageId: 'useStrictObject', data: { method: 'looseObject' } },
      ],
      output: null,
    },
  ],
});
