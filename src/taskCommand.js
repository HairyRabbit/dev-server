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
import createTask, { clearTimer, getState } from './taskCreateor'

export const test = /^task$/i
export const name = 'task'
export const helper = 'run a task to build production mode code.'

export default function command(input = [], options) {
  if(!input.length) {
    execDefaultCommand(options)
  }
  const subCommand = input.shift()

  switch(subCommand) {
    case 'help': {
      printHelper(options)
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

function execDefaultCommand(options): void {
  const timer = getState('timer')
  if(!timer) {
    options.log(`Task not run`)
  } else {
    const createAt = getState('createAt')
    const begin = new Date(createAt).toTimeString().substr(0, 8)
    const hasError = getState('hasError')
    const taskStatus = Boolean(hasError) ? `task run failed` : `task completed`
    const buildStatus = getState('buildStatus') ? `but build failed` : `all is ok`
    options.log(`task start at ${begin}. ${taskStatus}. ${buildStatus}.`)
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
