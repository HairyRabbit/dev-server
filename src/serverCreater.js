/**
 * create webpack-dev-server
 *
 * @flow
 * @output
 */

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import inject from './entryInjecter'
import norequire from './reqioreNoCache'

// { "name" : "foo"
// , "config" : { "port" : "8080" } }

const defaultServerOptions = {
  development: {
    hot: true,
    quiet: true,
    historyApiFallback: true
  },
  production: {
    quiet: true
  }
}

export default function createServer(host: string, port: string, env: string, onCompile?: Function, onDone?: Function): void {
  /**
   * inject options
   */
  const makeWebpackOptions = norequire('./webpackOptions').default
  const webpackOptions = makeWebpackOptions(env)
  const serverOptions = defaultServerOptions[env] || {}
  serverOptions.host = host
  serverOptions.port = port
  serverOptions.publicPath = webpackOptions.output.publicPath || '/'
  if('development' === env) {
    inject(webpackOptions, [
      `webpack-dev-server/client?http://${host}:${port}`,
      'webpack/hot/only-dev-server'
    ])
  }
  const compiler = webpack(webpackOptions)

  if(onCompile) {
    compiler.plugin('compile', onCompile)
  }
  if(onDone) {
    compiler.plugin('done', onDone)
  }

  return {
    server: new WebpackDevServer(compiler, serverOptions),
    compiler
  }
}
