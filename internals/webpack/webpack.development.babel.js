const path = require('path');
const config = require('config');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const APP_DIR_PATH = path.join(process.cwd(), config.APP_DIR_PATH);

const dependencyHandlers = () => {

}

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  entry: {
    'index': [
      'webpack-hot-middleware/client?reload=true',
      path.join(APP_DIR_PATH, 'index/scripts/index.js')
    ]
  },
  devtool: 'eval-source-map',
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: false
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {},
  performance: { hints: false }
});
