import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferNamespaceImport } from './prefer-namespace-import.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-namespace-import', preferNamespaceImport, {
  valid: [
    {
      name: 'valid usage',
      code: 'import * as z from "zod";',
    },
    {
      name: 'alias is fine',
      code: 'import * as myZod from "zod";',
    },
    {
      name: 'type imports',
      code: 'import type * as myZod from "zod";',
    },
    {
      name: 'unrelated imports',
      code: 'import { useState } from "react";',
    },
    {
      name: 'zod/mini',
      code: 'import * as z from "zod/mini";',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/93
      name: 'zod v4 and v3',
      code: dedent`
        import * as z3 from "zod/v3";
        import * as z from "zod";
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/93
      name: 'zod v4 (types) and v3',
      code: dedent`
        import * as z3 from "zod/v3";
        import type * as z from "zod";
      `,
    },
  ],

  invalid: [
    {
      name: 'named import',
      code: dedent`
        import { z } from "zod";
        const aSchema = z.string();
      `,
      errors: [{ messageId: 'useNamespace' }],
      output: dedent`
        import * as z from "zod";
        const aSchema = z.string();
      `,
    },
    {
      name: 'default import',
      code: 'import z from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod";',
    },
    {
      name: 'multiple named imports',
      code: 'import { object, string } from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod";',
    },
    {
      name: 'mixed default + named',
      code: 'import z, { object } from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod";',
    },
    {
      name: 'zod/mini',
      code: 'import z from "zod/mini";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod/mini";',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/39
      name: 'named type import',
      code: 'import type { z } from "zod";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import type * as z from "zod";',
    },
    {
      name: 'named imports (one value and one type)',
      code: dedent`
        import { z } from "zod";
        import type { $ZodType } from "zod";
        const aSchema: $ZodType = z.string();
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'removeDuplicate', line: 2 },
        { messageId: 'convertUsage', line: 3 },
      ],
      output: dedent`
        import * as z from "zod";

        const aSchema: z.$ZodType = z.string();
      `,
    },
    {
      name: 'type import and Value import',
      code: dedent`
        import type { z } from "zod";
        import { object } from "zod";
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'removeDuplicate', line: 2 },
      ],
      output: 'import * as z from "zod";\n',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/93
      name: 'zod v4 and v3 (named)',
      code: dedent`
        import z3 from "zod/v3";
        import * as z from "zod";
        const aSchema = z3.string();
        const bSchema = z.string();
      `,
      errors: [{ messageId: 'useNamespace', line: 1 }],
      output: dedent`
        import * as z3 from "zod/v3";
        import * as z from "zod";
        const aSchema = z3.string();
        const bSchema = z.string();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/138
      name: 'mixed value and type imports',
      code: dedent`
        import {array, type $ZodType} from "zod";
        const aSchema: $ZodType = array();
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'convertUsage', line: 2 },
        { messageId: 'convertUsage', line: 2 },
      ],
      output: dedent`
        import * as z from "zod";
        const aSchema: z.$ZodType = z.array();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/138
      name: 'type named imports',
      code: dedent`
        import type { ZodBoolean, $ZodType } from "zod";
        type Test = $ZodType | ZodBoolean;
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'convertUsage', line: 2 },
        { messageId: 'convertUsage', line: 2 },
      ],
      output: dedent`
        import type * as z from "zod";
        type Test = z.$ZodType | z.ZodBoolean;
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/138
      name: 'namespace import + named type import',
      code: dedent`
        import * as z from "zod";
        import type { $ZodType } from "zod";
        const aSchema: $ZodType = z.string();
      `,
      errors: [
        { messageId: 'removeDuplicate', line: 2 },
        { messageId: 'convertUsage', line: 3 },
      ],
      output: dedent`
        import * as z from "zod";

        const aSchema: z.$ZodType = z.string();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/138
      name: 'two versions: one using named and one default import',
      code: dedent`
        import { z as z3 } from 'zod/v3';
        import z from 'zod/v4';
        const aSchema = z.string();
        const bSchema = z3.string();
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'useNamespace', line: 2 },
      ],
      output: dedent`
        import * as z3 from 'zod/v3';
        import * as z from 'zod/v4';
        const aSchema = z.string();
        const bSchema = z3.string();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/138
      name: 'two versions: one using named and one default import and named type',
      code: dedent`
        import { z as z3 } from 'zod/v3';
        import z from 'zod/v4';
        import type { $ZodType } from 'zod/v4';
        const aSchema: $ZodType = z.string();
        const bSchema = z3.string();
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'useNamespace', line: 2 },
        { messageId: 'removeDuplicate', line: 3 },
        { messageId: 'convertUsage', line: 4 },
      ],
      output: dedent`
        import * as z3 from 'zod/v3';
        import * as z from 'zod/v4';

        const aSchema: z.$ZodType = z.string();
        const bSchema = z3.string();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/138
      name: 'only named',
      code: dedent`
        import { type $ZodType, string } from 'zod';
        const aSchema: $ZodType = string();
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'convertUsage', line: 2 },
        { messageId: 'convertUsage', line: 2 },
      ],
      output: dedent`
        import * as z from 'zod';
        const aSchema: z.$ZodType = z.string();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/138
      name: 'first named, then namespace',
      code: dedent`
        import type { $ZodType } from 'zod';
        import * as z from 'zod';
        const aSchema: $ZodType = z.string();
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'removeDuplicate', line: 2 },
        { messageId: 'convertUsage', line: 3 },
      ],
      output: dedent`
        import * as z from 'zod';

        const aSchema: z.$ZodType = z.string();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/93
      name: 'two named imports from same module',
      code: dedent`
        import {array, boolean} from 'zod';
        import {type ZodError, string} from 'zod';
        const aSchema = array(boolean())
        const bSchema = string()
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'removeDuplicate', line: 2 },
        { messageId: 'convertUsage', line: 3 },
        { messageId: 'convertUsage', line: 3 },
        { messageId: 'convertUsage', line: 4 },
      ],
      output: dedent`
        import * as z from 'zod';

        const aSchema = z.array(z.boolean())
        const bSchema = z.string()
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/93
      name: 'keeps name from default import',
      code: dedent`
        import myZod from 'zod';
        const aSchema = myZod.string()
      `,
      errors: [{ messageId: 'useNamespace', line: 1 }],
      output: dedent`
        import * as myZod from 'zod';
        const aSchema = myZod.string()
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/93
      name: 'keeps name from named z import',
      code: dedent`
        import { z as myZod} from 'zod';
        const aSchema = myZod.string();
      `,
      errors: [{ messageId: 'useNamespace', line: 1 }],
      output: dedent`
        import * as myZod from 'zod';
        const aSchema = myZod.string();
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/93
      name: 'keeps name from named z import and ignores other named import',
      code: dedent`
        import { boolean, z as myZod} from 'zod';
        const aSchema = myZod.string();
        const bSchema = boolean();
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'convertUsage', line: 3 },
      ],
      output: dedent`
        import * as myZod from 'zod';
        const aSchema = myZod.string();
        const bSchema = myZod.boolean();
      `,
    },
  ],
});
