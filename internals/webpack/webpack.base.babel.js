const path = require('path');
const config = require('config');
const webpack = require('webpack');

const BUILD_DIR_PATH = path.join(process.cwd(), config.BUILD_DIR_PATH, config.ASSETS);

module.exports = options => ({
  cache: true,
  mode: options.mode,
  entry: options.entry,
  // グローバル（外部）を参照させたいライブラリ
  externals: {},
  output: Object.assign(
    {
      path: BUILD_DIR_PATH,
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
      sourceMapFilename: '[name].map',
      jsonpFunction: config.APP_NS,
      devtoolModuleFilenameTemplate: info => {
        return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
      }
    },
    options.output,
  ),
  plugins: options.plugins.concat([
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ProvidePlugin({
      // fetch を使用できるようにする
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(config)
    })
  ]),
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
        enforce: 'pre',
        exclude: /\^_.js$|\^_.jsx$|\^_.ts$|\^_.tsx$|node_modules/,
        use: [
          {
            loader: 'eslint-loader'
            // options: {
            //   fix: true
            // }
          }
        ]
      },
      {
        test: /\.js$|\.jsx$/,
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
                      // node: 'current',
                      browsers: config.BROWSERS
                    },
                    modules: false,
                    useBuiltIns: 'usage'
                  }
                ]
              ],
              // plugins: ['transform-runtime'],
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.modernizrrc$/,
        loader: 'modernizr-loader!json-loader'
      }
    ]
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(process.cwd(), '.modernizrrc')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules', 'app']
  },
  optimization: Object.assign(
    {
      splitChunks: {
        // cacheGroups 内にバンドルの設定を複数記述できる
        cacheGroups: {
          // 任意のキー名を指定
          vendor: {
            // node_modules 配下のモジュールをバンドル対象とする
            test: /node_modules/,
            /*
             * 共通モジュールをバンドルしたファイル（チャンク）の名前。
             * 'vendor'を指定したため、出力されるファイル名はvendor.bundle.jsになる。
             */
            name: `${config.ASSETS}/${config.SHARED}/${config.JS}/vendor`,
            /*
             * 共通モジュールとしてバンドルする対象の設定。initial, async, allが存在する。
             * バンドルしたファイルを複数に分割して出力し、非同期で読み込む場合などは状況に応じてasync やall を指定する。
             */
            chunks: 'async',
            enforce: true
          }
        }
      }
    },
    options.optimization
  ),
  devtool: options.devtool,
  target: 'web',
  performance: options.performance || {},
});
