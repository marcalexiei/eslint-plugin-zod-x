import type { UserWorkspaceConfig } from 'vitest/config';

/**
 * Public shape of `index.js`, which is plain JavaScript and therefore has no types of
 * its own. `index.js` annotates its implementation against this declaration, so drift
 * between the two is a type error.
 */
export declare function definePluginTestProject(name: string): UserWorkspaceConfig;
