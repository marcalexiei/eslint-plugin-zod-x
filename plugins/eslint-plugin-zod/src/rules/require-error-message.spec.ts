import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { requireErrorMessage } from './require-error-message.js';

const ruleTester = new RuleTester();

ruleTester.run(requireErrorMessage.name, requireErrorMessage, {
  valid: [
    {
      name: 'object with error property (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { error: "error msg" });
      `,
    },
    {
      name: 'object with error property (named import)',
      code: dedent`
        import { string } from 'zod';
        string().refine(() => true, { error: "error msg" });
      `,
    },
    {
      name: 'object with error property (named z import)',
      code: dedent`
        import { z } from 'zod';
        z.string().refine(() => true, { error: "error msg" });
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
    {
      name: 'multiple chained refine with error properties',
      code: dedent`
        import * as z from 'zod';
        z.string()
          .refine(() => true, { error: "error msg 1" })
          .refine(() => true, { error: "error msg 2" });
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
    {
      name: 'multiple chained refine with message properties',
      code: dedent`
        import * as z from 'zod';
        z.string()
          .refine(() => true, { message: "error msg 1" })
          .refine(() => true, { message: "error msg 2" });
      `,
      errors: [{ messageId: 'preferError' }, { messageId: 'preferError' }],
      output: dedent`
        import * as z from 'zod';
        z.string()
          .refine(() => true, { error: "error msg 1" })
          .refine(() => true, { error: "error msg 2" });
      `,
    },
  ],
});

ruleTester.run(`${requireErrorMessage.name} (custom)`, requireErrorMessage, {
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
        z.custom(() => true, { abort: true });
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'reported error with missing object should highlight only the method node not whole chain ',
      code: `
        import * as z from 'zod';
        z.custom(() => true).optional()
      `,
      errors: [
        {
          messageId: 'requireErrorMessage',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 29,
        },
      ],
      output: null,
    },
  ],
});

ruleTester.run(`${requireErrorMessage.name} (object)`, requireErrorMessage, {
  valid: [
    {
      name: 'string error message in zod object',
      code: dedent`
        import * as z from 'zod';
        z.object({
          name: z.string("error msg") 
        });
      `,
    },
    {
      name: 'object with error property in zod object',
      code: dedent`
        import * as z from 'zod';
        z.object({
          name: z.string().refine(() => true, { error: "error msg" })
        });
      `,
    },
    {
      name: 'refine on zod object with object error property',
      code: dedent`
        import * as z from 'zod';
        z.object({
          foo: z.string()
        }).refine(() => true, { error: "error msg" });
      `,
    },
    {
      name: 'refine on zod object with string error message',
      code: dedent`
        import * as z from 'zod';
        z.object({
          foo: z.string()
        }).refine(() => true, "error msg");
      `,
    },
  ],
  invalid: [
    {
      name: 'object with message property in zod object',
      code: dedent`
        import * as z from 'zod';
        z.object({
          name: z.string().refine(() => true, { message: "error msg" })
        });
      `,
      errors: [{ messageId: 'preferError' }],
      output: dedent`
        import * as z from 'zod';
        z.object({
          name: z.string().refine(() => true, { error: "error msg" })
        });`,
    },
    {
      name: 'refine on zod object with object message property',
      code: dedent`
        import * as z from 'zod';
        z.object({
          foo: z.string()
        }).refine(() => true, { message: "error msg" });
      `,
      errors: [{ messageId: 'preferError' }],
      output: dedent`
        import * as z from 'zod';
        z.object({
          foo: z.string()
        }).refine(() => true, { error: "error msg" });
      `,
    },
    {
      name: 'remove message property in zod object when error property is present',
      code: dedent`
        import * as z from 'zod';
        z.object({
          foo: z.string().refine(() => true, { message: "hello", error: "hello" })
        });
      `,
      errors: [{ messageId: 'removeMessage' }],
      output: dedent`
      import * as z from 'zod';
      z.object({
        foo: z.string().refine(() => true, {  error: "hello" })
      });
      `,
    },
  ],
});
