import { describe, expect, it } from 'vitest';

import { getRuleURL } from './meta.js';

describe('getRuleURL', () => {
  /** @see https://github.com/marcalexiei/eslint-plugin-zod-x/pull/97 */
  it('should provide correct URLs (no hash please)', () => {
    const RULE_ID = 'rule-id-mock';
    expect(getRuleURL(RULE_ID)).toBe(
      `https://github.com/marcalexiei/eslint-plugin-zod-x/blob/HEAD/docs/rules/${RULE_ID}.md`,
    );
  });
});
