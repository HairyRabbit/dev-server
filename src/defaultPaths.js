/**
 * default app files structure
 *
 *  |- root/         # app root
 *    |- src/        # source dir
 *    |- dist/       # build
 *    |- config/     # configs
 *    |- public/     # asserts and others
 *      |- images/     # images
 *      |- icons/      # icon, must be '.svg' file
 *      |- fonts       # web fonts
 *
 * @flow
 */

import path from 'path'

export default {
  root: path.resolve(''),
  src: path.resolve('src'),
  dist: path.resolve('dist'),
  config: path.resolve('config'),
  public: path.resolve('public'),
  images: path.resolve('public/images'),
  icons: path.resolve('public/icons'),
  fonts: path.resolve('public/fonts'),
  modules: path.resolve('node_modules')
}
