/**
 * This entry file is for esbuild plugin.
 *
 * @module
 */

import { DrizzleORMMigrations } from './index'

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
const esbuild = DrizzleORMMigrations.esbuild as typeof DrizzleORMMigrations.esbuild
export default esbuild
export { esbuild as 'module.exports' }
