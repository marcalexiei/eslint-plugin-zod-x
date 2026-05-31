import type { TSESLint } from '@typescript-eslint/utils';

import { createZodSchemaImportTrack } from '../track-zod-schema-imports.js';
import type { ZodImportScope } from '../zod-import-scope.js';

export function buildNoDuplicateSchemaMethodsCreate(
  scope: ZodImportScope,
  excludedMethods: ReadonlyArray<string>,
): (
  context: Readonly<TSESLint.RuleContext<'noDuplicateSchemaMethod', []>>,
) => TSESLint.RuleListener {
  const { trackZodSchemaImports } = createZodSchemaImportTrack(scope);

  return function create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);
        if (!zodSchemaMeta) {
          return;
        }

        const chainMethods = collectZodChainMethods(zodSchemaMeta.node);
        const seen = new Set<string>();

        for (const method of chainMethods) {
          if (excludedMethods.includes(method.name)) {
            continue;
          }

          if (seen.has(method.name)) {
            context.report({
              node,
              messageId: 'noDuplicateSchemaMethod',
              data: { method: method.name },
            });
          } else {
            seen.add(method.name);
          }
        }
      },
    };
  };
}
