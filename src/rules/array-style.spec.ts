import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { arrayStyle } from './array-style.js';

const ruleTester = new RuleTester();

ruleTester.run('array-style (function)', arrayStyle, {
  valid: [
    {
      name: 'default option',
      code: dedent`
        import * as z from 'zod';
        z.array(z.string());
      `,
    },
    {
      name: '`function` option',
      code: dedent`
        import * as z from 'zod';
        z.array(z.string());
      `,
    },
    {
      name: 'named',
      code: dedent`
        import { array, string } from 'zod';
        array(string());
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace',
      code: dedent`
        import * as z from 'zod';
        z.string().array();
      `,
      errors: [{ messageId: 'useFunction' }],
      output: dedent`
        import * as z from 'zod';
        z.array(z.string());
      `,
    },
    {
      name: 'named',
      code: dedent`
        import { string } from 'zod';
        string().array();
      `,
      options: [{ style: 'function' }],
      errors: [{ messageId: 'useFunction' }],
      output: null,
    },
    {
      name: 'with method',
      code: dedent`
        import * as z from 'zod';
        z.string().trim().array();
      `,
      options: [{ style: 'function' }],
      errors: [{ messageId: 'useFunction' }],
      output: dedent`
        import * as z from 'zod';
        z.array(z.string().trim());
      `,
    },
    {
      name: 'named with method',
      code: dedent`
        import { string } from 'zod';
        string().trim().array();
      `,
      options: [{ style: 'function' }],
      errors: [{ messageId: 'useFunction' }],
      output: null,
    },
  ],
});

ruleTester.run('array-style (method)', arrayStyle, {
  valid: [
    {
      name: 'namespace',
      code: dedent`
        import * as z from 'zod';
        z.string().array();
      `,
      options: [{ style: 'method' }],
    },
    {
      name: 'named',
      code: dedent`
        import { string } from 'zod';
        string().array();
      `,
      options: [{ style: 'method' }],
    },
  ],
  invalid: [
    {
      name: 'namespace',
      code: dedent`
        import * as z from 'zod';
        z.array(z.string());
      `,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: dedent`
        import * as z from 'zod';
        z.string().array();
      `,
    },
    {
      name: 'named',
      code: dedent`
        import { array, string } from 'zod';
        array(string());
      `,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: null,
    },
    {
      name: 'namespace with method',
      code: dedent`
        import * as z from 'zod';
        z.array(z.string().trim());
      `,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: dedent`
        import * as z from 'zod';
        z.string().trim().array();
      `,
    },
    {
      name: 'named with method',
      code: dedent`
        import { array, string } from 'zod';
        array(string().trim());
      `,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: null,
    },
  ],
});
