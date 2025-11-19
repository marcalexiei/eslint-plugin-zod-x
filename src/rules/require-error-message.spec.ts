import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { requireErrorMessage } from './require-error-message.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-strict-object (refine)', requireErrorMessage, {
  valid: [
    {
      name: 'object with error property',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { error: "error msg" });
      `,
    },
    {
      name: 'object with error property (named)',
      code: dedent`
        import { string } from 'zod';
        string().refine(() => true, { error: "error msg" });
      `,
    },
    {
      name: 'string error message',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, "error msg");
      `,
    },
    {
      name: 'string error message (template)',

      code: dedent`
        import * as z from 'zod';
        const a = "a"; z.string().refine(() => true, \`error msg \${a}\`);
      `,
    },
    {
      name: 'function error',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { error: () => "ciao" });
      `,
    },
    {
      name: 'chained method after refine with error message',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { error: "error msg 2" }).trim();
      `,
    },
  ],

  invalid: [
    {
      name: 'missing error message parameter',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true);
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'missing error message parameter (named)',
      code: dedent`
        import { string } from 'zod';
        string().refine(() => true);
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'object without error message',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { abort: true });
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'asd',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { message: "hello" });
      `,
      errors: [{ messageId: 'preferError' }],
      output: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { error: "hello" });
      `,
    },
    {
      name: 'remove error',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { message: "hello", error: "hello" });
      `,
      errors: [{ messageId: 'removeMessage' }],
      output: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, {  error: "hello" });
      `,
    },
  ],
});

ruleTester.run('prefer-strict-object (custom)', requireErrorMessage, {
  valid: [
    {
      name: 'object with error property',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, { error: "hello there" });
      `,
    },
    {
      name: 'string error message',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, "error msg");
      `,
    },
    {
      name: 'chained method after refine with error message',
      code: `
        import * as z from 'zod';
        z.custom(() => true, { error: "error msg 2" }).trim();
      `,
    },
  ],

  invalid: [
    {
      name: 'missing error message parameter',
      code: `
        import * as z from 'zod';
        z.custom(() => true)
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'missing error message parameter (named)',
      code: `
        import { custom } from 'zod';
        custom(() => true)
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'object without error message',
      code: `
        import * as z from 'zod';
        z.custom(() => true, { abort: true })
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
  ],
});
