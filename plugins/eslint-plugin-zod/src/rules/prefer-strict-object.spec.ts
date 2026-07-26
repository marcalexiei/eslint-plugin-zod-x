import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferStrictObject } from './prefer-strict-object.js';

const ruleTester = new RuleTester();

ruleTester.run(preferStrictObject.name, preferStrictObject, {
  valid: [
    {
      name: 'strictObject is valid',
      code: dedent`
        import { z } from 'zod';
        z.strictObject({ a: z.string() });
      `,
    },
    {
      name: 'looseObject is valid',
      code: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() });
      `,
    },
    {
      name: 'object is valid',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() });
      `,
    },
    {
      name: 'object with passthrough is valid for this rule',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).passthrough();
      `,
    },
    {
      name: 'strict on schema variable is valid',
      code: dedent`
        import { z } from 'zod';
        const schema = z.object({ a: z.string() });
        schema.strict();
      `,
    },
  ],
  invalid: [
    {
      name: 'prefer strictObject over object().strict()',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).strict();
      `,
      output: dedent`
        import { z } from 'zod';
        z.strictObject({ a: z.string() });
      `,
      errors: [{ messageId: 'preferStrictObject' }],
    },
    {
      name: 'prefer strictObject over object().describe().strict()',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).describe("desc").strict();
      `,
      output: dedent`
        import { z } from 'zod';
        z.strictObject({ a: z.string() }).describe("desc");
      `,
      errors: [{ messageId: 'preferStrictObject' }],
    },
    {
      name: 'prefer strictObject for nested object schema',
      code: dedent`
        import { z } from 'zod';
        z.object({ nested: z.object({ a: z.string() }).strict() });
      `,
      output: dedent`
        import { z } from 'zod';
        z.object({ nested: z.strictObject({ a: z.string() }) });
      `,
      errors: [{ messageId: 'preferStrictObject' }],
    },
    {
      name: 'strict with unexpected argument is reported without fix',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).strict({ message: 'Custom message' });
      `,
      output: null,
      errors: [{ messageId: 'preferStrictObject' }],
    },
    {
      name: 'named imports',
      code: dedent`
        import { object, string } from 'zod';
        object({ a: string() }).strict();
      `,
      errors: [{ messageId: 'preferStrictObject' }],
    },
    {
      name: 'computed object access is reported but not fixed — the chain walker cannot name it',
      code: dedent`
        import * as z from 'zod';
        z['object']({ a: z.string() }).strict();
      `,
      output: null,
      errors: [{ messageId: 'preferStrictObject' }],
    },
  ],
});
