import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { requireBrandTypeParameter } from './require-brand-type-parameter.js';

const ruleTester = new RuleTester();

ruleTester.run(requireBrandTypeParameter.name, requireBrandTypeParameter, {
  valid: [
    {
      name: 'namespace with type parameter',
      code: dedent`
        import * as z from 'zod/mini'
        z.string().brand<"id">();
      `,
    },
    {
      name: 'named import with type parameter',
      code: dedent`
        import { string } from 'zod/mini'
        string().brand<"id">();
      `,
    },
    {
      name: 'named z import with type parameter',
      code: dedent`
        import { z } from 'zod/mini'
        z.string().brand<"id">();
      `,
    },
    {
      name: 'no error on other brand function',
      code: dedent`
        import * as z from 'zod/mini'
        another.brand();
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        z.string().brand();
      `,
    },
    {
      name: 'complex chain',
      code: dedent`
        import * as z from 'zod/mini'
        z.string().check(z.minLength(1), z.maxLength(10)).brand<"email">();
      `,
    },
  ],

  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().brand();
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import * as z from 'zod/mini';
                z.string();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named import',
      code: dedent`
        import { string } from 'zod/mini';
        string().brand();
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import { string } from 'zod/mini';
                string();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        z.string().brand();
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import { z } from 'zod/mini';
                z.string();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.string().brand();
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import * as z from 'zod/v4-mini';
                z.string();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'complex chain without type parameter',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(1)).brand()
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import * as z from 'zod/mini';
                z.string().check(z.minLength(1))
              `,
            },
          ],
        },
      ],
    },
  ],
});
