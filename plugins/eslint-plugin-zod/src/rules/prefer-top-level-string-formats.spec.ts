import { ZOD_STRING_FORMAT_METHODS } from '@eslint-zod/utils';
import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferTopLevelStringFormats } from './prefer-top-level-string-formats.js';

const ruleTester = new RuleTester();

const valid = ZOD_STRING_FORMAT_METHODS.flatMap(({ replacementMethodName, sourceMethodName }) => {
  const [namedImportSpecifier] = replacementMethodName.split('.');
  const namedImportExpression = `${replacementMethodName}()`;
  const replacementExpression = `z.${replacementMethodName}()`;

  return [
    {
      name: `${sourceMethodName}: namespace import`,
      code: dedent`
          import * as z from 'zod';
          ${replacementExpression};
        `,
    },
    {
      name: `${sourceMethodName}: named import`,
      code: dedent`
          import { ${namedImportSpecifier} } from 'zod';
          ${namedImportExpression};
        `,
    },
    {
      name: `${sourceMethodName}: named z import`,
      code: dedent`
          import { z } from 'zod';
          ${replacementExpression};
        `,
    },
    {
      name: `${sourceMethodName}: replacement with chain method`,
      code: dedent`
          import * as z from 'zod';
          ${replacementExpression}.optional();
        `,
    },
    {
      name: `${sourceMethodName}: ignored through options`,
      code: dedent`
          import * as z from 'zod';
          z.string().${sourceMethodName}();
        `,
      options: [{ ignore: [sourceMethodName] }] as const,
    },
  ];
});

const invalid = ZOD_STRING_FORMAT_METHODS.flatMap(({ replacementMethodName, sourceMethodName }) => {
  const replacementExpression = `z.${replacementMethodName}()`;

  return [
    {
      name: `${sourceMethodName}: namespace import`,
      code: dedent`
          import * as z from 'zod';
          z.string().${sourceMethodName}();
        `,
      errors: [{ messageId: 'preferTopLevelStringFormat' }] as const,
      output: dedent`
          import * as z from 'zod';
          ${replacementExpression};
        `,
    },
    {
      name: `${sourceMethodName}: namespace import with params`,
      code: dedent`
          import * as z from 'zod';
          z.string().${sourceMethodName}('custom error');
        `,
      errors: [{ messageId: 'preferTopLevelStringFormat' }] as const,
      output: dedent`
          import * as z from 'zod';
          ${replacementExpression.replace('()', `('custom error')`)};
        `,
    },
    {
      name: `${sourceMethodName}: named import`,
      code: dedent`
          import { string } from 'zod';
          string().${sourceMethodName}();
        `,
      errors: [{ messageId: 'preferTopLevelStringFormat' }] as const,
      output: null,
    },
    {
      name: `${sourceMethodName}: named z import`,
      code: dedent`
          import { z } from 'zod';
          z.string().${sourceMethodName}();
        `,
      errors: [{ messageId: 'preferTopLevelStringFormat' }] as const,
      output: dedent`
          import { z } from 'zod';
          ${replacementExpression};
        `,
    },
    {
      name: `${sourceMethodName}: method after optional`,
      code: dedent`
          import * as z from 'zod';
          z.string().optional().${sourceMethodName}();
        `,
      errors: [{ messageId: 'preferTopLevelStringFormat' }] as const,
      output: dedent`
          import * as z from 'zod';
          ${replacementExpression}.optional();
        `,
    },
    {
      name: `${sourceMethodName}: not ignored when another method is ignored`,
      code: dedent`
          import * as z from 'zod';
          z.string().${sourceMethodName}();
        `,
      options: [{ ignore: ['email'] }] as const,
      errors: [{ messageId: 'preferTopLevelStringFormat' }] as const,
      output: dedent`
          import * as z from 'zod';
          ${replacementExpression};
        `,
    },
  ];
}).filter(({ options, name }) => {
  if (!options) {
    return true;
  }

  return !name.startsWith('email:');
});

ruleTester.run(preferTopLevelStringFormats.name, preferTopLevelStringFormats, {
  valid: [
    ...valid,
    {
      name: 'string without supported format method',
      code: dedent`
        import * as z from 'zod';
        z.string().optional();
      `,
    },
    {
      name: 'unrelated to zod',
      code: 'something.string().email()',
    },
    {
      name: 'string factory aliased on import — the chain has no `string` method to replace',
      code: dedent`
        import { string as str } from 'zod';
        str().email();
      `,
    },
  ],
  invalid: [
    ...invalid,
    {
      name: 'computed factory — reported but not fixed, the chain walker cannot name it',
      code: dedent`
        import * as z from 'zod';
        z['string']().email();
      `,
      errors: [{ messageId: 'preferTopLevelStringFormat' }] as const,
      output: null,
    },
  ],
});
