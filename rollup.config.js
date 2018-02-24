import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { createFilter } from 'rollup-pluginutils'
import pkg from './package.json'

export default [{
  input: path.resolve('src/index.js'),
  output: path.resolve('lib/index.js')
}].map(({input, output}) => ({
  input: input,
  output: {
    file: output,
    format: 'cjs',
    exports: 'named'
  },
  plugins: [].concat(
    template(),
    resolve({
      preferBuiltins: true
    }),
    babel({ exclude: 'node_modules/**' }),
    json({ exclude: 'node_modules/**' }),
    commonjs()
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


function template(options = {}){
  const filter = createFilter([ '**/*.template'], 'node_modules/**')

  return {
    transform(code, id) {
      if(!filter(id)) {
        return
      }

      const templatesPath = path.resolve('src/templates')

      const output = `\
import nunjucks from "nunjucks";
nunjucks.configure(${JSON.stringify(templatesPath)}, {
  trimBlocks: true,
  throwOnUndefined: true,
  lstripBlocks: true
});
export default function templateRender(ctx) {
  return nunjucks.renderString(${JSON.stringify(code)}, ctx);
};
`
      return {
        code: output,
        map: { mappings: '' }
      }
    }
  }
}
