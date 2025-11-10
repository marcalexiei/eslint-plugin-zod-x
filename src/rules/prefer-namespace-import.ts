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
      useNamespace: 'Import zod with a namespace import',
      removeDuplicate: 'Zod is already imported via namespace import',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    interface ImportGroupData {
      hasOnlyTypeImports: boolean;
      nodes: Array<TSESTree.ImportDeclaration>;
    }
    const importGroups: Record<string, ImportGroupData> = {};

    return {
      ImportDeclaration(node): void {
        const { source, importKind } = node;

        if (source.value !== 'zod' && !source.value.startsWith('zod/')) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!importGroups[source.value]) {
          importGroups[source.value] = {
            hasOnlyTypeImports: true,
            nodes: [],
          };
        }

        if (
          importGroups[source.value].hasOnlyTypeImports &&
          importKind === 'value'
        ) {
          importGroups[source.value].hasOnlyTypeImports = false;
        }

        importGroups[source.value].nodes.push(node);
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Program:exit': (): void => {
        for (const [, { hasOnlyTypeImports, nodes }] of Object.entries(
          importGroups,
        )) {
          const [firstImportNode, ...othersImportNodes] = nodes;

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
        }
      },
    };
  },
});
