import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { isZodImportSource } from '../utils/is-zod-import-source.js';

interface ImportGroupData {
  hasOnlyTypeImports: boolean;
  nodes: Array<TSESTree.ImportDeclaration>;
}

function isGroupFirstImportTypeNamespace(group: ImportGroupData): boolean {
  const {
    hasOnlyTypeImports,
    nodes: [firstImportNode],
  } = group;

  const { specifiers } = firstImportNode;

  if (
    specifiers.length === 1 &&
    specifiers[0].type === AST_NODE_TYPES.ImportNamespaceSpecifier
  ) {
    if (hasOnlyTypeImports) {
      if (firstImportNode.importKind === 'type') {
        return true;
      }
    } else {
      return true;
    }
  }

  return false;
}

function shouldIdentifierBeRenamed(node: TSESTree.Identifier): boolean {
  // Skip import specifier nodes themselves
  if (node.parent.type === AST_NODE_TYPES.ImportSpecifier) {
    return false;
  }

  // Skip if already qualified, e.g. z.array
  if (
    node.parent.type === AST_NODE_TYPES.MemberExpression &&
    node.parent.object.type === AST_NODE_TYPES.Identifier &&
    node.parent.object.name !== node.name
  ) {
    return false;
  }

  return true;
}

/**
 * From a given specifiers retrieve the most significant to use when creating an alias import
 */
function getNamespaceAliasNameFrom(node: TSESTree.ImportClause): string | null {
  if (
    node.type === AST_NODE_TYPES.ImportDefaultSpecifier ||
    node.type === AST_NODE_TYPES.ImportNamespaceSpecifier
  ) {
    return node.local.name;
  }

  if (
    // node.type === AST_NODE_TYPES.ImportSpecifier &&
    node.imported.type === AST_NODE_TYPES.Identifier &&
    // Search named imports for 'z'
    node.imported.name === 'z'
  ) {
    return node.local.name;
  }

  return null;
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
      useNamespace: 'Import Zod with a namespace import',
      removeDuplicate: 'Zod is already imported via namespace import',
      convertUsage: 'Convert to namespace usage',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;
    const importGroups: Record<string, ImportGroupData> = {};

    return {
      ImportDeclaration(node): void {
        const { source, importKind } = node;

        if (!isZodImportSource(source.value)) {
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
      'Program:exit': function (): void {
        let namespaceAliasNameIndex = 0;

        for (const importGroup of Object.values(importGroups)) {
          const { hasOnlyTypeImports, nodes } = importGroup;
          const [firstImportNode, ...othersImportNodes] = nodes;

          /**
           * Variable to track all specifiers that later are used by {@link getDeclaredVariables}
           * to add the namespace prefix
           */
          const nodesWithVariablesToUpdate: Array<TSESTree.ImportClause> = [];

          let namespaceAliasName: string | null = null;

          for (const specifier of nodes.flatMap((it) => it.specifiers)) {
            // Search for name to use in the namespace import
            if (!namespaceAliasName) {
              namespaceAliasName = getNamespaceAliasNameFrom(specifier);
              if (namespaceAliasName) {
                // eslint-disable-next-line no-continue
                continue;
              }
            }

            // If a name isn't found or has already been found,
            // this specifier must be processed later to add the namespace prefix
            nodesWithVariablesToUpdate.push(specifier);
          }

          // if specifiers name doesn't produce a valid identifier generate one
          if (!namespaceAliasName) {
            namespaceAliasName = 'z';
            if (namespaceAliasNameIndex > 0) {
              namespaceAliasName = `z${namespaceAliasNameIndex}`;
              namespaceAliasNameIndex += 1;
            }
          }

          // Check if first import node is a namespace import
          const isFirstImportValid =
            isGroupFirstImportTypeNamespace(importGroup);

          // if first node is invalid turn it into a namespace import
          if (!isFirstImportValid) {
            context.report({
              node: firstImportNode,
              messageId: 'useNamespace',
              fix(fixer) {
                const importTypeKeyword = hasOnlyTypeImports ? 'type ' : '';
                const newImportText = `import ${importTypeKeyword}* as ${namespaceAliasName} from ${firstImportNode.source.raw};`;
                return fixer.replaceText(firstImportNode, newImportText);
              },
            });
          }

          // Setup fixer for all references of all previously specifiers references
          const allVariables = nodesWithVariablesToUpdate.flatMap((it) =>
            sourceCode.getDeclaredVariables(it),
          );
          const allReferences = allVariables.flatMap((it) => it.references);
          for (const ref of allReferences) {
            const { identifier } = ref;

            if (shouldIdentifierBeRenamed(identifier as TSESTree.Identifier)) {
              context.report({
                node: identifier,
                messageId: 'convertUsage',
                fix(fixer) {
                  const newId = `${namespaceAliasName}.${identifier.name}`;
                  return fixer.replaceText(identifier, newId);
                },
              });
            }
          }

          // Remove duplicate imports, if any
          for (const extraImport of othersImportNodes) {
            context.report({
              node: extraImport,
              messageId: 'removeDuplicate',
              fix(fixer) {
                return fixer.removeRange(extraImport.range);
              },
            });
          }
        }
      },
    };
  },
});
