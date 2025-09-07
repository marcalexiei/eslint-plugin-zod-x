import configBase from '@marcalexiei/eslint-config/base';
import configTS from '@marcalexiei/eslint-config/typescript';
import configVitest from '@marcalexiei/eslint-config/vitest';
import pluginEslintPlugin from 'eslint-plugin-eslint-plugin';
import pluginEslintNode from 'eslint-plugin-n';

/** @type {Array<import('eslint').Linter.Config>} */
export default [
  {
    ignores: ['dist', 'coverage', 'tests/fixtures/**/*'],
  },
  configBase,
  {
    ...configTS,
    rules: {
      ...configTS.rules,
      '@typescript-eslint/naming-convention': [
        'error',
        // for ruleListener
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },

        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },

        {
          selector: 'variable',
          format: [
            'camelCase',
            'UPPER_CASE',
            'PascalCase', // for React/Solid
          ],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },

        {
          selector: 'function',
          format: [
            'camelCase',
            'PascalCase', // for React/Solid
          ],
        },

        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },

        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },

        {
          selector: 'objectLiteralMethod',
          format: ['camelCase', 'PascalCase'],
        },
      ],
    },
  },
  configVitest,
  pluginEslintPlugin.configs.recommended,
  pluginEslintNode.configs['flat/recommended-module'],
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
];
