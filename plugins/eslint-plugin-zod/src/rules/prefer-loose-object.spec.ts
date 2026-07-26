import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferLooseObject } from './prefer-loose-object.js';

const ruleTester = new RuleTester();

ruleTester.run(preferLooseObject.name, preferLooseObject, {
  valid: [
    {
      name: 'looseObject is valid',
      code: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() });
      `,
    },
    {
      name: 'strictObject is valid',
      code: dedent`
        import { z } from 'zod';
        z.strictObject({ a: z.string() });
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
      name: 'object with strict is valid for this rule',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).strict();
      `,
    },
    {
      name: 'passthrough on schema variable is valid',
      code: dedent`
        import { z } from 'zod';
        const schema = z.object({ a: z.string() });
        schema.passthrough();
      `,
    },
    {
      name: 'loose on schema variable is valid',
      code: dedent`
        import { z } from 'zod';
        const schema = z.object({ a: z.string() });
        schema.loose();
      `,
    },
  ],
  invalid: [
    {
      name: 'prefer looseObject over object().passthrough()',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).passthrough();
      `,
      output: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() });
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'prefer looseObject over object().describe().passthrough()',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).describe("desc").passthrough();
      `,
      output: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() }).describe("desc");
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'prefer looseObject over object().loose()',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).loose();
      `,
      output: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() });
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'prefer looseObject over object().describe().loose()',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).describe("desc").loose();
      `,
      output: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() }).describe("desc");
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'prefer looseObject for nested object schema',
      code: dedent`
        import { z } from 'zod';
        z.object({ nested: z.object({ a: z.string() }).passthrough() });
      `,
      output: dedent`
        import { z } from 'zod';
        z.object({ nested: z.looseObject({ a: z.string() }) });
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'prefer looseObject for nested object schema using loose()',
      code: dedent`
        import { z } from 'zod';
        z.object({ nested: z.object({ a: z.string() }).loose() });
      `,
      output: dedent`
        import { z } from 'zod';
        z.object({ nested: z.looseObject({ a: z.string() }) });
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'passthrough with unexpected argument is reported without fix',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).passthrough({ message: 'Custom message' });
      `,
      output: null,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'loose with unexpected argument is reported without fix',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).loose({ message: 'Custom message' });
      `,
      output: null,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'named imports',
      code: dedent`
        import { object, string } from 'zod';
        object({ a: string() }).passthrough();
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'named imports with loose',
      code: dedent`
        import { object, string } from 'zod';
        object({ a: string() }).loose();
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'computed object access is reported but not fixed — the chain walker cannot name it',
      code: dedent`
        import * as z from 'zod';
        z['object']({ a: z.string() }).passthrough();
      `,
      output: null,
      errors: [{ messageId: 'preferLooseObject' }],
    },
  ],
});
