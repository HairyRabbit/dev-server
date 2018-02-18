/**
 * start server
 *
 * @flow
 */

import nodeRepl, { type REPLServer } from 'repl'
import chalk from 'chalk'
import createTask, { clearTimer, DefaultTaskTimeout } from './taskCreateor'
import { execSync as exec } from 'child_process'
import type { Compiler } from 'webpack/cli/Compiler'
import commander, { install } from './commander'
import taskCommand, * as task from './taskCommand'
import quitCommand, * as quit from './quitCommand'
import rsCommand, * as rs from './restartCommand'
import showCommand, * as show from './showCommand'
import dllCommand, * as dll from './dllCommand'
import generateCommand, * as generate from './generateCommand'
import startServer, {
  closeServer,
  DefaultPort,
  DefaultHost,
  onServerCompileCompleted
} from './serverStartOrRestart'

const host = DefaultHost
const port = DefaultPort
const timeout = DefaultTaskTimeout
const DefaultPrompt = '> '

let repl = null
let webpackCurrentState = null

export type Options = {
  repl: REPLServer,
  setReplPrompt: REPLServer => void,
  log: Array<string> => void,
  webpackCurrentState: boolean,
  host: string,
  port: string,
  timeout: number
}

const options: Options = {
  repl,
  setReplPrompt,
  webpackCurrentState,
  log,
  host,
  port,
  timeout
}

install(rs.test, rs.name, rs.helper, rsCommand)
install(generate.test, generate.name, generate.helper, generateCommand)
install(show.test, show.name, show.helper, showCommand)
install(task.test, task.name, task.helper, taskCommand)
install(dll.test, dll.name, dll.helper, dllCommand)
install(quit.test, quit.name, quit.helper, quitCommand)

export default function start(): void {
  /**
   * initial REPLServer
   */
  repl = options.repl = nodeRepl.start({
    prompt: DefaultPrompt,
    eval: commander(options)
  })

  options.log('Server starting...')

  repl.pause()

  /**
   * run compile prod code task pre 15 min
   */
  createTask(
    options.timeout,
    task.onTaskBeginCompile(options),
    task.onTaskCompleted(options)
  )

  /**
   * start web server to dev
   */
  startServer(host, port, err => {
    if(err) {
      console.error(err)
      process.exit(2)
      return
    }

    log(chalk`Server start on {blue http://${host}:${port}}, Webpack start compiling...`)
    repl.resume()
  }, onServerCompileCompleted(options))
}

/**
 * set repl prompt
 *
 * ```
 *   [WEBPACKCURRENTSTATE] >
 * ```
 */
function setReplPrompt(repl: REPLServer): void {
  const prompt = null !== options.webpackCurrentState
        ? (options.webpackCurrentState
           ? chalk.bgGreen.white(' DONE ')
           : chalk.bgRed.white(' FAIL ')) + ' ' + DefaultPrompt
        : DefaultPrompt
  repl.setPrompt(prompt)
}

/**
 * log util
 */
function log(...args: Array<string>) {
  repl.displayPrompt()
  console.log.apply(console, args)
}
