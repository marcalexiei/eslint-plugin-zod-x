import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNativeEnum } from './no-native-enum.js';

const ruleTester = new RuleTester();

ruleTester.run(noNativeEnum.name, noNativeEnum, {
  valid: [
    {
      name: 'namespace import with enum',
      code: dedent`
        import * as z from 'zod/mini';
        z.enum(Color);
      `,
    },
    {
      name: 'named import with enum',
      code: dedent`
        import { enum as zodEnum } from 'zod/mini';
        zodEnum(Color);
      `,
    },
    {
      name: 'not a zod import',
      code: dedent`
        import * as z from 'something-else';
        z.nativeEnum(Color);
      `,
    },
    {
      name: 'unrelated call',
      code: 'nativeEnum(Color);',
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.nativeEnum(Color);
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.enum(Color);
      `,
    },
    {
      name: 'zod/v4-mini import source',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.nativeEnum(Color);
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/v4-mini';
        z.enum(Color);
      `,
    },
    {
      name: 'namespace import inside optional wrapper',
      code: dedent`
        import * as z from 'zod/mini';
        z.optional(z.nativeEnum(Color));
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.optional(z.enum(Color));
      `,
    },
    {
      name: 'namespace import inside object',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({ color: z.nativeEnum(Color) });
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.object({ color: z.enum(Color) });
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { nativeEnum } from 'zod/mini';
        nativeEnum(Color);
      `,
      errors: [{ messageId: 'useEnum' }],
      output: null,
    },
    {
      name: 'aliased named import',
      code: dedent`
        import { nativeEnum as zodNativeEnum } from 'zod/mini';
        zodNativeEnum(Color);
      `,
      errors: [{ messageId: 'useEnum' }],
      output: null,
    },
    {
      name: 'computed factory — reported but not fixed, and must not crash',
      code: dedent`
        import * as z from 'zod/mini';
        z['nativeEnum'](Color);
      `,
      errors: [{ messageId: 'useEnum' }],
      output: null,
    },
  ],
});
