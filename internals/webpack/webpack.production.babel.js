const path = require('path');
const config = require('config');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const saveLicense = require('uglify-save-license');

const APP_DIR_PATH = path.join(process.cwd(), config.APP_DIR_PATH);

module.exports = require('./webpack.base.babel')({
  mode: 'production',
  entry: {
    'index': [
      path.join(APP_DIR_PATH, 'index/scripts/index.js')
    ]
  },
  devtool: false,
  plugins: [],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: `${config.SHARED}/${config.JS}/vendor`,
          chunks: 'initial',
          enforce: true
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          output: {
            comments: saveLicense
          },
          compress: {
            drop_console: true
          },
          ie8: false,
          warnings: false
        }
      })
    ]
  },
  performance: { hints: false }
});
