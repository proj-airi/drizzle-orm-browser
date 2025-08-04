/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { newPlugin } from './index'

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
const rollup = newPlugin().rollup
export default rollup
export { rollup as 'module.exports' }
