/**
 * start server
 *
 * @flow
 */

import nodeRepl, { type REPLServer } from 'repl'
import chalk from 'chalk'
import request from 'request'
import createTask, { clearTimer, DefaultTaskTimeout } from './taskCreateor'
import { execSync as exec } from 'child_process'
import type { Compiler } from 'webpack/cli/Compiler'
import commander, { install } from './commander'
import taskCommand, * as task from './taskCommand'
import quitCommand, * as quit from './quitCommand'
import rsCommand, * as rs from './restartCommand'
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

const options = {
  repl,
  setReplPrompt,
  webpackCurrentState,
  log,
  host,
  port,
  timeout
}

install(rs.test, rs.name, rs.helper, rsCommand)
install(task.test, task.name, task.helper, taskCommand)
install(quit.test, quit.name, quit.helper, quitCommand)

export default function start(): void {
  /**
   * initial REPLServer
   */
  repl = options.repl = nodeRepl.start({
    prompt: DefaultPrompt,
    eval: commander(options)
  })

  repl.pause()

  /**
   * say hello
   */
  greeting()

  /**
   * run compile prod code task pre 15 min
   */
  createTask(DefaultTaskTimeout, onTaskBeginCompile, onTaskCompleted)

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

function onTaskBeginCompile(compiler: Compiler): void {
  log('Webpack start to build production mode code.')
}

function onTaskCompleted(err: Error, data: Object): void {
  if(err) {
    log(`something wrong when task running.`)
    console.error(err)
    return
  }

  if(data.hasErrors()) {
    log('The production code compile failed.')
  } else {
    log('The production code compile success.')
  }
}

/**
 * say hello
 */
function greeting() {
  const url = 'https://api.4gml.com/yys/yy.php?fh=j'
  request(url, (err, res, body) => {
    if(err || 200 !== res.statusCode) {
      repl.displayPrompt()
      console.log(chalk`Happy Hack`)
    } else {
      repl.displayPrompt()
      console.log(chalk`{bold ${JSON.parse(body).hitokoto} :)}`)
    }
  })
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
function log() {
  repl.displayPrompt()
  console.log.apply(console, arguments)
}
