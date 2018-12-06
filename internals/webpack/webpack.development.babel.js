const path = require('path');
const config = require('config');

const APP_DIR_PATH = path.join(process.cwd(), config.APP_DIR_PATH);

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [],
  optimization: {},
  performance: { hints: false }
});
