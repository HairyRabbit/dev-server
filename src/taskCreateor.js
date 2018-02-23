/**
 * create a timer to compile production mode code pre 15 min.
 *
 * @flow
 */

import { identity as id } from 'lodash'
import webpack from 'webpack'
import isInstalled from './isModuleInstalled'
import inject from './entryInjecter'
import advanceWebpackConfig from './webpackOptions'
import requireUserWebpackConfig from './requireUserWebpackConfig'

type State = {
  timer: ?TimeoutID,
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

export const DefaultTaskTimeout: number = 900000

export function run(onBeginRun?: Function = id, onCompleted?: Function = id): void {
  const webpackOptions = advanceWebpackConfig('production')

  /**
   * call user custom options as mutable
   */
  const userWebpackConfig = requireUserWebpackConfig('production') || requireUserWebpackConfig()
  userWebpackConfig && userWebpackConfig(webpackOptions)

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
  if(state.timer) {
    clearTimeout(state.timer)
  }
  state.timer = null
}

export function getState(key: $Keys<State>): * {
  return state[key]
}
