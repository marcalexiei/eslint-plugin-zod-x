import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireBrandTypeParameter } from './require-brand-type-parameter.js';

const ruleTester = new RuleTester();

ruleTester.run('require-brand-type-parameter', requireBrandTypeParameter, {
  valid: [
    {
      name: 'correct usage',
      code: 'z.string().min(1).brand<"aaa">()',
    },
    {
      name: 'no error on other brand function',
      code: 'another.brand()',
    },
    {
      // this would issue a typescript error eventually
      name: 'brand with multiple type parameters',
      code: 'z.string().brand<"id", "unique">()',
    },
    {
      name: 'complex chain with brand',
      code: 'z.string().min(1).max(10).email().brand<"email">()',
    },
    {
      name: 'brand with complex type parameter',
      // eslint-disable-next-line no-template-curly-in-string
      code: 'z.string().brand<`${string}Id`>()',
    },
  ],

  invalid: [
    {
      code: 'z.string().min(1).brand()',
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: 'z.string().min(1)',
            },
          ],
        },
      ],
    },
    {
      name: 'brand without type parameter in complex chain',
      code: 'z.string().min(1).max(10).email().brand()',
      errors: [
        {
          messageId: 'missingTypeParameter',
          suggestions: [
            {
              messageId: 'removeBrandFunction',
              output: 'z.string().min(1).max(10).email()',
            },
          ],
        },
      ],
    },
  ],
});
