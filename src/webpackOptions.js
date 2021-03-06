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
import AutoDLLPlugin from '@rabbitcc/autodll-webpack-plugin'
import AutoCDNPlugin from '@rabbitcc/autocdn-webpack-plugin'
import WhisperWebpackPlugin from '@rabbitcc/whisper-webpack-plugin'
import PodsWebpackPlugin from '@rabbitcc/pods-webpack-plugin'
import IconWebpackPlugin from '@rabbitcc/icon-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import isEnv from './isEnv'
import type { Host, Port } from './'

const tmp = path.resolve('tmp')
export const src = path.resolve('src')
export const dist = path.resolve('dist')
const config = path.resolve('config')
const publicDir = path.resolve('public')
const images = path.resolve('public/images')
const icons = path.resolve('public/icons')
const nodeModules = path.resolve('node_modules')

export default function makeWebpackOptions(env: string, host?: Host, port?: Port): Object {
  process.env.NODE_ENV = env
  const isDev = isEnv('development')(env)
  const isProd = isEnv('production')(env)
  return {
    entry: {
      main: [
        path.resolve(src, 'index.js')
      ]
    },
    output: {
      path: isDev ? tmp : dist,
      filename: isDev ? '[name].js' : '[name].[chunkhash].js',
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
            camelCase: true,
            localIdentName: '[path][name]__[local]--[hash:base64:5]'
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
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              camelCase: true,
              minimize: true,
              localIdentName: '[hash:base64:5]'
            }
          },{
            loader: 'postcss-loader',
            options: {
              sourceMap: true
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
      alias: {
        '~': src,
        '@@': images
      }
    },
    devtool: isDev ? 'source-map' : 'none',
    target: 'web',
    plugins: [].concat(
      new PodsWebpackPlugin({
        context: src,
        dir: [
          ['style', 'css'],
          'view',
          'action',
          'update',
          'types',
          'init'
        ]
      }),
      isDev ? new webpack.HotModuleReplacementPlugin() : [],
      isDev ? new webpack.NamedModulesPlugin() : new webpack.HashedModuleIdsPlugin(),
      isDev ? new AutoDLLPlugin({
        injectDevClientScript: true
      }) : new AutoCDNPlugin({
        report: false
      }),
      isDev ? new WhisperWebpackPlugin({
        optionPath: __dirname,
        checkSilent: false
      }) : [],
      !isDev ? new ExtractTextPlugin('[name].[contenthash].css') : [],
      !isDev ? new webpack.optimize.ModuleConcatenationPlugin() : [],
      !isDev ? new UglifyJsPlugin({
        cache: true,
        sourceMap: true,
        parallel: 2
      }) : [],
      new webpack.EnvironmentPlugin(['NODE_ENV']),
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
