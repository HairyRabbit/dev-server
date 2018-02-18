/**
 * commander
 *
 * @flow
 */

import table from 'console.table'
import type { Options } from './'

type State = {
  defaultCommandInstalled: boolean
}

type Cmd = [RegExp, string, string, (Array<string>, Options) => void]

const state: state = {
  defaultCommandInstalled: false
}

const cmds: Array<Cmd> = []

export default function commander(options: Options) {
  return (input: string, context: Object, filename: string, callback: Function) => {
    input = input.trim()
    const _input = input.split(' ')
    const cmd = _input.shift()
    options.setReplPrompt(options.repl)

    /**
     * ignore blank input
     */
    if('' === cmd) {
      callback(false)
      return
    }

    /**
     * install default command
     */
    if(false === state.defaultCommandInstalled) {
      install(/^(help|h|\?)$/, 'help', 'print help info')
      state.defaultCommandInstalled = true
    }

    if(~['help', 'h', '?'].indexOf(cmd)) {
      printHelper(cmds, options)
      callback(false)
      return
    }

    const matched = cmds.find(([tester]) => tester.test(cmd))
    if(matched) {
      matched[3](_input, options)
    } else {
      execDefaultCommand(input, options)
    }

    callback(false)
  }
}

export function install(tester: RegExp,
                        name: string,
                        helper: string,
                        command: Function): void {
  cmds.push([tester, name, helper, command])
}

/**
 * exec defautl command, if not match and cmd option
 *
 * @TODO: implement default command, now just print helper.
 */
function execDefaultCommand(input: string, options: Options): void {
  printHelper(cmds, options)
}

/**
 * print helper, include all installed cmd name and description
 */
function printHelper(cmds: Array<Cmd>, options: Options): void {
  let output = table.getTable(cmds.map(([_, name, helper]) => ({
    command: name,
    helper: '- ' + helper
  })))
  output = output.split('\n')
  output.shift()
  output.shift()
  output = output.join('\n')
  options.log(`
Avaiable commands:

${output}`)
}
