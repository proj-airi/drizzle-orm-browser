/**
 * This entry file is for rspack plugin.
 *
 * @module
 */

import { newPlugin } from './index'

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
const rspack = newPlugin().rspack
export default rspack
export { rspack as 'module.exports' }
