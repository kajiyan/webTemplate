const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('config');
const glob = require('glob');
const webpack = require('webpack');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const APP_DIR = path.join(process.cwd(), config.APP_DIR_PATH);
const BUILD_DIR = path.join(process.cwd(), config.BUILD_DIR_PATH, config.ASSETS);

const NODE_MODULES_DIR = path.resolve(process.cwd(), 'node_modules');
const modernizrConfigFile = path.resolve(process.cwd(), '.modernizrrc');
const tsConfigFile = path.resolve(process.cwd(), 'tsconfig.json');

let sep = process.platform === 'win32' ? '\\' : '/';

const entryRegExp = new RegExp(`^${APP_DIR}|index${sep}|${config.ALT_JS_FOLDER_NAME}${sep}`.replace(/\\/g, '\\\\'), 'g');
const extRegExp = new RegExp(`${config.ALT_JS_ATTRIBUTE.join('$|').replace(new RegExp(/\./, 'g'), '\\.')}$`);
const ignoreRegExp = new RegExp(`^${config.ALT_JS_IGNORE_PREFIX.join('|^')}`.replace(/\\/g, '\\\\'));

/**
 * readdir
 * @param {string|Buffer|URL} searchDir 読み込むファイルまでのパスを表現する文字列
 * @returns {Promise} rejectの場合はErrorが、
 *                    resolveの場合は読み込んだファイルのstring[] あるいはBuffer[] が返る
 */
const readdir = searchDir => {
  return new Promise((resolve, reject) => {
    fs.readdir(searchDir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      for (let i = 0, len = files.length; i < len; i++) {
        files[i] = `${searchDir}${files[i]}`;
      }

      resolve(files);
    });
  });
};

module.exports = (options) => {
  try {
    // 書き出し先のディレクトリが存在するか
    fs.accessSync(BUILD_DIR);

    const dirs = glob.sync(`${APP_DIR}/**/${config.ALT_JS_FOLDER_NAME}`);
    let entry = {}

    // コンパイルの対象となるディレクトリがない場合 Error を throw する
    if (dirs.length < 1) throw 'DIR_ZERO_RESULTS';

    for (let i = 0, dirsLen = dirs.length; i < dirsLen; i++) {
      (dir => {
        const files = fs.readdirSync(dir);

        for (let i = 0, len = files.length; i < len; i++) {
          files[i] = `${dir}${files[i]}`;
        }

        for (let j = 0, filesLen = files.length; j < filesLen; j++) {
          const file = files[j];
          const fileInfo = path.parse(files[j]);

           // コンパイルするべきファイルか拡張子とファイル名から判断する、初期設定は「.x.js」
          if (!extRegExp.test(fileInfo.base) || ignoreRegExp.test(fileInfo.base)) {
            continue;
          }
          const entryName = `${config.ASSETS}/${dir.replace(entryRegExp, '')}${config.JS}/${fileInfo.base.replace(extRegExp, '')}`;

          entry[entryName] = [];

          if (config.HOT_RELOAD) {
            entry[entryName].push('webpack-hot-middleware/client?reload=true');
          }

          entry[entryName].push(file);
        }
      })(path.normalize(`${dirs[i]}/`));
    }

    return {
      cache: true,
      mode: options.mode,
      entry,
      externals: {}, // グローバル（外部）を参照させたいライブラリ
      output: Object.assign(
        {
          path: BUILD_DIR,
          publicPath: '/',
          filename: '[name].js',
          chunkFilename: '[name].chunk.js',
          sourceMapFilename: '[name].map',
          jsonpFunction: config.APP_NS,
          devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
        },
        options.output,
      ),
      plugins: options.plugins.concat(
        (() => {
          let results = [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.ProvidePlugin({
              fetch: 'exports-loader?self.fetch!whatwg-fetch' // fetch を使用できるようにする
            }),
            new webpack.DefinePlugin({
              CONFIG: JSON.stringify(config)
            }),
            new CaseSensitivePathsPlugin(),
            new WatchMissingNodeModulesPlugin(NODE_MODULES_DIR)
          ];

          if (config.HOT_RELOAD) {
            results.push(
              new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: false
              }),
              new webpack.NamedModulesPlugin(),
              new webpack.NoEmitOnErrorsPlugin(),
              new webpack.HotModuleReplacementPlugin()
            );
          }

          return results;
        })()
      ),
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
      resolve: {
        alias: {
          modernizr$: modernizrConfigFile
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: ['node_modules', 'app'],
        plugins: [
          new TsconfigPathsPlugin({
            configFile: tsConfigFile
          })
        ]
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
      performance: options.performance || {}
    }
  } catch (err) {
    console.log(chalk.red('✖︎ Compile Error'));
    console.error(err);
  }
};
