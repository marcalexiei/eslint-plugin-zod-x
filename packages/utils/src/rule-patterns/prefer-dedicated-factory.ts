import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

import type { ZodImportScope } from '../zod-import-scope.js';

/** Options for {@link buildPreferDedicatedFactoryCreate}. */
export interface PreferDedicatedFactoryOptions<TMessageIds extends string> {
  scope: ZodImportScope;

  /** The general factory the modifier is chained on (e.g. `object`). */
  factoryName: string;

  /** Chained modifiers the dedicated factory replaces (e.g. `passthrough`, `loose`). */
  modifierMethods: ReadonlyArray<string>;

  /** The dedicated factory to use instead (e.g. `looseObject`). */
  replacementFactoryName: string;

  /** Message reported on the modifier call. */
  messageId: TMessageIds;
}

/**
 * Prefers a dedicated factory over a general one plus a chained modifier
 * (`z.looseObject()` over `z.object().passthrough()`). The fix renames the
 * factory and drops the modifier; it bails on named imports (would need a new
 * import) and on a modifier with arguments (nowhere to put them).
 */
export function buildPreferDedicatedFactoryCreate<TMessageIds extends string>(
  options: PreferDedicatedFactoryOptions<TMessageIds>,
): (context: Readonly<TSESLint.RuleContext<TMessageIds, []>>) => TSESLint.RuleListener {
  const { scope, factoryName, modifierMethods, replacementFactoryName, messageId } = options;

  return function create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      scope.createTracker();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== factoryName) {
          return;
        }

        const methods = collectZodChainMethods(node);
        const modifierMethod = methods.find((it) => modifierMethods.includes(it.name));

        if (!modifierMethod) {
          return;
        }

        context.report({
          node: modifierMethod.node,
          messageId,
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            if (modifierMethod.node.arguments.length !== 0) {
              return null;
            }

            const factoryMethod = methods.find((it) => it.name === factoryName);
            if (!factoryMethod) {
              return null;
            }

            const { sourceCode } = context;

            // Named declarations returned above, so both calls are `<ns>.<name>(…)`
            // member expressions — a bare identifier callee is unreachable here.
            const factoryCallee = factoryMethod.node.callee as TSESTree.MemberExpression;
            const modifierCallee = modifierMethod.node.callee as TSESTree.MemberExpression;

            const fixes = [
              fixer.replaceText(
                factoryCallee,
                `${sourceCode.getText(factoryCallee.object)}.${replacementFactoryName}`,
              ),
            ];

            const tokenBefore = sourceCode.getTokenBefore(modifierCallee.property);

            if (tokenBefore?.value === '.') {
              fixes.push(fixer.removeRange([tokenBefore.range[0], modifierMethod.node.range[1]]));
            }

            return fixes;
          },
        });
      },
    };
  };
}
