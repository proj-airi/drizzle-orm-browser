/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import { DrizzleORMMigrations } from './index'

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import DrizzleORMMigrations from '@proj-airi/unplugin-drizzle-orm-migrations/rolldown'
 *
 * export default {
 *   plugins: [DrizzleORMMigrations()],
 * }
 * ```
 */
const rolldown = DrizzleORMMigrations.rolldown as typeof DrizzleORMMigrations.rolldown
export default rolldown
export { rolldown as 'module.exports' }
