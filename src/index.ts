import type { TSESLint } from '@typescript-eslint/utils';

import { PLUGIN_NAME, PLUGIN_VERSION } from './meta.js';
import { arrayStyle } from './rules/array-style.js';
import { consistentImportSource } from './rules/consistent-import-source.js';
import { noAny } from './rules/no-any.js';
import { noEmptyCustomSchema } from './rules/no-empty-custom-schema.js';
import { noThrowInRefine } from './rules/no-throw-in-refine.js';
import { preferMeta } from './rules/prefer-meta.js';
import { preferMetaLast } from './rules/prefer-meta-last.js';
import { preferNamespaceImport } from './rules/prefer-namespace-import.js';
import { preferStrictObjet } from './rules/prefer-strict-object.js';
import { requireErrorMessage } from './rules/require-error-message.js';
import { requireSchemaSuffix } from './rules/require-schema-suffix.js';

const eslintPluginZodX = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  configs: {} as { recommended: TSESLint.FlatConfig.Config },
  rules: {
    /* eslint-disable @typescript-eslint/naming-convention */
    'array-style': arrayStyle,
    'consistent-import-source': consistentImportSource,
    'no-any': noAny,
    'no-empty-custom-schema': noEmptyCustomSchema,
    'no-throw-in-refine': noThrowInRefine,
    'prefer-meta': preferMeta,
    'prefer-meta-last': preferMetaLast,
    'prefer-namespace-import': preferNamespaceImport,
    'prefer-strict-object': preferStrictObjet,
    'require-error-message': requireErrorMessage,
    'require-schema-suffix': requireSchemaSuffix,
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
    'zod-x/array-style': 'error',
    'zod-x/no-any': 'error',
    'zod-x/no-empty-custom-schema': 'error',
    'zod-x/no-throw-in-refine': 'error',
    'zod-x/prefer-meta': 'error',
    'zod-x/prefer-meta-last': 'error',
    'zod-x/prefer-namespace-import': 'error',
    'zod-x/require-error-message': 'error',
    'zod-x/require-schema-suffix': 'error',
  },
  /* eslint-enable @typescript-eslint/naming-convention */
};

export default eslintPluginZodX;
