/**
 * show webpack stats details
 *
 * | command       | description              |
 * |---------------|--------------------------|
 * | show          | show current build state |
 * | show ls       | list all task state info |
 * | show [offset] | show one of tasks state  |
 * | show help     | print help info          |
 *
 * @flow
 */

import { getTable } from 'console.table'
import getPlugin from './webpackPluginMatcher'
import type { Options } from './'

export const test = /^show$/i
export const name = 'show'
export const helper = 'show webpack stats details'

export default function showCommand(input: Array<string>, options: Options): void {
  if(input.length && ~['help', 'h', '?'].indexOf(input[0])) {
    printHelper(options)
    return
  }

  const plugin = getPlugin(options.compiler, 'WhisperWebpackPlugin')
  if(!plugin) {
    options.log(`Can't find any tasks`)
  } else {
    const subCommand = input.shift()
    const tasks = plugin.tasks

    if('ls' === subCommand) {
      printTasks(tasks, options)
      return
    } else if(subCommand){
      const offset = parseInt(subCommand)
      const len = tasks.length
      if(!isNaN(offset) || offset >= 0) {
        const task = tasks[len + offset]
        if(task) {
          options.log('\n' + task.stats.toString({
            colors: true
          }) + '\n')
        } else {
          options.log(`Error, the offset out of range, tasks max length was ${len}`)
        }
      } else {
        options.log(`TypeError, 'show [offset]' require a negative number, e.g. last one status was 'show -1'`)
      }
    } else {
      options.log('\n' + tasks[tasks.length - 1].stats.toString({
        colors: true
      }) + '\n')
    }
  }
}

function printTasks(tasks: Array<Object>, options: Options): void {
  const out = tasks.map(task => {
    const { id, type, result } = task
    return {
      ID: id.substr(0, 8),
      TYPE: type,
      RESULT: result
    }
  })
  return options.log(`Tasks list length: ${tasks.length}: \n` + getTable(out))
}

function printHelper(options: Options): void {
  options.log(`
Keymaps: show

Avaiable commands:

show           - show webpack last build status
show ls        - list all the task
show [offset]  - show status by offset, e.g. show -1 mean the last build status
show help      - print help info
`)
}
