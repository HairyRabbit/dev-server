/**
 * create a timer to compile production mode code pre 15 min.
 *
 * @flow
 */

import { identity as id } from 'lodash'
import webpack from 'webpack'
import inject from './entryInjecter'
import norequire from './reqioreNoCache'

let timer = null

export const DefaultTaskTimeout = 900000

function run(onBeginRun?: Function, onCompleted?: Function): void {
  const makeWebpackOptions = norequire('./webpackOptions').default
  const webpackOptions = makeWebpackOptions('production')
  const compiler = webpack(webpackOptions)
  onBeginRun(compiler)
  compiler.run(onCompleted)
}

export default function create(delay: number = DefaultTaskTimeout,
                               onBeginRun?: Function = id,
                               onCompleted?: Function = id): void {
  const _run = () => run(onBeginRun, onCompleted)
  timer = setTimeout(_run, delay)
  _run()
}

export function clearTimer() {
  clearTimeout(timer)
}
