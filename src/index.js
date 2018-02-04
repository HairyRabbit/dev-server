/**
 * start server
 *
 * @flow
 */

import nodeRepl, { type REPLServer } from 'repl'
import chalk from 'chalk'
import request from 'request'
import startServer, { closeServer, DefaultPort, DefaultHost } from './serverStartOrRestart'
import createTask, { clearTimer, DefaultTaskTimeout } from './taskCreateor'
import { execSync as exec } from 'child_process'
import type { Compiler } from 'webpack/cli/Compiler'

const host = DefaultHost
const port = DefaultPort
const DefaultPrompt = '> '

let repl = null
let webpackCurrentState = null

export default function start() {
  /**
   * initial REPLServer
   */
  repl = nodeRepl.start({
    prompt: DefaultPrompt,
    eval: commander
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
  }, onServerCompileCompleted)
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

  const json = data.toJson()
  if(json.errors.length) {
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

function onServerCompileCompleted(stats) {
  webpackCurrentState = !Boolean(stats.toJson().errors.length)
  setReplPrompt(repl)
  repl.displayPrompt()
}

function commander(input, context, filename, callback) {
  input = input.trim()
  const _input = input.split(' ')
  const cmd = _input.shift()
  setReplPrompt(repl)

  switch(cmd) {
  case '': {
    break
  }
  case 'rs': {
    startServer(host, port, err => {
      if(err) {
        console.error(err)
        process.exit(2)
        return
      }

      log(`Server restart...`)
    }, onServerCompileCompleted)
    break
  }
  case 'echo': {
    greeting()
    break
  }
  case 'info': {
    // console.table(Object.keys(printProjectInfo).map(key => {
    //   return {
    //     name: key,
    //     version: printProjectInfo[key]
    //   }
    // }))
    break
  }
  case 'st': {
    break
  }
  case 'test': {
    repl.displayPrompt()
    console.log('Test run async, please wait...')
    exec('yarn test --color', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        return;
      }
      console.log(stdout)
      console.log(stderr)
      repl.displayPrompt()
    })
    break
  }
  case '$': {
    try {
      const output = exec(input.split(' ').slice(1).join(' '))
      console.log(output.toString())
    } catch(error) {}
    break
  }
  case 'q': {
    clearTimer()
    closeServer()
    log('Bye')
    repl.close()
    process.exit()
    break
  }
  case '?':
  case 'h':
  case 'help':{
    console.log(`\
Avaiable commands:

rs\trestart server
$\texec command
q\texit
`)
    break
  }
  default: {
    // try {
    //   console.log(eval(input))
    // } catch(error) {
    //   console.log(`Hummmm... command ${log(cmd)} not supports, type ${log('?')} to print help.`)
    // }

    break
  }
  }

  callback(false);
}

/**
 * set repl prompt
 *
 * ```
 *   [WEBPACKCURRENTSTATE] >
 * ```
 */
function setReplPrompt(repl: REPLServer, color: string): void {
  const prompt = null !== webpackCurrentState
        ? (webpackCurrentState
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
