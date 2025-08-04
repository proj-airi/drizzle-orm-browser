/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import { newPlugin } from './index'

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * module.exports = {
 *  plugins: [require('@proj-airi/unplugin-drizzle-orm-migrations/webpack')()],
 * }
 * ```
 */
const webpack = newPlugin().webpack
export default webpack
export { webpack as 'module.exports' }
