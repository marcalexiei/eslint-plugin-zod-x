import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

function hasNamespaceImport(node: TSESTree.ImportDeclaration): boolean {
  const { specifiers } = node;
  return (
    specifiers.length === 1 &&
    specifiers[0].type === AST_NODE_TYPES.ImportNamespaceSpecifier
  );
}

export const preferNamespaceImport = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'prefer-namespace-import',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Enforce importing zod as a namespace import (`import * as z from 'zod'`)",
    },
    fixable: 'code',
    messages: {
      removeDuplicate: 'Zod is already imported via namespace import',
      useNamespace: 'Import zod with a namespace import',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const zodImports: Array<TSESTree.ImportDeclaration> = [];
    let hasOnlyTypeImports = true;

    return {
      ImportDeclaration(node): void {
        const { source, importKind } = node;

        if (source.value !== 'zod' && !source.value.startsWith('zod/')) {
          return;
        }

        if (hasOnlyTypeImports && importKind === 'value') {
          hasOnlyTypeImports = false;
        }

        zodImports.push(node);
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Program:exit': (): void => {
        if (zodImports.length === 0) {
          return;
        }

        const [firstImportNode, ...othersImportNodes] = zodImports;

        let isFirstImportValid = false;
        // pick the first import and check if is valid
        if (hasNamespaceImport(firstImportNode)) {
          if (hasOnlyTypeImports) {
            if (firstImportNode.importKind === 'type') {
              isFirstImportValid = true;
            }
          } else {
            isFirstImportValid = true;
          }
        }

        if (!isFirstImportValid) {
          context.report({
            node: firstImportNode,
            messageId: 'useNamespace',
            fix(fixer) {
              const [firstSpecifier] = firstImportNode.specifiers;
              const localName = firstSpecifier.local.name;

              const importTexts = ['import'];
              if (hasOnlyTypeImports) {
                importTexts.push('type');
              }

              return fixer.replaceText(
                firstImportNode,
                `${importTexts.join(' ')} * as ${localName} from ${firstImportNode.source.raw};`,
              );
            },
          });
        }

        // Remove other imports nodes
        for (const importNode of othersImportNodes) {
          context.report({
            node: importNode,
            messageId: 'removeDuplicate',
            fix: (fixer) => fixer.removeRange(importNode.range),
          });
        }
      },
    };
  },
});
