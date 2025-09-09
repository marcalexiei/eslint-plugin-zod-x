import { RuleTester } from '@typescript-eslint/rule-tester';

import { noThrowInRefine } from './no-throw-in-refine.js';

const ruleTester = new RuleTester({});

ruleTester.run('no-throw-in-refine', noThrowInRefine, {
  valid: [
    {
      name: 'refine with arrow body shorthand',
      code: 'z.number().min(0).refine((val) => true);',
    },
    {
      name: 'nested function not reported',
      code: `
    z.string().refine((val) => {
      const fn = () => { throw new Error("nested"); }; // nested function is fine
      return val.length > 0;
    });
    `,
    },
    {
      name: 'refine not starting with `z`',
      code: 'anotherLibrary.number().min(0).refine((val) => { throw Error("boom") });',
    },
  ],
  invalid: [
    {
      code: `
      z.number().refine((val) => {
        if (val < 0) throw new Error('Invalid');
      });
      `,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
    {
      code: `z.string().refine(() => { throw new Error(); });`,
      errors: [{ messageId: 'noThrowInRefine' }],
    },
  ],
});
