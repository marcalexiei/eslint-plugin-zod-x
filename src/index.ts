import type { TSESLint } from '@typescript-eslint/utils';

import { PLUGIN_NAME, PLUGIN_VERSION } from './meta.js';
import { arrayStyle } from './rules/array-style.js';
import { noAny } from './rules/no-any.js';
import { noThrowInRefine } from './rules/no-throw-in-refine.js';
import { preferMeta } from './rules/prefer-meta.js';
import { preferNamespaceImport } from './rules/prefer-namespace-import.js';

const eslintPluginZodX = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  configs: {} as { recommended: TSESLint.FlatConfig.Config },
  rules: {
    /* eslint-disable @typescript-eslint/naming-convention */
    'array-style': arrayStyle,
    'no-any': noAny,
    'no-throw-in-refine': noThrowInRefine,
    'prefer-meta': preferMeta,
    'prefer-namespace-import': preferNamespaceImport,
    /* eslint-enable @typescript-eslint/naming-convention */
  },
} as const satisfies TSESLint.FlatConfig.Plugin;

eslintPluginZodX.configs.recommended = {
  name: `${PLUGIN_NAME}/recommended`,
  files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
  /* eslint-disable @typescript-eslint/naming-convention */
  plugins: {
    'zod-x': eslintPluginZodX,
  },
  rules: {
    'zod-x/array-style': ['error'],
    'zod-x/no-any': ['error'],
    'zod-x/no-throw-in-refine': ['error'],
    'zod-x/prefer-meta': ['error'],
    'zod-x/prefer-namespace-import': ['error'],
  },
  /* eslint-enable @typescript-eslint/naming-convention */
};

export default eslintPluginZodX;
