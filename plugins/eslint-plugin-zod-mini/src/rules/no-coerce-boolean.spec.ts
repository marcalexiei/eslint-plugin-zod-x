import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noCoerceBoolean } from './no-coerce-boolean.js';

const ruleTester = new RuleTester();

ruleTester.run(noCoerceBoolean.name, noCoerceBoolean, {
  valid: [
    {
      name: 'plain boolean schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.boolean();
      `,
    },
    {
      name: 'stringbool schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.stringbool();
      `,
    },
    {
      name: 'other coerced types',
      code: dedent`
        import * as z from 'zod/mini';
        z.coerce.string();
        z.coerce.number();
        z.coerce.date();
        z.coerce.bigint();
      `,
    },
    {
      name: 'explicit string transform via pipe',
      code: dedent`
        import * as z from 'zod/mini';
        z.pipe(z.string(), z.transform((v) => v === 'true'));
      `,
    },
    {
      name: 'unrelated coerce helper from another package',
      code: dedent`
        import { coerce } from 'something-else';
        coerce.boolean();
      `,
    },
    {
      name: 'coerce boolean from non-zod-mini source',
      code: dedent`
        import * as z from 'zod';
        z.coerce.boolean();
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.coerce.boolean();
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import * as z from 'zod/mini';
                z.stringbool();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'default import',
      code: dedent`
        import z from 'zod/mini';
        z.coerce.boolean();
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import z from 'zod/mini';
                z.stringbool();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        z.coerce.boolean();
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import { z } from 'zod/mini';
                z.stringbool();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named coerce import (no suggestion)',
      code: dedent`
        import { coerce } from 'zod/mini';
        coerce.boolean();
      `,
      errors: [{ messageId: 'noCoerceBoolean', suggestions: [] }],
    },
    {
      name: 'computed coerced factory — reported without a suggestion, and must not crash',
      code: dedent`
        import * as z from 'zod/mini';
        z.coerce['boolean']();
      `,
      errors: [{ messageId: 'noCoerceBoolean', suggestions: [] }],
    },
    {
      name: 'with chained optional',
      code: dedent`
        import * as z from 'zod/mini';
        z.optional(z.coerce.boolean());
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import * as z from 'zod/mini';
                z.optional(z.stringbool());
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'inside object schema',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({ isUrgent: z.optional(z.coerce.boolean()) });
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import * as z from 'zod/mini';
                z.object({ isUrgent: z.optional(z.stringbool()) });
              `,
            },
          ],
        },
      ],
    },
  ],
});
