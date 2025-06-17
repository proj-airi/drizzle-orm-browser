/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import { DrizzleORMMigrations } from './index'

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
const webpack = DrizzleORMMigrations.webpack as typeof DrizzleORMMigrations.webpack
export default webpack
export { webpack as 'module.exports' }
