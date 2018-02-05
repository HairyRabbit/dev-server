/**
 * start or restart server
 *
 * @flow
 */

import { identity as id } from 'lodash'
import webpack from 'webpack'
import norequire from './reqioreNoCache'

export const DefaultPort = '8080'
export const DefaultHost = '0.0.0.0'

let server = null

export default function startOrRestartServer(host: string = DefaultHost, port: string = DefaultPort, callback: Function, onCompleted?: Function): void {
  /**
   * close server if already started
   */
  if(server) {
    closeServer()
  }

  const createServer = norequire('./serverCreator').default
  /**
   * start the dev server
   */
  server = createServer(host, port, onCompleted)
  server.listen(port, host, callback)
}

export function closeServer() {
  server.close()
  server = null
}

export function onServerCompileCompleted(options) {
  return stats => {
    options.webpackCurrentState = !Boolean(stats.toJson().errors.length)
    options.setReplPrompt(options.repl)
    options.repl.displayPrompt()
  }
}
