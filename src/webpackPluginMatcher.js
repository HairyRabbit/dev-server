/**
 * find webpack plugin from webpack.compiler.options
 *
 * @flow
 */

import type { Compiler } from 'webpack/lib/Compiler'

export default function getPlugin(compiler: Compiler, id: string): * {
  return compiler.options.plugins.find(plugin => {
    return plugin.pluginID === id || plugin.constructor.name === id
  })
}
