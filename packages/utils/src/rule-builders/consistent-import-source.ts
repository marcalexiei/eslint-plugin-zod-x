import type { TSESLint } from '@typescript-eslint/utils';

import type { ZodImportScope } from '../zod-import-scope.js';

type MessageIds = 'sourceNotAllowed' | 'replaceSource';

interface Options<TSource extends string> {
  sources: Array<TSource>;
}

export function buildConsistentImportSourceCreate<TSources extends ReadonlyArray<string>>(
  scope: ZodImportScope<TSources>,
): (
  context: Readonly<TSESLint.RuleContext<MessageIds, [Options<TSources[number]>]>>,
  options: readonly [Options<TSources[number]>],
) => TSESLint.RuleListener {
  return function create(context, [{ sources }]) {
    return {
      ImportDeclaration(node): void {
        const sourceValue = node.source.value;
        if (!scope.isAllowed(sourceValue)) {
          return;
        }

        if (sources.includes(sourceValue)) {
          return;
        }

        context.report({
          node,
          messageId: 'sourceNotAllowed',
          data: {
            source: sourceValue,
            sources: sources.map((s) => `"${s}"`).join(', '),
          },
          suggest: sources.map<TSESLint.ReportSuggestionArray<MessageIds>[number]>((it) => ({
            messageId: 'replaceSource',
            data: { valid: it, invalid: sourceValue },
            fix(fixer): TSESLint.RuleFix {
              return fixer.replaceText(
                node.source,
                // Replacing using the raw value
                // to keep quote style consistent with the user code
                node.source.raw.replace(sourceValue, it),
              );
            },
          })),
        });
      },
    };
  };
}
