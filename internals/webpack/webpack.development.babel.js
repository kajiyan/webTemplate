const path = require('path');
const config = require('config');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const APP_DIR = path.join(process.cwd(), config.APP_DIR_PATH);

const tsConfigFile = path.resolve(process.cwd(), 'tsconfig.json');
const tsLintConfigFile = path.resolve(process.cwd(), 'tslint.json');

let sep = process.platform === 'win32' ? '\\' : '/';

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  devtool: 'source-map',
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
        ]
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   enforce: 'pre',
      //   exclude: /\^_.js$|\^_.jsx$|node_modules/,
      //   use: [
      //     {
      //       loader: 'eslint-loader'
      //       // options: { fix: true }
      //     }
      //   ]
      // },
      {
        test: /\.modernizrrc$/,
        loader: 'modernizr-loader!json-loader'
      }
    ]
  },
  performance: { hints: false }
});
