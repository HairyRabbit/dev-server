/**
 * start server
 *
 * @flow
 */

import chalk from 'chalk'
import norequire from './reqioreNoCache'
import { execSync as exec } from 'child_process'
import repl from 'repl'

const port = '8080'
const host = '0.0.0.0'

let replServer, server, server2

function createServerInstace(host, port) {
  const createServer = norequire('./serverCreater').default
  server = createServer(host, port, 'development')
  server.listen(port, host, err => {
    if(err) {
      console.log(err)
      process.exit()
      return
    }

    console.log('Start server...')
    console.log(`Running on http://${host}:${port}`)
  })
  server2 = createServer(host, port, 'production')
  server2.listen(8081, host, err => {
    if(err) {
      console.log(err)
      process.exit()
      return
    }

    console.log('Start server2...')
    console.log(`Running on http://${host}:${port}`)
  })
}

export default function start() {
  replServer = repl.start({
    prompt: updateReplPrompt(),
    eval: myEval
  })

  createServerInstace(host, port)

  replServer.defineCommand('ls', {
    action(name) {
      console.log(`ls ${name}`)
    }
  })
}



function myEval(input, context, filename, callback) {
  input = input.trim()
  const _input = input.split(' ')
  const cmd = _input.shift()
  updateReplPrompt(replServer)

  switch(cmd) {
    case 'rs': {
      server.close()
      server = null
      server2.close()
      server2 = null
      createServerInstace(host, port)
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
      replServer.displayPrompt()
      console.log('Test run async, please wait...')
      exec('yarn test --color', (err, stdout, stderr) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log(stdout)
        console.log(stderr)
        replServer.displayPrompt()
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
      replServer.displayPrompt()
      console.log('Bye')
      replServer.close()
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

function updateReplPrompt(repl) {
  const now = new Date().toTimeString().substr(0, 5)
  const prompt = chalk.blue(`> ${now} `)
  if(repl) {
    repl.setPrompt(prompt)
    return
  }

  return prompt
}
