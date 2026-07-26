import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noThrowInRefine } from './no-throw-in-refine.js';

const ruleTester = new RuleTester();

ruleTester.run(noThrowInRefine.name, noThrowInRefine, {
  valid: [
    {
      name: 'refine with arrow body shorthand',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.refine((val) => val >= 0));
      `,
    },
    {
      name: 'nested function not reported',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine((val) => {
          const fn = () => {
            throw new Error('nested');
          };
          return val.length > 0;
        }));
      `,
    },
    {
      name: 'nested function declaration not reported',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine((val) => {
          function nested() {
            throw new Error('nested');
          }
          return val.length > 0;
        }));
      `,
    },
    {
      name: 'returned arrow function not reported',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine((val) => () => {
          throw new Error('nested');
        }));
      `,
    },
    {
      name: 'returned function expression not reported',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine((val) => function () {
          throw new Error('nested');
        }));
      `,
    },
    {
      name: 'named imports',
      code: dedent`
        import { refine, string } from 'zod/mini';
        string().check(refine((val) => val.length > 0));
      `,
    },
    {
      name: 'refine not starting with zod mini import',
      code: dedent`
        import * as z from 'zod';
        z.number().refine(() => {
          throw new Error('boom');
        });
      `,
    },
  ],
  invalid: [
    {
      name: 'inside arrow function',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => {
          throw new Error();
        }));
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      name: 'inside arrow function (named)',
      code: dedent`
        import { refine, string } from 'zod/mini';
        string().check(refine(() => {
          throw new Error();
        }));
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      name: 'inside arrow function within if',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.refine((val) => {
          if (val < 0) {
            throw new Error('Invalid');
          }
          return true;
        }));
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      name: 'inside arrow function within else',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.refine((val) => {
          if (val < 0) {
            return true;
          }

          throw new Error('Invalid');
        }));
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      name: 'inside arrow function within cycle',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.refine((val) => {
          for (const item of val) {
            throw new Error('Invalid');
          }

          return true;
        }));
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.string().check(z.refine(() => {
          throw new Error('No');
        }));
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      name: 'inside a classic for loop',
      code: dedent`
        import * as z from 'zod/mini';
        z.number().check(z.refine((val) => {
          for (let i = 0; i < val; i += 1) {
            throw new Error('Invalid');
          }

          return true;
        }));
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      name: 'inside a for-in loop',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({}).check(z.refine((val) => {
          for (const key in val) {
            throw new Error('Invalid');
          }

          return true;
        }));
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      name: 'inside every branch of a try statement',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine((val) => {
          try {
            throw new Error('try');
          } catch {
            throw new Error('catch');
          } finally {
            throw new Error('finally');
          }
        }));
      `,
      errors: [
        { messageId: 'noThrowInRefine' },
        { messageId: 'noThrowInRefine' },
        { messageId: 'noThrowInRefine' },
      ],
    },
  ],
});
