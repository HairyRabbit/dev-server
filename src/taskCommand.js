/**
 * task commander
 *
 * | command     | description                       |
 * |-------------|-----------------------------------|
 * | task        | show current task status and help |
 * | task ls     | list bundle files                 |
 * | task run    | run task immediately              |
 * | task start  | start a new timer                 |
 * | task stop   | stop current timer                |
 * | task show   | show last task results            |
 * | task config | show webpack config objects       |
 * | task open   | open browsers                     |
 *
 * @flow
 */

import { get, isRegExp } from 'lodash'
import { execSync } from 'child_process'
import createTask, {
  startTimer,
  clearTimer,
  getState,
  run
} from './taskCreateor'

export const test = /^task$/i
export const name = 'task'
export const helper = 'run a task to build production mode code.'

export default function command(input = [], options) {
  if(!input.length) {
    execDefaultCommand(options)
  }
  const subCommand = input.shift()

  switch(subCommand) {
    case '?':
    case 'h':
    case 'help': {
      printHelper(options)
      break
    }
    case 'ls': {
      listFiles(input, options)
      break
    }
    case 'run': {
      runTask(input, options)
      break
    }
    case 'start': {
      startTask(input, options)
      break
    }
    case 'stop': {
      stopTask(input, options)
      break
    }
    case 'show': {
      printTaskResult(input, options)
      break
    }
    case 'config': {
      printTaskConfig(input, options)
      break
    }
    default: {
      execDefaultCommand(options)
      break
    }
  }
}

/**
 * list dist files
 */
function listFiles(input, options): void {
  const result = getState('result')
  if(!result) {
    options.log(`Task not run`)
  } else {
    const config = getState('config')
    const dir = config.output.path
    const ls = execSync(`ls -alhF --size --color ${dir}`)
    options.log(`
Directory: ${dir}

${ls}`)
  }
}

/**
 * run task immediately
 */
function runTask(input, options): void {
  run(onTaskBeginCompile(options), onTaskCompleted(options))
}

/**
 * start task timer
 */
function startTask(input, options): void {
  const timer = getState('timer')
  if(timer) {
    options.log('task timer was already exists, replace the current timer')
  } else {
    options.log('task timer create')
  }
  startTimer(
    options.timeout,
    onTaskBeginCompile(options),
    onTaskCompleted(options)
  )
}

/**
 * stop task timer
 */
function stopTask(input, options): void {
  clearTimer()
  options.log('Task timer was clean')
}

function printTaskConfig(input, options): void {
  const DefaultSpace = 4
  const config = getState('config')
  if(!config) {
    options.log(`Task not run`)
  } else {
    if(input.length) {
      const key = input[0]
      let field = get(config, key)
      if(key.startsWith('plugins')) {
        field = 'plugins'.length === key.length
          ? mapPlugins()
          : get(mapPlugins(), key.substr(8))
      }
      options.log(JSON.stringify(field, replacer, DefaultSpace))
    } else {
      options.log(JSON.stringify(config, replacer, DefaultSpace))
    }
  }

  function replacer(key, value) {
    if(isRegExp(value)) {
      return value.toString()
    }

    if('plugins' === key) {
      return mapPlugins()
    }

    return value
  }

  function mapPlugins() {
    return config.plugins.reduce((acc, plugin) => {
      acc[plugin.constructor.name] = plugin
      return acc
    }, {})
  }
}

function printTaskResult(input, options): void {
  const result = getState('result')
  if(!result) {
    options.log(`Task not run`)
  } else {
    options.log('\n' + result + '\n')
  }
}

function execDefaultCommand(options): void {
  const timer = getState('timer')
  if(!timer) {
    options.log(`Task not run`)
  } else {
    const createAt = getState('createAt')
    const begin = new Date(createAt).toTimeString().substr(0, 8)
    const hasError = getState('hasError')
    const taskStatus = Boolean(hasError) ? `Run failed` : `Completed`
    const buildStatus = getState('buildStatus') ? `But build failed` : `All is ok`
    options.log(`Task start at ${begin}. ${taskStatus}. ${buildStatus}.`)
  }

  printHelper(options)
}

function printHelper(options): void {
  options.log(`\
Avaiable commands:

task         - show current task status and help
task ls      - list bundle files
task run     - run task immediately
task start   - start a new timer
task stop    - stop current timer
task show    - show last task results
task config  - show webpack config objects
task open    - open browsers
task help    - print help info
`)
}

/**
 * log on task begin
 */
export function onTaskBeginCompile(options): Function {
  return compiler => {
    options.log('Webpack start to build production mode code.')
  }
}

/**
 * log on task completed
 */
export function onTaskCompleted(options): Function {
  return (err: Error, data: Object) => {
    if(err) {
      options.log(`something wrong when task running.`)
      console.error(err)
      return
    }

    if(data.hasErrors()) {
      options.log('The production code compile failed.')
    } else {
      options.log('The production code compile success.')
    }
    options.repl.displayPrompt()
  }
}
