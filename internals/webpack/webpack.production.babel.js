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
  module: {
    // モジュールがexport されていなければエラーにする
    strictExportPresence: true,
    // 各ローダーの設定 指定した配列の後ろからローダーが適応される
    // oneOf 内は記述順に処理される
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        targets: {
                          browsers: config.BROWSERS
                        },
                        modules: false,
                        useBuiltIns: 'usage'
                      }
                    ]
                  ],
                  cacheDirectory: true
                }
              }
            ]
          },
          {
            test: /\.(ts|tsx)$/,
            include: APP_DIR,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true
                }
              }
            ]
          },
          {
            test: /\.(css|pcss)$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss'
                }
              }
            ]
          }
          // {
          //   test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
          //   enforce: 'pre',
          //   exclude: /\^_.js$|\^_.jsx$|\^_.ts$|\^_.tsx$|node_modules/,
          //   use: [
          //     {
          //       loader: 'eslint-loader'
          //       // options: { fix: true }
          //     }
          //   ]
          // },
        ]
      },
      {
        test: /\.modernizrrc$/,
        loader: 'modernizr-loader!json-loader'
      }
    ]
  },
  optimization: {
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
