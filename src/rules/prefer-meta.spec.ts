import { RuleTester } from '@typescript-eslint/rule-tester';

import { preferMeta } from './prefer-meta.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-namespace-import', preferMeta, {
  valid: [
    {
      name: 'Correct usage',
      code: `z.string().meta({ description: 'desc' })`,
    },
  ],

  invalid: [
    {
      name: 'describe with string',
      code: `z.string().describe('desc').trim()`,
      errors: [{ messageId: 'preferMeta' }],
      output: `z.string().meta({ description: 'desc' }).trim()`,
    },
    {
      name: 'describe with literal',
      code: `
        const desc = 'desc';
        z.string().describe(\`desc\${desc}\`).trim();
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: `
        const desc = 'desc';
        z.string().meta({ description: \`desc\${desc}\` }).trim();
      `,
    },
    {
      name: 'describe with variable',
      code: `
        const desc = 'desc';
        z.string().describe(desc).trim()
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: `
        const desc = 'desc';
        z.string().meta({ description: desc }).trim()
      `,
    },
  ],
});
