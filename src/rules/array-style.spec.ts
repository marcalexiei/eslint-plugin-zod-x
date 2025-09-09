import { RuleTester } from '@typescript-eslint/rule-tester';

import { arrayStyle } from './array-style.js';

const ruleTester = new RuleTester({});

ruleTester.run('array-style', arrayStyle, {
  valid: [
    {
      name: 'default option',
      code: `z.array(z.string())`,
    },
    {
      name: '`function` option',
      code: `z.array(z.string())`,
      options: [{ style: 'function' }],
    },
    {
      name: '`method` option',
      code: `z.string().array()`,
      options: [{ style: 'method' }],
    },
  ],
  invalid: [
    {
      code: `z.string().array()`,
      options: [{ style: 'function' }],
      errors: [{ messageId: 'useFunction' }],
      output: `z.array(z.string())`,
    },
    {
      code: `z.string().trim().array()`,
      options: [{ style: 'function' }],
      errors: [{ messageId: 'useFunction' }],
      output: `z.array(z.string().trim())`,
    },
    {
      code: `z.array(z.string())`,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: `z.string().array()`,
    },
    {
      code: `z.array(z.string().trim())`,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: `z.string().trim().array()`,
    },
  ],
});
