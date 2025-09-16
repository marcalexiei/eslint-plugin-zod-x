import { RuleTester } from '@typescript-eslint/rule-tester';

import { noAny } from './no-any.js';

const ruleTester = new RuleTester();

ruleTester.run('no-z-any', noAny, {
  valid: [
    { code: 'const schema = z.string();' },
    { code: 'const schema = z.number();' },
    { code: 'const schema = z.object({ name: z.string() });' },
  ],
  invalid: [
    {
      code: 'const schema = z.any();',
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            { messageId: 'useUnknown', output: 'const schema = z.unknown();' },
          ],
        },
      ],
    },
    {
      code: 'const schema = z.object({ prop: z.any() });',
      errors: [
        {
          messageId: 'noZAny',
          suggestions: [
            {
              messageId: 'useUnknown',
              output: 'const schema = z.object({ prop: z.unknown() });',
            },
          ],
        },
      ],
    },
  ],
});
