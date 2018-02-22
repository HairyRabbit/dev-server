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
import type { Host, Port } from './'


const defaultServerOptions = {
  hot: true,
  quiet: true,
  historyApiFallback: true,
  host: '0.0.0.0',
  port: '8080'
}

export default function createServer(host: Host, port: Port, onDone?: Function = id): void {
  /**
   * inject options
   */
  let webpackOptions = advanceWebpackConfig('development', host, port)

  /**
   * call user custom options as mutable
   *
   * @TODO: add options merge tools
   */
  const userWebpackConfig = requireUserWebpackConfig()
  userWebpackConfig && userWebpackConfig(webpackOptions)

  /**
   * override serverOptions with option.devServer
   */
  const serverOptions = webpackOptions.devServer || defaultServerOptions

  /**
   * setup host and port
   */
  serverOptions.host = host
  serverOptions.port = port

  /**
   * set default publicPath follow output.publicPath, default to '/'
   */
  serverOptions.publicPath = serverOptions.publicPath
    || webpackOptions.output.publicPath
    || '/'

  /**
   * inject WDS and HMR to entry
   */
  inject(webpackOptions, [
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server'
  ])

  const compiler = webpack(webpackOptions)
  onDone(compiler)

  /**
   * construtor server and start
   */
  return new WebpackDevServer(compiler, serverOptions)
}
