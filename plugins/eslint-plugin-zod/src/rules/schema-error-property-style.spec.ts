import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { schemaErrorPropertyStyle } from './schema-error-property-style.js';

const ruleTester = new RuleTester();

ruleTester.run(schemaErrorPropertyStyle.name, schemaErrorPropertyStyle, {
  valid: [
    {
      name: 'default option (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, { error: "my error" })
      `,
    },
    {
      name: 'default option (named import)',
      code: dedent`
        import { custom } from 'zod';
        custom(() => true, { error: "my error" })
      `,
    },
    {
      name: 'default option (named z import)',
      code: dedent`
        import { z } from 'zod';
        z.custom(() => true, { error: "my error" })
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
    {
      name: 'default with string literal',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, 'asd');
      `,
    },
    {
      name: 'no params argument',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true);
      `,
    },
    {
      name: 'params object without an `error` property',
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, { abort: true });
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
      options: [{ selector: '>!asd', example: 'test' }],
      code: dedent`
        import * as z from 'zod';
        z.custom(() => true, \`template string\`)
      `,
      errors: [
        {
          messageId: 'invalidSelector',
          data: { selector: '>!asd' },
        },
      ],
      output: null,
    },
  ],
});

ruleTester.run(`${schemaErrorPropertyStyle.name} (refine)`, schemaErrorPropertyStyle, {
  valid: [
    {
      name: 'default option',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, { error: "my error" });
      `,
    },
    {
      name: 'default with template string',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, \`asd\`);
      `,
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
      options: [{ selector: '>!asd', example: 'test' }],
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true, \`template string\`)
      `,
      errors: [
        {
          messageId: 'invalidSelector',
          data: { selector: '>!asd' },
        },
      ],
      output: null,
    },
  ],
});
