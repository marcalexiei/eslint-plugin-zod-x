import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noEmptyCustomSchema } from './no-empty-custom-schema.js';

const ruleTester = new RuleTester();

ruleTester.run('no-empty-custom-schema', noEmptyCustomSchema, {
  valid: [
    {
      name: 'valid usage',
      code: dedent`
        import * as z from 'zod';
        z.custom((val) => typeof val === "string" ? /^\\d+px$/.test(val) : false);
      `,
    },
    {
      name: 'valid usage (named)',
      code: dedent`
        import { custom } from 'zod';
        custom((val) => typeof val === "string" ? /^\\d+px$/.test(val) : false);
      `,
    },
    {
      name: 'valid usage (named renamed)',
      code: dedent`
        import { custom as zCustom } from 'zod';
        zCustom((val) => typeof val === "string" ? /^\\d+px$/.test(val) : false);
      `,
    },
    {
      name: 'type and function',
      code: dedent`
        import * as z from 'zod';
        z.custom<\`\${number}px\`>((val) => {
          return typeof val === "string" ? /^\\d+px$/.test(val) : false;
        });
      `,
    },
    {
      name: 'type and function (named)',
      code: dedent`
        import { custom } from 'zod';
        custom<\`\${number}px\`>((val) => {
          return typeof val === "string" ? /^\\d+px$/.test(val) : false;
        });
      `,
    },
  ],
  invalid: [
    {
      name: 'invalid usage',
      code: dedent`
        import * as z from 'zod';
        z.custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'invalid usage (named)',
      code: dedent`
        import { custom } from 'zod';
        custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'type without function',
      code: dedent`
        import * as z from 'zod';
        z.custom<\`\${number}px\`>();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'type without function (named)',
      code: dedent`
        import { custom } from 'zod';
        custom<\`\${number}px\`>();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
  ],
});
