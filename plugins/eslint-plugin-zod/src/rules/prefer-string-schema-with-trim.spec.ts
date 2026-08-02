import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferStringSchemaWithTrim } from './prefer-string-schema-with-trim.js';

const ruleTester = new RuleTester();

ruleTester.run(preferStringSchemaWithTrim.name, preferStringSchemaWithTrim, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from "zod";
        z.string().trim();
        z.string().trim().optional();
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string } from "zod";
        string().trim();
        string().trim().optional();
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from "zod";
        z.string().trim();
        z.string().trim().optional();
      `,
    },
    {
      name: 'not string schema z import',
      code: dedent`
        import { z } from "zod";
        z.custom(() => 'asd');
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/242
      name: 'string schema as record key (first argument)',
      code: dedent`
        import { z } from "zod";
        const schema = z.record(z.string(), z.unknown());
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/242
      name: 'string schema as record key with other methods',
      code: dedent`
        import { z } from "zod";
        const schema = z.record(z.string().min(1), z.unknown());
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/242
      name: 'string schema as record key with trim',
      code: dedent`
        import { z } from "zod";
        const schema = z.record(z.string().trim(), z.unknown());
      `,
    },
  ],

  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from "zod";
        const aSchema = z.string();
      `,
      errors: [{ messageId: 'addTrim' }],
      output: dedent`
        import * as z from "zod";
        const aSchema = z.string().trim();
      `,
    },
    {
      name: 'namespace import with optional',
      code: dedent`
        import * as z from "zod";
        const aSchema = z.string().optional();
      `,
      errors: [{ messageId: 'addTrim' }],
      output: dedent`
        import * as z from "zod";
        const aSchema = z.string().trim().optional();
      `,
    },
    {
      name: 'namespace import with min',
      code: dedent`
        import * as z from "zod";
        const aSchema = z.string().min(1).optional();
      `,
      errors: [{ messageId: 'addTrim' }],
      output: dedent`
        import * as z from "zod";
        const aSchema = z.string().trim().min(1).optional();
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string } from "zod";
        const aSchema = string();
      `,
      errors: [{ messageId: 'addTrim' }],
      output: null,
    },
    {
      name: 'named import with optional',
      code: dedent`
        import { string } from "zod";
        const aSchema = string().optional();
      `,
      errors: [{ messageId: 'addTrim' }],
      output: null,
    },
    {
      // https://github.com/marcalexiei/eslint-zod/issues/242
      name: 'string schema as record value (second argument) should warn',
      code: dedent`
        import { z } from "zod";
        const schema = z.record(z.string(), z.string());
      `,
      errors: [{ messageId: 'addTrim' }],
      output: dedent`
        import { z } from "zod";
        const schema = z.record(z.string(), z.string().trim());
      `,
    },
    {
      name: 'computed factory — reported but not fixed, and must not crash',
      code: dedent`
        import * as z from 'zod';
        z['string']();
      `,
      errors: [{ messageId: 'addTrim' }],
      output: null,
    },
  ],
});
