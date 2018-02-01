/**
 * start or restart server
 *
 * @flow
 */

import webpack from 'webpack'
import NodeOutputFileSystem from 'webpack/lib/node/NodeOutputFileSystem'
import norequire from './reqioreNoCache'

let server

export default function startOrRestartServer(host: string, port: string, callback: Function, onDone?: Function): void {
  /**
   * close server
   */
  if(server) {
    server.close()
    server = null
  }

  const createServer = norequire('./serverCreater').default

  /**
   * build production mode code at next tick
   */
  function onCompile() {
    // process.nextTick(() => {
    //   const compiler = createServer(host, port, 'production').compiler
    //   compiler.outputFileSystem = new NodeOutputFileSystem()
    //   compiler.run(() => {})
    // })
  }

  /**
   * start the dev server
   */
  server = createServer(host, port, 'development', onCompile, onDone).server
  server.listen(port, host, callback)
}

export function closeServer() {
  server.close()
  server = null
}
