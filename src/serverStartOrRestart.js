/**
 * start or restart server
 *
 * @flow
 */

import { identity as id } from 'lodash'
import webpack from 'webpack'
import createServer from './serverCreator'
import type { Options } from './'

export const DefaultPort = '8080'
export const DefaultHost = '0.0.0.0'

let server = null

export default function startOrRestartServer(host: string = DefaultHost,
                                             port: string = DefaultPort,
                                             callback: Function,
                                             onCompleted?: Function): void {
  /**
   * close server if already started
   */
  if(server) {
    closeServer()
  }

  /**
   * start the dev server
   */
  server = createServer(host, port, onCompleted)
  server.listen(port, host, callback)
}

export function closeServer() {
  if(server) {
    server.close()
    server = null
  }
}

export function onServerCompileCompleted(options: Options) {
  return compiler => {
    options.compiler = compiler
    compiler.plugin('done', stats => {
      options.webpackCurrentState = !Boolean(stats.hasErrors())
      options.setReplPrompt(options.repl)
      options.repl.displayPrompt()
    })
  }
}
