/**
 * dll command
 *
 * | command   | description               |
 * |-----------|---------------------------|
 * | dll       | show current dll state    |
 * | dll ls    | list dll bundles          |
 * | dll build | force create dll          |
 * | dll clear | clear dll directory files |
 * | dll help  | print help info           |
 *
 * @flow
 */

import getPlugin from './webpackPluginMatcher'

export const test = /^dll$/i
export const name = 'dll'
export const helper = 'manage webpack dll'

export default function showCommand(input: Array<string>, options): void {
  if(input.length && ~['help', 'h', '?'].indexOf(input[0])) {
    printHelper(options)
    return
  }

  const subCommand = input.shift()
  const plugin = getPlugin(options.compiler, 'AutoDllWebpackPlugin')

  switch(subCommand) {
    default:
      break
  }
}

function printHelper(options): void {
  options.log(`
Keymaps: dll

Avaiable commands:

dll        - show current dll state
dll ls     - list dll bundles
dll build  - force create dll
dll clear  - clear dll directory files
dll help   - print help info
`)
}
