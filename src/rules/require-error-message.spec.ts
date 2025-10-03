import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireErrorMessage } from './require-error-message.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-strict-object (refine)', requireErrorMessage, {
  valid: [
    {
      name: 'object with error property',
      code: 'z.string().refine(() => true, { error: "error msg" })',
    },
    {
      name: 'string error message',
      code: 'z.string().refine(() => true, "error msg")',
    },
    {
      name: 'function error',
      code: 'z.string().refine(() => true, { error: () => "ciao" })',
    },
    {
      name: 'chained method after refine with error message',
      code: 'z.string().refine(() => true, { error: "error msg 2" }).trim()',
    },
  ],

  invalid: [
    {
      name: 'missing error message parameter',
      code: 'z.string().refine(() => true)',
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'object without error message',
      code: 'z.string().refine(() => true, { abort: true })',
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      code: 'z.string().refine(() => true, { message: "hello" })',
      errors: [{ messageId: 'preferError' }],
      output: 'z.string().refine(() => true, { error: "hello" })',
    },
    {
      code: 'z.string().refine(() => true, { message: "hello", error: "hello" })',
      errors: [{ messageId: 'removeMessage' }],
      output: 'z.string().refine(() => true, {  error: "hello" })',
    },
  ],
});

ruleTester.run('prefer-strict-object (custom)', requireErrorMessage, {
  valid: [
    {
      name: 'object with error property',
      code: 'z.custom(() => true, { error: "hello there" })',
    },
    {
      name: 'string error message',
      code: 'z.custom(() => true, "error msg")',
    },
    {
      name: 'chained method after refine with error message',
      code: 'z.custom(() => true, { error: "error msg 2" }).trim()',
    },
  ],

  invalid: [
    {
      name: 'missing error message parameter',
      code: 'z.custom(() => true)',
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'object without error message',
      code: 'z.custom(() => true, { abort: true })',
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
  ],
});
