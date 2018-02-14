/**
 * restart Server
 *
 * @flow
 */

import chalk from 'chalk'
import startServer, { onServerCompileCompleted } from './serverStartOrRestart'

export const test = /^rs$/i
export const name = 'rs'
export const helper = 'restart dev server'

export default function restartCommand(input, options) {
  if(input.length && ~['help', 'h', '?'].indexOf(input[0])) {
    printHelper(options)
    return
  }

  const subCommand = input.shift()
  const host = options.host
  let port = options.port
  if(subCommand) {
    port = subCommand
  }

  startServer(host, port, err => {
    if(err) {
      console.error(err)
      process.exit(2)
      return
    }

    options.log(chalk`server restart on {blue http://${host}:${port}}...`)
  }, onServerCompileCompleted(options))
}

/**
 * print help message
 */
function printHelper(options): void {
  options.log(`
Keymaps: rs

Avaiable commands:

rs         - restart dev server, webpack also recompile your code
rs [port]  - restart on given port
rs help    - print help info
`)
}
