import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferStrictObjet } from './prefer-strict-object.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-strict-object', preferStrictObjet, {
  valid: [
    {
      name: 'valid usage',
      code: dedent`
        import * as z from 'zod';
        z.strictObject()
      `,
    },
    {
      name: 'valid usage with allow `object`',
      options: [{ allow: ['object'] }],
      code: dedent`
        import * as z from 'zod';
        z.object()
      `,
    },
    {
      name: 'valid usage with allow `looseObject`',
      options: [{ allow: ['looseObject'] }],
      code: dedent`
        import * as z from 'zod';
        z.looseObject()
      `,
    },
  ],

  invalid: [
    {
      name: 'object',
      code: dedent`
        import * as z from 'zod';
        z.object({ foo: "bar" })
      `,
      errors: [{ messageId: 'useStrictObject', data: { method: 'object' } }],
      output: null,
    },
    {
      name: 'object (named)',
      code: dedent`
        import { object } from 'zod';
        object({ foo: "bar" })
      `,
      errors: [{ messageId: 'useStrictObject', data: { method: 'object' } }],
      output: null,
    },
    {
      name: 'looseObject',
      code: dedent`
        import * as z from 'zod';
        z.looseObject({ foo: "bar" })
      `,
      errors: [
        { messageId: 'useStrictObject', data: { method: 'looseObject' } },
      ],
      output: null,
    },
    {
      name: 'looseObject (named)',
      code: dedent`
        import { looseObject } from 'zod';
        looseObject({ foo: "bar" })
      `,
      errors: [
        { messageId: 'useStrictObject', data: { method: 'looseObject' } },
      ],
      output: null,
    },
  ],
});
