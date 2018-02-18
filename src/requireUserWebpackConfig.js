/**
 * require user webpack config file
 *
 * @flow
 */

import path from 'path'
import norequire from './reqioreNoCache'

export default function requireUserWebpackConfig(prop: string = 'default'): any {
  try {
    const userWebpackConfig = norequire(path.resolve('webpack.config.js'))
    return userWebpackConfig[prop]
  } catch(err) {
    return null
  }
}
