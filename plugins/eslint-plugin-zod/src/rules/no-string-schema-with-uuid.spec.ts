import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noStringSchemaWithUuid } from './no-string-schema-with-uuid.js';

const ruleTester = new RuleTester();

ruleTester.run(noStringSchemaWithUuid.name, noStringSchemaWithUuid, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.uuid();
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { uuid } from 'zod';
        uuid();
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.uuid();
      `,
    },
    {
      name: 'uuid + chain method',
      code: dedent`
        import * as z from 'zod';
        z.uuid().optional();
      `,
    },
    {
      name: 'string without .uuid()',
      code: dedent`
        import * as z from 'zod';
        z.string().optional();
      `,
    },
    {
      name: 'unrelated to zod',
      code: 'something.string().uuid()',
    },
    {
      name: 'nested valid usage',
      code: dedent`
        import * as z from 'zod';
        z.object({ id: z.uuid(), name: z.string() });
      `,
    },
  ],
  invalid: [
    {
      name: 'string + uuid (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.string().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: dedent`
        import * as z from 'zod';
        z.uuid();
      `,
    },
    {
      name: 'string + uuid with params (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.string().uuid({ version: 'v4' });
      `,
      errors: [{ messageId: 'useUuid' }],
      output: dedent`
        import * as z from 'zod';
        z.uuid({ version: 'v4' });
      `,
    },
    {
      name: 'string + uuid (named import)',
      code: dedent`
        import { string } from 'zod';
        string().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: null,
    },
    {
      name: 'string + uuid (named z import)',
      code: dedent`
        import { z } from 'zod';
        z.string().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: dedent`
        import { z } from 'zod';
        z.uuid();
      `,
    },
    {
      name: 'string + uuid + other method',
      code: dedent`
        import * as z from 'zod';
        z.string().uuid().optional();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: dedent`
        import * as z from 'zod';
        z.uuid().optional();
      `,
    },
    {
      name: 'string + other method + uuid',
      code: dedent`
        import * as z from 'zod';
        z.string().optional().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: dedent`
        import * as z from 'zod';
        z.uuid().optional();
      `,
    },
    {
      name: 'nested in object',
      code: dedent`
        import * as z from 'zod';
        z.object({ id: z.string().uuid() });
      `,
      errors: [{ messageId: 'useUuid' }],
      output: dedent`
        import * as z from 'zod';
        z.object({ id: z.uuid() });
      `,
    },
    {
      name: 'computed factory — reported but not fixed, the chain walker cannot name it',
      code: dedent`
        import * as z from 'zod';
        z['string']().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: null,
    },
  ],
});
