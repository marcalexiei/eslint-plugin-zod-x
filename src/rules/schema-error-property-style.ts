import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import esquery from 'esquery';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

type MessageIds = 'invalidStyle';

export const schemaErrorPropertyStyle = ESLintUtils.RuleCreator(getRuleURL)<
  [{ selector: string; example: string }],
  MessageIds
>({
  name: 'schema-error-property-style',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce consistent style for error messages in Zod schema validation (using ESQuery patterns)',
    },
    messages: {
      invalidStyle:
        'Error message should follow the pattern: {{selector}} (e.g., {{example}}). Found: {{ actual }}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          selector: {
            description: 'An ESQuery string to match the required pattern',
            type: 'string',
          },
          example: {
            description:
              'Example code to help the user understand the required pattern',
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    { selector: 'Literal,TemplateLiteral', example: "'error message'" },
  ],
  create(context, [{ selector, example }]) {
    const {
      //
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);
        if (!zodSchemaMeta) {
          return;
        }

        if (
          zodSchemaMeta.schemaType !== 'custom' &&
          !collectZodChainMethods(node).some((it) => it.name === 'refine')
        ) {
          return;
        }

        // error should be the second parameter,
        // if not present stop processing
        if (node.arguments.length < 2) {
          return;
        }

        let errorMessageNode: TSESTree.Node | undefined;

        const [, params] = node.arguments;

        switch (params.type) {
          case AST_NODE_TYPES.Literal:
          case AST_NODE_TYPES.TemplateLiteral:
            errorMessageNode = params;
            break;

          case AST_NODE_TYPES.ObjectExpression:
            for (const property of params.properties) {
              if (
                property.type === AST_NODE_TYPES.Property &&
                property.key.type === AST_NODE_TYPES.Identifier &&
                property.key.name === 'error'
              ) {
                errorMessageNode = property.value;
                break;
              }
            }
            break;

          // no default
        }

        if (!errorMessageNode) {
          return;
        }

        const match = esquery.matches(
          errorMessageNode as never,
          esquery.parse(selector),
          errorMessageNode as never,
        );

        if (match) {
          return;
        }

        context.report({
          node,
          messageId: 'invalidStyle',
          data: {
            selector,
            example,
            actual: context.sourceCode.getText(errorMessageNode),
          },
        });
      },
    };
  },
});
