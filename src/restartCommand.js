/**
 * restart Server
 *
 * @flow
 */

import startServer, { closeServer, onServerCompileCompleted } from './serverStartOrRestart'

export const test = /^rs$/i
export const name = 'rs'
export const helper = 'restart dev server'


export default function restartCommand(input, options) {
  startServer(options.host, options.port, err => {
    if(err) {
      console.error(err)
      process.exit(2)
      return
    }

    options.log(`server restart...`)
  }, onServerCompileCompleted(options))
}
