/**
 * quit repl
 *
 * 1. close server
 * 2. close repl
 * 3. clear task
 */

import { closeServer } from './serverStartOrRestart'
import { clearTimer } from './taskCreateor'

export const test = /^(q|quit|exit)$/
export const name = 'quit'
export const helper = 'quit repl'

export default function quitCommand(input: Array<string>, options): void {
  if(input.length && ~['help', 'h', '?'].indexOf(input[0])) {
    printHelper(options)
    return
  }

  clearTimer()
  closeServer()
  options.log('Bye')
  options.repl.close()
  process.exit()
}

/**
 * print help message
 */
function printHelper(options): void {
  options.log(`
Keymaps: q, quit, exit

Quit this REPL, close server and clean task timer.`)
}
