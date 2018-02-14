/**
 * pods file struct resolve plugin
 *
 * syntax:
 *
 *  @/TYPE[/NAMESPACE]/NAME
 *
 * @flow
 */

export default class MyResolverPlugin {
  pluginId: string;

  constructor(options) {
    this.options = options
    this.pluginId = 'pods'
  }

  apply(compiler) {
    compiler.plugin('normal-module-factory', nmf => {
      nmf.plugin('before-resolve', (data, callback) => {
        if(!data.request.startsWith('@/')) {
          callback(null, data)
          return
        }

        const [_, type, ...file] = data.request.split('/')
        if(!isTypeRegister(this.options.dir, type)) {
          callback(null, data)
          return
        }
        const ext = resolveTypeExt(this.options.dir, type)
        data.request = `~/${file.join('/')}/${type}${ext}`
        callback(null, data)
      })
    })
  }
}
