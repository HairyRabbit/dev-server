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

export default function quitCommand(input, options) {
  clearTimer()
  closeServer()
  options.log('Bye')
  options.repl.close()
  process.exit()
}
