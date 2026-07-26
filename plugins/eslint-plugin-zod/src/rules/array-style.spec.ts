import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { arrayStyle } from './array-style.js';

const ruleTester = new RuleTester();

ruleTester.run(`${arrayStyle.name} (function)`, arrayStyle, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.array(z.string());
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { array, string } from 'zod';
        array(string());
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.array(z.string());
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
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
      name: 'named import',
      code: dedent`
        import { string } from 'zod';
        string().array();
      `,
      options: [{ style: 'function' }],
      errors: [{ messageId: 'useFunction' }],
      output: null,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/174
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.string().array();
      `,
      errors: [{ messageId: 'useFunction' }],
      output: dedent`
        import { z } from 'zod';
        z.array(z.string());
      `,
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
    {
      name: 'named with method followed by another method',
      code: dedent`
        import { string } from 'zod';
        string().trim().array().min(1);
      `,
      options: [{ style: 'function' }],
      errors: [{ messageId: 'useFunction' }],
      output: null,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/232
      name: 'should keep additional methods in the chain after running the fixer (named z)',
      code: dedent`
        import { z } from "zod";

        export const testSchema = z
          .object({
            id: z.uuid(),
          })
          .array()
          .optional();
      `,
      options: [{ style: 'function' }],
      errors: [{ messageId: 'useFunction' }],
      output: dedent`
        import { z } from "zod";

        export const testSchema = z.array(z
          .object({
            id: z.uuid(),
          }))
          .optional();
      `,
    },
  ],
});

ruleTester.run(`${arrayStyle.name} (method)`, arrayStyle, {
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
      // https://github.com/marcalexiei/eslint-zod/issues/148
      name: 'works with nested schema with chained methods',
      code: dedent`
        import * as z from 'zod';
        const Schema = z.object({
          items: z.array(z.string()).optional(),
        });
      `,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: dedent`
        import * as z from 'zod';
        const Schema = z.object({
          items: z.string().array().optional(),
        });
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
    {
      name: 'computed access is reported but not fixed — the chain walker cannot name it',
      code: dedent`
        import * as z from 'zod';
        z['array'](z.string());
      `,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: null,
    },
    {
      name: 'z.array() without an inner schema is reported but not fixed',
      code: dedent`
        import * as z from 'zod';
        z.array();
      `,
      options: [{ style: 'method' }],
      errors: [{ messageId: 'useMethod' }],
      output: null,
    },
  ],
});
