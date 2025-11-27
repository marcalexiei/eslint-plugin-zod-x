import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferMeta } from './prefer-meta.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-meta', preferMeta, {
  valid: [
    {
      name: 'valid usage',
      code: dedent`
        import * as z from 'zod';
        z.string().meta({ description: "desc" });
      `,
    },
    {
      name: 'valid usage (named)',
      code: dedent`
        import { string } from 'zod';
        string().meta({ description: "desc" });
      `,
    },
    {
      name: 'valid usage (not last method)',
      code: dedent`
        import * as z from 'zod';
        z.string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'valid usage (not last method) (named)',
      code: dedent`
        import { string } from 'zod';
        string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'No meta... no error',
      code: dedent`
        import * as z from 'zod';
        z.string().min(5).max(10);;
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/121
      name: 'ignores non-zod describe methods',
      code: `
        import { test } from "@playwright/test";
        test.describe("test", () => {});
      `,
    },
  ],

  invalid: [
    {
      name: 'describe with string',
      code: dedent`
        import * as z from 'zod';
        z.string().describe("desc").trim();
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod';
        z.string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'describe with string (named)',
      code: dedent`
        import { string } from 'zod';
        string().describe("desc").trim();
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import { string } from 'zod';
        string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'describe with literal',
      code: dedent`
        import * as z from 'zod';
        const desc = 'desc';
        z.string().describe(\`desc\${desc}\`).trim();
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod';
        const desc = 'desc';
        z.string().meta({ description: \`desc\${desc}\` }).trim();
      `,
    },
    {
      name: 'describe with variable',
      code: dedent`
        import * as z from 'zod';
        const desc = 'desc';
        z.string().describe(desc).trim()
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod';
        const desc = 'desc';
        z.string().meta({ description: desc }).trim()
      `,
    },
  ],
});
