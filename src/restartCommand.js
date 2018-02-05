/**
 * restart Server
 *
 * @flow
 */

import startServer, { onServerCompileCompleted } from './serverStartOrRestart'

export const test = /^rs$/i
export const name = 'rs'
export const helper = 'restart dev server'

export default function restartCommand(input, options) {
  if(input.length && ~['help', 'h', '?'].indexOf(input[0])) {
    printHelper(options)
    return
  }
  startServer(options.host, options.port, err => {
    if(err) {
      console.error(err)
      process.exit(2)
      return
    }

    options.log(`server restart...`)
  }, onServerCompileCompleted(options))
}

/**
 * print help message
 */
function printHelper(options): void {
  options.log(`
Keymaps: rs

Restart dev server, also webpack recompile your code.`)
}
