/* eslint import-x/no-extraneous-dependencies: ['error', { devDependencies: true }] */
import * as prettier from 'prettier';
import prettierConfig from '@marcalexiei/prettier-config';

/** @type {import('eslint-doc-generator').GenerateOptions} */
export default {
  postprocess: (content) => {
    /** @type {import('prettier').Options} */
    const options = { parser: 'markdown', ...prettierConfig };
    return prettier.format(content, options);
  },
};
