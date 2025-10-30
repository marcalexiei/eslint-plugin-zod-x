import { defineConfig, globalIgnores } from 'eslint/config';
import configBase from '@marcalexiei/eslint-config/base';
import configTS from '@marcalexiei/eslint-config/typescript';
import configVitest from '@marcalexiei/eslint-config/vitest';
import pluginEslintPlugin from 'eslint-plugin-eslint-plugin';
import pluginEslintNode from 'eslint-plugin-n';

export default defineConfig(
  globalIgnores(['dist', 'coverage']),
  configBase,
  {
    ...configTS,
    rules: {
      ...configTS.rules,
      '@typescript-eslint/naming-convention': [
        ...configTS.rules['@typescript-eslint/naming-convention'],
        // for rules listeners
        {
          selector: 'objectLiteralMethod',
          format: ['camelCase', 'PascalCase'],
        },
      ],
    },
  },
  configVitest,
  {
    ...pluginEslintPlugin.configs.recommended,
    rules: {
      ...pluginEslintPlugin.configs.recommended.rules,
      // handled by typescript-eslint ESLintUtils.`RuleCreator`
      'eslint-plugin/require-meta-default-options': 'off',
    },
  },
  pluginEslintNode.configs['flat/recommended-module'],
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
);
