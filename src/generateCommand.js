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
import generator from './generator/templateRender.js'
import type { Options } from './'

import viewTemplate from './templates/view.js.template'

export const test = /^g$/i
export const name = 'g'
export const helper = 'templates generator'

export default function showCommand(input: Array<string>, options: Options): void {
  if(input.length && ~['help', 'h', '?'].indexOf(input[0])) {
    printHelper(options)
    return
  }

  const subCommand = input.shift()
  const setupGenerator = generator(options.paths.src)

  fs.writeFileSync(path.resolve('src', name))

  switch(subCommand) {
    default:
      const viewT = viewTemplate({
        name: 'test',
        componentName: 'Test',
        isComponent: true,
        isFlow: true,
        isRedux: false,
        isClass: false,
        isState: false,
        isPure: false,
        isMapDispatch: true,
        isMapState: true,
        layout: `\
<div>
  Hello
</div>`
      })
      // printHelper(options)
      setupGenerator('foo', [
        [ 'view.js', viewT ]
      ])
      break
  }
}

function printHelper(options): void {
  options.log(`
Keymaps: g, generate

Generate templates


Avaiable commands:

g [TYPE] [NAME] --redux --class --pure

Required:

  type               - template type, one of <page[p], component[cp]>
  name               - template name, can use 'namespace/name' for nest dir
                       e.g. g cp foo/bar will generate to src/foo/bar.view.js

Options:

component and page type usage:

global:

  --redux            - add action.js update.js init.js and types.js, also add
                       connect, mapStateToProps, mapDispatchToProps to view.js
  --no-test          - don't generate all the test files
  --no-view          - don't generate view.js file
  --no-view-test     - don't generate view.test.js file
  --no-style         - don't generate style.css file
  --no-action        - don't generate action.js file
  --no-action-test   - don't generate action.test.js file
  --no-update        - don't generate update.js file
  --no-update-test   - don't generate update.test.js file
  --no-init          - don't generate init.js file
  --no-init-test     - don't generate init.test.js file
  --no-types         - don't generate types.js file

view:

  --class            - add a class component, the default was function component
  --pure             - also a class component, but use 'React.PureComponent'
                       replace 'React.Component'
  --no-map-state     - don't generate 'mapStateToProps' function, also 'connect'
  --no-map-dispatch  - don't generate 'mapDispatchToProps' function
  --lifecycle        - add lifecycle method, one of <didMount[dm], willUnmount[
                       vum], didCatch[dc], didUpdate[du], willMount[wm],
                       willReceiveProps[wp], willUpdate[wu], shouldUpdate[su]>
  --constcutor       - add a construtor function and call 'super(props)'
  --style-container  - add 'className={style.container}' to rendered top tag
  --top-tag          - top tag, default to 'div'
  --layout-id        - add layout snippets as render return value (TODO)
  --@component       - add 'import Foo from '~/components/foo''
  --@view            - add 'import Bar from '@/view/bar''
  --@action          - add 'import * as fooAction from '@/action/foo''
  --action-bind      - add 'import { bindActionCreators } from 'redux''
  --props            - add prop, e.g. 'foo:number', override about props
  --state            - add state, e.g. 'bar:string:42', override too

style:

  --classes          - initial classes
  --@style           - add '@value foo from '@/style/foo.css''
  --~style           - add '@value foo from '~/styles/foo.css''

types/action/update/init:

  --model            - add model type and initial model, e.g. 'foo:number=42'
  --action           - add action type, e.g. 'foo:bar:number,baz:string'
  --no-store         - don't override 'store.js'
`)
}
