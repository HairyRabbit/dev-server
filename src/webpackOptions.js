/**
 * advance webpack options
 *
 * @flow
 * @output
 */

import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import AutoDLLPlugin from '@rabbitcc/autodll-webpack-plugin'
import WhisperWebpackPlugin from '@rabbitcc/whisper-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

const tmp = path.resolve('tmp')
const src = path.resolve('src')
const dist = path.resolve('dist')
const config = path.resolve('config')
const images = path.resolve('public/images')
const nodeModules = path.resolve('node_modules')


export default function webpackOptions(env) {
  process.env.NODE_ENV = env
  process.env.DEBUG = process.env.DEBUG || true
  const isDev = env === 'development'
  const isProd = env === 'production'
  return {
    entry: {
      main: [
        path.resolve(src, 'index.js')
      ]
    },
    output: {
      path: tmp,
      filename: '[name].js',
      publicPath: '/'
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            forceEnv: env,
            highlightCode: true
          }
        }
      },{
        test: /\.css$/,
        use: isDev ? [{
          loader: 'style-loader',
          options: {
            sourceMap: true
          }
        },{
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: true,
            importLoaders: 1,
            camelCase: true
          }
        },{
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        }] : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              camelCase: true,
              minimize: true
            }
          },{
            loader: 'postcss-loader',
            options: {

            }
          }]
        })
      },{
        test: /\.(svg|jpg|png|webp|ttf|woff|woff2|eot)$/,
        use: 'url-loader'
      }]
    },
    resolve: {
      extensions: ['.js'],
      modules: [nodeModules],
      unsafeCache: true,
      symlinks: false,
      alias: { }
    },
    devtool: 'source-map',
    target: 'web',
    plugins: [].concat(
      new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),
      !isDev ? new ExtractTextPlugin('[name].css') : [],
      isDev ? new webpack.HotModuleReplacementPlugin() : [],
      isDev ? new webpack.NamedModulesPlugin() : new webpack.HashedModuleIdsPlugin(),
      new AutoDLLPlugin(),
      isDev ? new WhisperWebpackPlugin({
        optionPath: __dirname,
        checkSilent: false
      }) : [],
      // new CleanWebpackPlugin(tmp),
      new HtmlWebpackPlugin({
        inject: false,
        template: HtmlWebpackTemplate,
        title: 'Webpack',
        appMountIds: ['app', 'modal'],
        mobile: true,
        meta: [].concat(
          // metas
        ),
        window: {
          env: {
            apiHost: 'http://myapi.com/api/v1'
          }
        },
        scripts: [
          'vendor.js'
        ]
      }),
      // !isDev ? new FaviconsWebpackPlugin({
      //   logo: path.resolve(images, 'favicon.jpg'),
      //   prefix: tmp
      //   // title: websiteConfig.title
      // }) : [],
      !isDev ? new UglifyJsPlugin({
        cache: true,
        sourceMap: true,
        parallel: 2
      }) : []
    )
  }
}
