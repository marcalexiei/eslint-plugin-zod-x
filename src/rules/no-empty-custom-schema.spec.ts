import { RuleTester } from '@typescript-eslint/rule-tester';

import { noEmptyCustomSchema } from './no-empty-custom-schema.js';

const ruleTester = new RuleTester();

ruleTester.run('no-empty-custom-schema', noEmptyCustomSchema, {
  valid: [
    {
      name: 'valid usage',
      code: 'z.custom((val) => typeof val === "string" ? /^\\d+px$/.test(val) : false);',
    },
    {
      name: 'type and function',
      code: `
        z.custom<\`\${number}px\`>((val) => {
          return typeof val === "string" ? /^\\d+px$/.test(val) : false;
        });
      `,
    },
  ],
  invalid: [
    {
      name: 'invalid usage',
      code: 'z.custom();',
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'type without function',
      code: `z.custom<\`\${number}px\`>();`,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
  ],
});
