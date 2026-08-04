import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferMeta } from './prefer-meta.js';

const ruleTester = new RuleTester();

ruleTester.run(preferMeta.name, preferMeta, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.meta({ description: "desc" }));
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string, meta } from 'zod/mini';
        string().check(meta({ description: "desc" }));
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        z.string().check(z.meta({ description: "desc" }));
      `,
    },
    {
      name: 'no describe call',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(5));
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        z.string().describe("desc");
      `,
    },
    {
      name: 'ignores non-zod describe methods',
      code: dedent`
        import { test } from "@playwright/test";
        test.describe("test", () => {});
      `,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.string().check(z.meta({ description: "desc" }));
      `,
    },
  ],

  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.describe("desc"));
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.meta({ description: "desc" }));
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string, describe } from 'zod/mini';
        string().check(describe("desc"));
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: null,
    },
    {
      name: 'computed factory — reported without a fix, renaming the key would emit `z[meta]`',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z['describe']("desc"));
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: null,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        z.string().check(z.describe("desc"));
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import { z } from 'zod/mini';
        z.string().check(z.meta({ description: "desc" }));
      `,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.string().check(z.describe("desc"));
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod/v4-mini';
        z.string().check(z.meta({ description: "desc" }));
      `,
    },
    {
      name: 'with template literal',
      code: dedent`
        import * as z from 'zod/mini';
        const desc = 'desc';
        z.string().check(z.describe(\`desc\${desc}\`));
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod/mini';
        const desc = 'desc';
        z.string().check(z.meta({ description: \`desc\${desc}\` }));
      `,
    },
  ],
});
