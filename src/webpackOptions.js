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
import IconWebpackPlugin from '@rabbitcc/icon-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

const tmp = path.resolve('tmp')
const src = path.resolve('src')
const dist = path.resolve('dist')
const config = path.resolve('config')
const images = path.resolve('public/images')
const icons = path.resolve('public/icons')
const nodeModules = path.resolve('node_modules')

export default function makeWebpackOptions(env) {
  process.env.NODE_ENV = env
  process.env.DEBUG = process.env.DEBUG || true
  const isDev = env === 'development'
  const isProd = env === 'production'
  return {
    mode: env,
    entry: {
      main: [
        path.resolve(src, 'index.js')
      ]
    },
    output: {
      path: isDev ? tmp : dist,
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
        test: /\.svg$/,
        include: [icons],
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            forceEnv: env,
            highlightCode: true
          }
        },{
          loader: '@rabbitcc/icon-loader'
        }]
      },{
        test: /\.(svg|jpg|png|webp|ttf|woff|woff2|eot)$/,
        exclude: [icons],
        use: {
          loader: 'url-loader',
          options: {
            limit: isDev ? undefined : 50000
          }
        }
      }]
    },
    resolve: {
      extensions: ['.js'],
      modules: [nodeModules],
      unsafeCache: true,
      symlinks: false,
      alias: { }
    },
    devtool: isDev ? 'source-map' : 'none',
    target: 'web',
    plugins: [].concat(
      isDev ? new webpack.HotModuleReplacementPlugin() : [],
      isDev ? new webpack.NamedModulesPlugin() : new webpack.HashedModuleIdsPlugin(),
      isDev ? new AutoDLLPlugin() : [],
      isDev ? new WhisperWebpackPlugin({
        optionPath: __dirname,
        checkSilent: false
      }) : [],
      !isDev ? new ExtractTextPlugin('[name].css') : [],
      !isDev ? new CleanWebpackPlugin(['dist'], { root: __dirname }) : [],
      !isDev ? new webpack.optimize.ModuleConcatenationPlugin() : [],
      !isDev ? new UglifyJsPlugin({
        cache: true,
        sourceMap: true,
        parallel: 2
      }) : [],
      new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),
      new IconWebpackPlugin({
        context: icons
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: HtmlWebpackTemplate,
        title: 'Webpack',
        appMountIds: ['app', 'modal'],
        mobile: true,
        meta: [].concat(
          // metas
          {
            "http-equiv": "Content-Security-Policy",
            "content": "default-src 'self' 'unsafe-inline' localhost:8080/*;"
          }
        ),
        window: {
          env: {
            apiHost: 'http://myapi.com/api/v1'
          }
        }
      })
      // !isDev ? new FaviconsWebpackPlugin({
      //   logo: path.resolve(images, 'favicon.jpg'),
      //   prefix: tmp
      //   // title: websiteConfig.title
      // }) : [],
    )
  }
}
