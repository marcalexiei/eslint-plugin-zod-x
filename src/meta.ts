import { readFileSync } from 'node:fs';

const packageJSON = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { name: string; version: string; homepage: string };

const {
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
} = packageJSON;

export { PLUGIN_NAME, PLUGIN_VERSION };

const PLUGIN_HOMEPAGE = packageJSON.homepage.replace(/#[^#]*$/, '');

export function getRuleURL(ruleID: string): string {
  return `${PLUGIN_HOMEPAGE}/blob/HEAD/docs/rules/${ruleID}.md`;
}
