/**
 * dll command
 *
 * | command   | description               |
 * |-----------|---------------------------|
 * | dll       | list dll bundles          |
 * | dll build | force build dll           |
 * | dll help  | print help info           |
 *
 * @flow
 */

import chalk from 'chalk'
import fs from 'fs'
import getPlugin from './webpackPluginMatcher'
import type { Options } from './'

export const test = /^dll$/i
export const name = 'dll'
export const helper = 'manage webpack dll'

export default function showCommand(input: Array<string>, options: Options): void {
  if(input.length && ~['help', 'h', '?'].indexOf(input[0])) {
    printHelper(options)
    return
  }

  const subCommand = input.shift()
  const plugin = getPlugin(options.compiler, 'AutoDll')

  switch(subCommand) {
    case 'build':
      buildDll(plugin, options)
      break
    default:
      listDll(plugin, options)
      break
  }
}

function listDll(plugin: Object, options: Options): void {
  try {
    const cache = JSON.parse(fs.readFileSync(plugin.cachePath, 'utf-8'))
    const header = `
Name: ${plugin.options.name}
Path: ${plugin.options.output}
`
    let out = ''
    for(let key in cache) {
      const item = cache[key]
      if('IDENT_DEVCLIENT' !== key && 'IDENT_POLYFILL' !== key) {
        out += ' '.repeat(2) + chalk.green('✓ ') + key + ': ' + item + '\n'
      }
    }

    console.log(header + '\n' + out)
  } catch(error) {
    console.error(error)
  }
}


function buildDll(plugin: Object, options: Options): void {
  plugin.build(err => {
    if(err) {
      console.error(err)
    }
  }, data => {
    console.log(data.toString({
      colors: true
    }))
  })
}

function printHelper(options: Options): void {
  console.log(`
Keymaps: dll

Avaiable commands:

dll        - show current dll state
dll build  - force build dll
dll help   - print help info
`)
}
