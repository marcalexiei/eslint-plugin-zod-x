import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { schemaErrorPropertyStyle } from './schema-error-property-style.js';

const ruleTester = new RuleTester();

ruleTester.run('error-style (custom)', schemaErrorPropertyStyle, {
  valid: [
    {
      name: 'default option',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, { error: "my error" })
      `,
    },
    {
      name: 'default option (named)',
      code: dedent`
        import { custom } from 'zod';
        custom(() => true, { error: "my error" })
      `,
    },
    {
      name: 'default option non-zod',
      code: dedent`
        import { custom } from '@custom';
        custom(() => true, { error: "my error" })
      `,
    },
    {
      name: 'default with template string',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, \`asd\`);
      `,
    },
  ],
  invalid: [
    {
      name: 'arrow function',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, { error: () => "my error" })
      `,
      errors: [
        {
          messageId: 'invalidStyle',
          data: {
            selector: 'Literal,TemplateLiteral',
            example: "'error message'",
            actual: '() => "my error"',
          },
        },
      ],
      output: null,
    },
    {
      name: 'invalid selector',
      options: [{ selector: 'asd', example: 'test' }],
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, \`template string\`)
      `,
      errors: [
        {
          messageId: 'invalidStyle',
          data: {
            selector: 'asd',
            example: 'test',
            actual: '`template string`',
          },
        },
      ],
      output: null,
    },
  ],
});

ruleTester.run('error-style (refine)', schemaErrorPropertyStyle, {
  valid: [
    {
      name: 'default option',
      code: 'z.string().refine(() => true, { error: "my error" })',
    },
    {
      name: 'default with template string',
      code: 'z.string().refine(() => true, `asd`)',
    },
  ],
  invalid: [
    {
      name: 'arrow function',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { error: () => "my error" })
      `,
      errors: [
        {
          messageId: 'invalidStyle',
          data: {
            selector: 'Literal,TemplateLiteral',
            example: "'error message'",
            actual: '() => "my error"',
          },
        },
      ],
      output: null,
    },
    {
      name: 'invalid selector',
      options: [{ selector: 'asd', example: 'test' }],
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, \`template string\`)
      `,
      errors: [
        {
          messageId: 'invalidStyle',
          data: {
            selector: 'asd',
            example: 'test',
            actual: '`template string`',
          },
        },
      ],
      output: null,
    },
  ],
});
