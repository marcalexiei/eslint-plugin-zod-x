import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noCoerceBoolean } from './no-coerce-boolean.js';

const ruleTester = new RuleTester();

ruleTester.run(noCoerceBoolean.name, noCoerceBoolean, {
  valid: [
    {
      name: 'plain boolean schema',
      code: dedent`
        import * as z from 'zod';
        z.boolean();
      `,
    },
    {
      name: 'stringbool schema',
      code: dedent`
        import * as z from 'zod';
        z.stringbool();
      `,
    },
    {
      name: 'other coerced types',
      code: dedent`
        import * as z from 'zod';
        z.coerce.string();
        z.coerce.number();
        z.coerce.date();
        z.coerce.bigint();
      `,
    },
    {
      name: 'explicit string transform',
      code: dedent`
        import * as z from 'zod';
        z.string().transform((v) => v === 'true');
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
      name: 'coerce boolean from non-zod source',
      code: dedent`
        import * as z from 'zod-mini';
        z.coerce.boolean();
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.coerce.boolean();
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import * as z from 'zod';
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
        import z from 'zod';
        z.coerce.boolean();
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import z from 'zod';
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
        import { z } from 'zod';
        z.coerce.boolean();
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import { z } from 'zod';
                z.stringbool();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'aliased namespace import',
      code: dedent`
        import * as zod from 'zod';
        zod.coerce.boolean();
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import * as zod from 'zod';
                zod.stringbool();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'named coerce import (no suggestion)',
      code: dedent`
        import { coerce } from 'zod';
        coerce.boolean();
      `,
      errors: [{ messageId: 'noCoerceBoolean', suggestions: [] }],
    },
    {
      name: 'with chained method',
      code: dedent`
        import * as z from 'zod';
        z.coerce.boolean().optional();
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import * as z from 'zod';
                z.stringbool().optional();
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'inside object schema',
      code: dedent`
        import * as z from 'zod';
        z.object({ isUrgent: z.coerce.boolean().optional() });
      `,
      errors: [
        {
          messageId: 'noCoerceBoolean',
          suggestions: [
            {
              messageId: 'useStringbool',
              output: dedent`
                import * as z from 'zod';
                z.object({ isUrgent: z.stringbool().optional() });
              `,
            },
          ],
        },
      ],
    },
  ],
});
