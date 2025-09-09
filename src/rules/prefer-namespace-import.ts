import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

export const preferNamespaceImport = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'prefer-namespace-import',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Enforce importing zod as a namespace import (import * as z from 'zod')",
    },
    fixable: 'code',
    messages: {
      useNamespace:
        "Import zod as a namespace import (import * as z from 'zod').",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node): void {
        if (node.source.value !== 'zod') {
          return;
        }

        // Already namespace import: import * as z from "zod"
        const hasNamespace = node.specifiers.some(
          (s) => s.type === AST_NODE_TYPES.ImportNamespaceSpecifier,
        );

        if (!hasNamespace) {
          context.report({
            node,
            messageId: 'useNamespace',
            fix(fixer) {
              const [firstSpecifier] = node.specifiers;
              const localName = firstSpecifier.local.name;
              return fixer.replaceText(
                node,
                `import * as ${localName} from 'zod';`,
              );
            },
          });
        }
      },
    };
  },
});
