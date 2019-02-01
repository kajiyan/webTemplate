const path = require('path');
const config = require('config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const saveLicense = require('uglify-save-license');

// const APP_DIR = path.join(process.cwd(), config.APP_DIR_PATH);
const tsConfigFile = path.resolve(process.cwd(), 'tsconfig.json');
const tsLintConfigFile = path.resolve(process.cwd(), 'tslint.json');

module.exports = require('./webpack.base.babel')({
  bail: true,
  mode: 'production',
  devtool: false,
  plugins: (() => {
    let results = [
      new ForkTsCheckerWebpackPlugin({
        async: false,
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
    },
    minimizer: [
      new UglifyJsPlugin({
        // parallel を指定すると 'ERROR in {filename}.js from UglifyJs' というエラーが出力される
        // parallel: true,
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
