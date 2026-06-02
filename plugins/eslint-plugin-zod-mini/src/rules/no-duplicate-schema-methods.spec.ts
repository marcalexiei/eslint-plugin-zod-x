import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noDuplicateSchemaMethods } from './no-duplicate-schema-methods.js';

const ruleTester = new RuleTester();

ruleTester.run(noDuplicateSchemaMethods.name, noDuplicateSchemaMethods, {
  valid: [
    {
      name: 'namespace - no duplicate methods',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().brand('MyBrand');
      `,
    },
    {
      name: 'named - no duplicate methods',
      code: dedent`
        import { string } from 'zod/mini';
        string().brand('MyBrand');
      `,
    },
    {
      name: 'namespace - check called multiple times (excluded)',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.minLength(1)).check(z.maxLength(10));
      `,
    },
    {
      name: 'namespace - or called multiple times (excluded)',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().or(z.number()).or(z.boolean());
      `,
    },
    {
      name: 'namespace - and called multiple times (excluded)',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({ a: z.string() }).and(z.object({ b: z.number() })).and(z.object({ c: z.boolean() }));
      `,
    },
    {
      name: 'namespace - register called multiple times (excluded)',
      code: dedent`
        import * as z from 'zod/mini';
        const registryA = z.registry();
        const registryB = z.registry();
        z.string().register(registryA).register(registryB);
      `,
    },
    {
      name: 'non-zod code is not flagged',
      code: dedent`
        const obj = { brand: () => obj };
        obj.brand().brand();
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace - brand called twice',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().brand('Foo').brand('Bar');
      `,
      errors: [{ messageId: 'noDuplicateSchemaMethod', data: { method: 'brand' } }],
    },
    {
      name: 'named - brand called twice',
      code: dedent`
        import { string } from 'zod/mini';
        string().brand('Foo').brand('Bar');
      `,
      errors: [{ messageId: 'noDuplicateSchemaMethod', data: { method: 'brand' } }],
    },
    {
      name: 'named z - brand called twice',
      code: dedent`
        import { z } from 'zod/mini';
        z.string().brand('Foo').brand('Bar');
      `,
      errors: [{ messageId: 'noDuplicateSchemaMethod', data: { method: 'brand' } }],
    },
  ],
});
