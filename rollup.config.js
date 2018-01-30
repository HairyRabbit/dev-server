import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify-es'
import pkg from './package.json'

export default [{
  input: path.resolve('src/index.js'),
  output: path.resolve('lib/index.js')
},{
  input: path.resolve('src/serverCreater.js'),
  output: path.resolve('lib/serverCreater.js')
},{
  input: path.resolve('src/webpackOptions.js'),
  output: path.resolve('lib/webpackOptions.js')
}].map(({input, output}) => ({
  input: input,
  output: {
    file: output,
    format: 'cjs',
    exports: 'named'
  },
  plugins: [].concat(
    resolve({
      preferBuiltins: true
    }),
    babel({ exclude: 'node_modules/**' }),
    json({ exclude: 'node_modules/**' }),
    commonjs(),
    'production' === process.env.NODE_ENV ? uglify({}) : []
  ),
  external: [].concat(
    'repl',
    'child_process',
    'path',
    'fs',
    Object.keys(Object.assign(
      {},
      pkg.dependencies,
      pkg.optionalDependencies,
      pkg.peerDependencies
    ))
  )
}))
