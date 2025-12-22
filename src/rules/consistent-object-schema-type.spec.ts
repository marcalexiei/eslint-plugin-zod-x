import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { consistentObjectSchemaType } from './consistent-object-schema-type.js';

const ruleTester = new RuleTester();

ruleTester.run('consistent-object-schema-type', consistentObjectSchemaType, {
  valid: [
    {
      name: 'correct usage',
      code: dedent`
        import * as z from 'zod';
        z.object({})
      `,
    },
    {
      name: 'correct usage (named)',
      code: dedent`
        import { object } from 'zod';
        object({})
      `,
    },
    {
      name: 'nested',
      options: [{ allow: ['looseObject', 'strictObject'] }],
      code: dedent`
        import * as z from 'zod';
        z.looseObject({ test: z.strictObject({}) })
      `,
    },
    {
      name: 'nested (named)',
      options: [{ allow: ['looseObject', 'strictObject'] }],
      code: dedent`
        import { looseObject, strictObject } from 'zod';
        looseObject({ test: strictObject({}) })
      `,
    },
  ],
  invalid: [
    {
      name: 'invalid usage',
      code: dedent`
        import * as z from 'zod';
        z.looseObject({})
      `,
      errors: [
        {
          messageId: 'consistentMethod',
          data: { actual: 'looseObject', allowedList: 'object' },
          suggestions: [
            {
              messageId: 'useMethod',
              data: { expected: 'object' },
              output: dedent`
                import * as z from 'zod';
                z.object({})
              `,
            },
          ],
        },
      ],
      output: null,
    },
    {
      name: 'invalid usage (named)',
      code: dedent`
        import { looseObject } from 'zod';
        looseObject()
      `,
      errors: [
        {
          messageId: 'consistentMethod',
          data: { actual: 'looseObject', allowedList: 'object' },
        },
      ],
      output: null,
    },
    {
      name: 'nested looseObject',
      code: dedent`
        import * as z from 'zod';
        z.object({ test: z.looseObject({}) })
      `,
      errors: [
        {
          messageId: 'consistentMethod',
          data: { actual: 'looseObject', allowedList: 'object' },
          suggestions: [
            {
              messageId: 'useMethod',
              data: { expected: 'object' },
              output: dedent`
                import * as z from 'zod';
                z.object({ test: z.object({}) })
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'nested looseObject (named)',
      code: dedent`
        import { object, looseObject } from 'zod';
        object({ test: looseObject({}) })
      `,
      errors: [
        {
          messageId: 'consistentMethod',
          data: { actual: 'looseObject', allowedList: 'object' },
          suggestions: null,
        },
      ],
      output: null,
    },
  ],
});
