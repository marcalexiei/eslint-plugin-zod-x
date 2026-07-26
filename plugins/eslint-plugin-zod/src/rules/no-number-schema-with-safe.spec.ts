import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNumberSchemaWithSafe } from './no-number-schema-with-safe.js';

const ruleTester = new RuleTester();

ruleTester.run(noNumberSchemaWithSafe.name, noNumberSchemaWithSafe, {
  valid: [
    {
      name: 'z.int()',
      code: dedent`
        import * as z from 'zod';
        z.int();
      `,
    },
    {
      name: 'int() — named import',
      code: dedent`
        import { int } from 'zod';
        int();
      `,
    },
    {
      name: 'z.int() — named z import',
      code: dedent`
        import { z } from 'zod';
        z.int();
      `,
    },
    {
      name: 'number schema without `.safe()`',
      code: dedent`
        import * as z from 'zod';
        z.number().min(0);
      `,
    },
  ],
  invalid: [
    {
      name: 'z.number().safe()',
      code: dedent`
        import * as z from 'zod';
        z.number().safe();
      `,
      errors: [{ messageId: 'useInt' }],
      output: dedent`
        import * as z from 'zod';
        z.int();
      `,
    },
    {
      name: 'z.number().safe with message',
      code: dedent`
        import * as z from 'zod';
        z.number().safe('nope');
      `,
      errors: [{ messageId: 'useInt' }],
      output: dedent`
        import * as z from 'zod';
        z.int('nope');
      `,
    },
    {
      name: 'z.number().safe().min(0) — reported even when not the last call',
      code: dedent`
        import * as z from 'zod';
        z.number().safe().min(0);
      `,
      errors: [{ messageId: 'useInt' }],
      output: dedent`
        import * as z from 'zod';
        z.int().min(0);
      `,
    },
    {
      name: 'named import number().safe() — no fix',
      code: dedent`
        import { number } from 'zod';
        number().safe();
      `,
      errors: [{ messageId: 'useInt' }],
      output: null,
    },
    {
      name: 'z.number().safe() — named z import',
      code: dedent`
        import { z } from 'zod';
        z.number().safe();
      `,
      errors: [{ messageId: 'useInt' }],
      output: dedent`
        import { z } from 'zod';
        z.int();
      `,
    },
  ],
});
