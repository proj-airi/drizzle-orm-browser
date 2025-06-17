/**
 * This entry file is for rspack plugin.
 *
 * @module
 */

import { DrizzleORMMigrations } from './index'

/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.js
 * module.exports = {
 *  plugins: [require('@proj-airi/unplugin-drizzle-orm-migrations/rspack')()],
 * }
 * ```
 */
const rspack = DrizzleORMMigrations.rspack as typeof DrizzleORMMigrations.rspack
export default rspack
export { rspack as 'module.exports' }
