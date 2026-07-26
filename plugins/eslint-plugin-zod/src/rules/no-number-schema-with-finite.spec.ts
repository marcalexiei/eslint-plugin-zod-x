import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNumberSchemaWithFinite } from './no-number-schema-with-finite.js';

const ruleTester = new RuleTester();

ruleTester.run(noNumberSchemaWithFinite.name, noNumberSchemaWithFinite, {
  valid: [
    {
      name: 'number without .finite()',
      code: dedent`
        import * as z from 'zod';
        z.number();
      `,
    },
    {
      name: 'unrelated to zod',
      code: 'n.finite()',
    },
  ],
  invalid: [
    {
      name: 'z.number().finite()',
      code: dedent`
        import * as z from 'zod';
        z.number().finite();
      `,
      errors: [{ messageId: 'removeFinite' }],
      output: dedent`
        import * as z from 'zod';
        z.number();
      `,
    },
    {
      name: 'z.number().min(0).finite()',
      code: dedent`
        import * as z from 'zod';
        z.number().min(0).finite();
      `,
      errors: [{ messageId: 'removeFinite' }],
      output: dedent`
        import * as z from 'zod';
        z.number().min(0);
      `,
    },
    {
      name: 'z.number().finite().min(0) — reported even when not the last call',
      code: dedent`
        import * as z from 'zod';
        z.number().finite().min(0);
      `,
      errors: [{ messageId: 'removeFinite' }],
      output: dedent`
        import * as z from 'zod';
        z.number().min(0);
      `,
    },
    {
      name: 'named import number().finite() — can fix',
      code: dedent`
        import { number } from 'zod';
        number().finite();
      `,
      errors: [{ messageId: 'removeFinite' }],
      output: dedent`
        import { number } from 'zod';
        number();
      `,
    },
  ],
});
