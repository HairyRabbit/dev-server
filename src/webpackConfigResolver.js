/**
 * resolve webpack config
 *
 * @flow
 */

import requireWebpack from './requireUserWebpackConfig'

export default function resolveWebpackConfig(config: Object): Object {
  const webpackConfig = requireWebpack()
  if('function' !== typeof webpackConfig) {
    throw new Error('webpack.config.js require export as a function')
  } else {
    return webpackConfig(config)
  }
}
