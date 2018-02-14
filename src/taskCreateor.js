/**
 * create a timer to compile production mode code pre 15 min.
 *
 * @flow
 */

import { identity as id } from 'lodash'
import webpack from 'webpack'
import isInstalled from './isModuleInstalled'
import inject from './entryInjecter'
import norequire from './reqioreNoCache'

type State = {
  timer: ?number,
  createAt: number,
  result: ?string,
  config: ?Object,
  hasError: ?Error,
  buildStatus: ?boolean
}

const state: State = {
  timer: null,
  createAt: 0,
  result: null,
  config: null,
  hasError: null,
  buildStatus: null
}

export const DefaultTaskTimeout = 900000

export function run(onBeginRun?: Function = id, onCompleted?: Function = id): void {
  const makeWebpackOptions = norequire('./webpackOptions').default
  const webpackOptions = makeWebpackOptions('production')

  /**
   * inject @babel/polyfill to entry
   */
  if(isInstalled('@babel/ployfill')) {
    inject(webpackOptions, '@babel/ployfill')
  }

  state.createAt = Date.now()
  state.config = webpackOptions
  const compiler = webpack(webpackOptions)
  onBeginRun(compiler)
  compiler.run((err, data) => {
    onCompleted(err, data)
    if(err) {
      state.hasError = err
    }
    state.buildStatus = data.hasErrors()
    state.result = data.toString({
      colors: true
    })
  })
}

export default function create(delay: number = DefaultTaskTimeout,
                               onBeginRun?: Function = id,
                               onCompleted?: Function = id): void {
  startTimer(delay, onBeginRun, onCompleted)
  run(onBeginRun, onCompleted)
}

export function startTimer(delay: number = DefaultTaskTimeout,
                           onBeginRun?: Function = id,
                           onCompleted?: Function = id): void {
  clearTimer()
  const _run = () => run(onBeginRun, onCompleted)
  state.timer = setTimeout(_run, delay)
}

export function clearTimer() {
  clearTimeout(state.timer)
  state.timer = null
}

export function getState<T>(key: T): $PropertyType<State, T> {
  return state[key]
}
