const path = require('path');
const config = require('config');

const APP_DIR_PATH = path.join(process.cwd(), config.APP_DIR_PATH);

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: `${config.ASSETS}/${config.SHARED}/${config.JS}/vendor`,
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },
  performance: { hints: false }
});
