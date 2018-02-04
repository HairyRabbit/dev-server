/**
 * create webpack-dev-server
 *
 * @flow
 * @output
 */

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import express from 'express'
import inject from './entryInjecter'
import norequire from './reqioreNoCache'

const defaultServerOptions = {
  hot: true,
  quiet: true,
  historyApiFallback: true
}

export default function createServer(host: string, port: string, onDone?: Function): void {
  /**
   * inject options
   */
  const _webpackOptions = norequire('./webpackOptions')
  const makeWebpackOptions = _webpackOptions.default
  const webpackOptions = makeWebpackOptions('development')
  const serverOptions = defaultServerOptions
  serverOptions.host = host
  serverOptions.port = port
  serverOptions.publicPath = webpackOptions.output.publicPath || '/'
  inject(webpackOptions, [
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server'
  ])
  const compiler = webpack(webpackOptions)

  if(onDone) {
    compiler.plugin('done', onDone)
  }

  /**
   * serve task bundle static files
   */
  serverOptions.before = app => {
    app.use('/dist', express.static(_webpackOptions.dist))
  }

  return new WebpackDevServer(compiler, serverOptions)
}
