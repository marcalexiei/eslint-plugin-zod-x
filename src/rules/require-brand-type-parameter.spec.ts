import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { requireBrandTypeParameter } from './require-brand-type-parameter.js';

const ruleTester = new RuleTester();

ruleTester.run('require-brand-type-parameter', requireBrandTypeParameter, {
  valid: [
    {
      name: 'correct usage',
      code: dedent`
        import * as z from 'zod'
        z.string().min(1).brand<"aaa">();
      `,
    },
    {
      name: 'correct usage (named)',
      code: dedent`
        import { string } from 'zod'
        string().min(1).brand<"aaa">();
      `,
    },
    {
      name: 'no error on other brand function',
      code: dedent`
        import * as z from 'zod'
        another.brand();
      `,
    },
    {
      // this would issue a typescript error eventually
      name: 'brand with multiple type parameters',
      code: dedent`
        import * as z from 'zod'
        z.string().brand<"id", "unique">();
      `,
    },
    {
      name: 'complex chain with brand',
      code: dedent`
        import * as z from 'zod'
        z.string().min(1).max(10).email().brand<"email">();
      `,
    },
    {
      name: 'brand with complex type parameter',

      code: dedent`
        import * as z from 'zod'
        z.string().brand<\`$\{string}Id\`>();
      `,
    },
  ],

  invalid: [
    {
      name: 'invalid',
      code: dedent`
        import * as z from 'zod';
        z.string().min(1).brand();
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import * as z from 'zod';
                z.string().min(1);
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'invalid (named)',
      code: dedent`
        import { string } from 'zod';
        string().min(1).brand();
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import { string } from 'zod';
                string().min(1);
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'brand without type parameter in complex chain',
      code: dedent`
        import * as z from 'zod';
        z.string().min(1).max(10).email().brand()
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import * as z from 'zod';
                z.string().min(1).max(10).email()
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'brand without type parameter not as last method',
      code: dedent`
        import * as z from 'zod';
        z.string().min(1).brand().max(2)
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import * as z from 'zod';
                z.string().min(1).max(2)
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'brand without type parameter not as last method (named)',
      code: dedent`
        import { string } from 'zod';
        string().min(1).brand().max(2)
      `,
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: dedent`
                import { string } from 'zod';
                string().min(1).max(2)
              `,
            },
          ],
        },
      ],
    },
  ],
});
