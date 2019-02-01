const path = require('path');
const config = require('config');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const APP_DIR = path.join(process.cwd(), config.APP_DIR_PATH);
const tsConfigFile = path.resolve(process.cwd(), 'tsconfig.json');
const tsLintConfigFile = path.resolve(process.cwd(), 'tslint.json');

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: (() => {
    let results = [
      new ForkTsCheckerWebpackPlugin({
        async: false,
        watch: APP_DIR,
        tsconfig: tsConfigFile,
        tslint: tsLintConfigFile
      })
    ];

    return results;
  })(),
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
