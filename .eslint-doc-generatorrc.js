import prettierConfig from '@marcalexiei/prettier-config';
import * as prettier from 'prettier';

/** @type {import('eslint-doc-generator').GenerateOptions} */
export default {
  postprocess: (content) => {
    /** @type {import('prettier').Options} */
    const options = { parser: 'markdown', ...prettierConfig };
    return prettier.format(content, options);
  },
};
