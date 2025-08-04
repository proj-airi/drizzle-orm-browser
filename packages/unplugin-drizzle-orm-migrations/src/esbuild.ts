/**
 * This entry file is for esbuild plugin.
 *
 * @module
 */

import { newPlugin } from './index'

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * import { build } from 'esbuild'
 *
 * build({
 *   plugins: [require('@proj-airi/unplugin-drizzle-orm-migrations/esbuild')()],
 * })
 * ```
 */
const esbuild = newPlugin().esbuild
export default esbuild
export { esbuild as 'module.exports' }
