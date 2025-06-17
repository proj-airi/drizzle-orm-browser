/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { DrizzleORMMigrations } from './index'

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import DrizzleORMMigrations from '@proj-airi/unplugin-drizzle-orm-migrations/rollup'
 *
 * export default {
 *   plugins: [Unused()],
 * }
 * ```
 */
const rollup = DrizzleORMMigrations.rollup as typeof DrizzleORMMigrations.rollup
export default rollup
export { rollup as 'module.exports' }
