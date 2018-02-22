/**
 * require user webpack config file
 *
 * @flow
 */

import path from 'path'
import register from '@babel/register'
import forceRequire from './requireNoCache'

export default function requireUserWebpackConfig(prop: string = 'default'): any {
  try {
    const configPath = path.resolve('webpack.config.js')

    /**
     * use @babel/register to load es6 modules
     * disable cache support restart server will reload config files
     */
    register({
      only: [configPath],
      cache: false,
      plugins: ['@babel/plugin-transform-modules-commonjs']
    })

    /**
     * require user config without cache, use default export by default
     */
    const userWebpackConfig = forceRequire(configPath)
    return userWebpackConfig[prop]
  } catch(err) {
    /**
     * if not found module, just return null,
     * otherwise throw the errors
     */
    if(!err.message.match(/Cannot find module/)) {
      throw err
    }
    return null
  }
}
