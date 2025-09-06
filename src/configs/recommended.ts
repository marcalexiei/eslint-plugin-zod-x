import type { TSESLint } from '@typescript-eslint/utils';

import { PLUGIN_NAME } from '../meta.js';

export const createRecommendedConfig = (options: {
  plugin: TSESLint.FlatConfig.Plugin;
}): TSESLint.FlatConfig.Config => {
  const { plugin } = options;

  // Disabled to due clash with eslint convention
  /* eslint-disable @typescript-eslint/naming-convention */
  return {
    name: `${PLUGIN_NAME}/recommended`,
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      'zod-x': plugin,
    },
    rules: {
      'zod-x/consistent-syntax': ['error', 'namespace'],
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  };
  /* eslint-enable @typescript-eslint/naming-convention */
};
