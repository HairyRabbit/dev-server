/**
 * create webpack-dev-server
 *
 * @flow
 * @output
 */

import { identity as id } from 'lodash'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import express from 'express'
import inject from './entryInjecter'
import advanceWebpackConfig from './webpackOptions'
import requireUserWebpackConfig from './requireUserWebpackConfig'

const defaultServerOptions = {
  hot: true,
  quiet: true,
  historyApiFallback: true
}

export default function createServer(host: string, port: string, onDone?: Function = id): void {
  /**
   * inject options
   */
  const _webpackOptions = advanceWebpackConfig('development')
  const userWebpackConfig = requireUserWebpackConfig()
  const webpackOptions = userWebpackConfig
        ? userWebpackConfig(_webpackOptions)
        : _webpackOptions

  /**
   * @TODO: default host and port
   */
  const serverOptions = defaultServerOptions
  serverOptions.host = host
  serverOptions.port = port
  serverOptions.publicPath = webpackOptions.output.publicPath || '/'
  inject(webpackOptions, [
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server'
  ])
  const compiler = webpack(webpackOptions)
  onDone(compiler)

  /**
   * serve task bundle static files
   */
  // serverOptions.before = app => {
  //   app.use('/dist', express.static(_webpackOptions.dist))
  // }

  return new WebpackDevServer(compiler, serverOptions)
}
