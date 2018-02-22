export default function webpackConfig(options) {
  let AutoDllPlugin
  for(let key in options.plugins) {
    const plugin = options.plugins[key]
    if(plugin.constructor.name === 'AutoDllPlugin') {
      AutoDllPlugin = plugin
      break
    }
  }
  AutoDllPlugin.options.makeOptions = function(options) {
    console.log(options)
  }
  AutoDllPlugin.options.debug = true
  AutoDllPlugin.options.injectBabelPolyfill = true
  AutoDllPlugin.options.injectDevClientScript = true
  // console.log(AutoDllPlugin.options)
  // console.log(AutoDllPlugin)
}
