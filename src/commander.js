/**
 * commander
 *
 * @flow
 */

import table from 'console.table'

type State = {
  defaultCommandInstalled: boolean
}

const state: state = {
  defaultCommandInstalled: false
}

const cmds = []

export default function commander(options: Options): void {
  return (input: string, context, filename, callback) => {
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

function execDefaultCommand(input, options) {

}

function printHelper(cmds, options): void {
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
