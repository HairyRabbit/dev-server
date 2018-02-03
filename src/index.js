/**
 * start server
 *
 * @flow
 */

import nodeRepl from 'repl'
import chalk from 'chalk'
import request from 'request'
import startServer, { closeServer } from './serverStartOrRestart'
import { execSync as exec } from 'child_process'

const port = '8080'
const host = '0.0.0.0'

let repl, state = {}

export default function start() {
  repl = nodeRepl.start({
    prompt: updateReplPrompt(),
    eval: myEval
  })

  repl.pause()

  greeting()

  startServer(host, port, err => {
    if(err) {
      console.error(err)
      process.exit(2)
      return
    }

    state.serverState = chalk`{greenBright ::${port}}`
    repl.displayPrompt()
    console.log(chalk`Server start on {blue http://${host}:${port}}, Webpack still work...`)
    repl.resume()
  }, webpackDoneHandle)
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

function webpackDoneHandle(stats) {
  const json = stats.toJson()
  if(json.errors.length) {
    state.webpackState = chalk.bgRed.white(` FAIL `)
  } else {
    state.webpackState = chalk.bgGreen.white(` DONE `)
  }
  updateReplPrompt(repl)
  repl.displayPrompt()
}

function myEval(input, context, filename, callback) {
  input = input.trim()
  const _input = input.split(' ')
  const cmd = _input.shift()
  updateReplPrompt(repl)

  switch(cmd) {
    case 'rs': {
      startServer(host, port, err => {
        if(err) {
          console.error(err)
          process.exit(2)
          return
        }

        repl.displayPrompt()
        console.log(`Server restart...`)
      }, webpackDoneHandle)
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
      closeServer()
      repl.displayPrompt()
      console.log('Bye')
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
      try {
        console.log(eval(input))
      } catch(error) {
        console.log(`Hummmm... command ${cmd} not supports, type ${'?'} to print help.`)
      }

      break
    }
  }

  callback(false);
}

/**
 * prompt format
 *
 * > TIME SERVERSTATE WEBPACKSTATE
 */
function updateReplPrompt(repl: nodeRepl): ?string {
  let str = []
  const now = new Date().toTimeString().substr(0, 5)
  str.push(now)
  if(state.serverState) {
    str.push(state.serverState)
  }

  if(state.webpackState) {
    str.push(state.webpackState)
  }

  const prompt = chalk`{blue > ${str.join(' ')} }`

  if(repl) {
    repl.setPrompt(prompt)
    return null
  }

  return prompt
}
