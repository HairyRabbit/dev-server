/**
 * generate command
 *
 * | command | description               |
 * |---------|---------------------------|
 * | g       | generate templates        |
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import { template } from 'lodash'

export const test = /^g$/i
export const name = 'g'
export const helper = 'templates generator'

export default function showCommand(input: Array<string>, options): void {
  if(input.length && ~['help', 'h', '?'].indexOf(input[0])) {
    printHelper(options)
    return
  }

  const subCommand = input.shift()
  const content = fs.readFileSync(
    path.resolve(__dirname, '../templates/view.js.template'), 'utf-8'
  )
  console.log(content)
  console.log(
    template(content)({
      name: 'test',
      componentName: 'Test',
      isComponent: true,
      isFlow: true,
      isRedux: true,
      isClass: true,
      isState: true,
      isPure: true
    })
  )

  switch(subCommand) {
    default:
      printHelper(options)
      break
  }
}

function printHelper(options): void {
  options.log(`
Keymaps: g

Avaiable commands:

g [TYPE] [NAME] --redux --class --pure

Required:

  type     - template type, one of <page[p], component[cp]>
  name     - template name, can use 'namespace/name', e.g. g cp foo/bar

Options:

  --redux    - add action.js update.js init.js and types.js, also add
               connect, mapStateToProps, mapDispatchToProps to view.js
  --class    - add a class component, the default was function component
  --pure     - also a class component, but use 'React.PureComponent'
               replace 'React.Component'
  --no-test  - don't generate test files
`)
}
