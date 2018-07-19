/*
 * Documents
 * https://webpack.js.org/api/node/
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const saveLicense = require('uglify-save-license');
const moment = require('moment');

const ARGV = require('minimist')(process.argv.slice(2));
const SETUP = require(path.join(process.cwd(), '/setup'))(ARGV.location);

// 書き出し前のディレクトリパスを生成
const SRC_DIR = path.join(process.cwd(), SETUP.SRC_FOLDER_NAME);
// 書き出し先のディレクトリパスを生成
const DIST_DIR = path.join(process.cwd(), SETUP.APPLICATION_DIST);

const ENTRY_EXP = new RegExp(`^${SRC_DIR}|/index|/${SETUP.ALT_JS_FOLDER_NAME}`, 'g');
const EXT_REG_EXP = new RegExp(`${SETUP.ALT_JS_ATTRIBUTE.replace(new RegExp(/\./, 'g'), '\\.')}$`);
const IGNORE_REG_EXP = new RegExp(`^${SETUP.ALT_JS_IGNORE_PREFIX.join('|^')}`);

/**
 * readdir
 * @param {string|Buffer|URL} searchDir 読み込むファイルまでのパスを表現する文字列
 * @returns {Promise} rejectの場合はErrorが、
 *                    resolveの場合は読み込んだファイルのstring[]あるいはBuffer[]が返る
 */
const readdir = function(searchDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(searchDir, function(error, files) {
      if (error) {
        reject(error);
        return;
      }

      for (let i = 0, len = files.length; i < len; i++) {
        files[i] = `${searchDir}${files[i]}`;
      }

      resolve(files);
    });
  });
};

const getEntryFiles = function(dirs) {
  return new Promise((resolve, reject) => {
    let results = {};

    for (let i = 0, dirsLen = dirs.length; i < dirsLen; i++) {
      (dir => {
        (async () => {
          const files = await readdir(dir);

          for (let j = 0, filesLen = files.length; j < filesLen; j++) {
            const file = files[j];
            const fileInfo = path.parse(files[j]);

            // コンパイルするべきファイルか拡張子とファイル名から判断する、初期設定は「.x.js」
            if (!EXT_REG_EXP.test(fileInfo.base) || IGNORE_REG_EXP.test(fileInfo.base)) {
              continue;
            }
            const entryName = `${dir.replace(ENTRY_EXP, '')}${SETUP.JS}/${fileInfo.base.replace(EXT_REG_EXP, '')}`;

            results[entryName] = file;
          }

          if (i === dirsLen - 1) {
            resolve(results);
          }
        })();
      })(path.normalize(`${dirs[i]}/`));
    }
  });
};

/**
 * iniltileze
 * @returns {Void} 返り値なし
 */
const iniltileze = () => {
  return new Promise((resolve, reject) => {
    fs.access(DIST_DIR, error => {
      if (error) {
        // 書き出し先のディレクトリがない場合の処理
        console.error(chalk.red(error.message));
        return;
      }

      glob(`${SRC_DIR}/**/${SETUP.ALT_JS_FOLDER_NAME}`, {}, (error, dirs) => {
        if (error) {
          console.error(chalk.red(error.message));
          return;
        }

        (async () => {
          const entry = await getEntryFiles(dirs);

          const WEBPACK_CONFIG = {
            target: 'web',
            mode: process.env.NODE_ENV, // モード設定 v4系以降はmodeを指定しないと実行時に警告が出る
            devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
            watch: (() => {
              let result = true;

              if (process.env.NODE_ENV === 'production') {
                result = false;
              }

              return result;
            })(),
            entry,
            // グローバルを参照させたいobject
            externals: {},
            output: {
              path: DIST_DIR,
              pathinfo: true,
              filename: '[name].js',
              sourceMapFilename: '[name].map',
              // publicPath: '/',
              jsonpFunction: 'ims',
              devtoolModuleFilenameTemplate: info => {
                return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
              }
            },
            cache: true,
            // ローダーの設定
            module: {
              rules: [
                {
                  // test: /\.js|\.ts$/,
                  test: /\.ts$|\.tsx$/,
                  enforce: 'pre',
                  exclude: /^_.*\.ts$|node_modules\/(?!(dom7|swiper)\/).*/, // ローダーの処理対象から外すディレクトリ
                  use: [
                    {
                      loader: 'eslint-loader',
                      options: {
                        fix: true
                      }
                    }
                  ]
                },
                {
                  test: /\.ts$|\.tsx$/,
                  exclude: /^_.*\.ts$|node_modules\/(?!(dom7|swiper)\/).*/, // ローダーの処理対象から外すディレクトリ
                  use: [
                    {
                      loader: 'ts-loader'
                    }
                  ]
                },
                {
                  test: /\.js$/, // ローダーの処理対象ファイル
                  exclude: /node_modules\/(?!(dom7|swiper)\/).*/, // ローダーの処理対象から外すディレクトリ
                  // 利用するローダー
                  use: [
                    {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          [
                            'env',
                            {
                              targets: {
                                node: 'current',
                                browsers: ['last 2 version', 'android >= 4.4', 'ios_saf >= 10', 'ie >= 10']
                              },
                              modules: false,
                              useBuiltIns: true
                            }
                          ]
                        ],
                        plugins: ['transform-runtime']
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
              modules: [path.resolve(process.cwd(), 'app_components'), path.resolve(process.cwd(), 'node_modules')]
            },
            optimization: {
              splitChunks: {
                // cacheGroups内にバンドルの設定を複数記述できる
                cacheGroups: {
                  // 任意のキー名を指定
                  vendor: {
                    // node_modules配下のモジュールをバンドル対象とする
                    test: /node_modules/,
                    /*
                     * 共通モジュールをバンドルしたファイル（チャンク）の名前。
                     * 'vendor'を指定したため、出力されるファイル名はvendor.bundle.jsになる。
                     */
                    name: `${SETUP.SHARED}/${SETUP.JS}/vendor`,
                    /*
                     * 共通モジュールとしてバンドルする対象の設定。initial, async, allが存在する。
                     * バンドルしたファイルを複数に分割して出力し、非同期で読み込む場合などは状況に応じてasyncやallを指定する。
                     */
                    chunks: 'initial',
                    enforce: true
                  }
                }
              },
              minimizer: (() => {
                let result = [];

                if (process.env.NODE_ENV === 'production') {
                  Array.prototype.push.apply(result, [
                    new UglifyJsPlugin({
                      uglifyOptions: {
                        output: {
                          // beautify: false,
                          comments: saveLicense
                        },
                        compress: {
                          drop_console: true
                        },
                        ie8: false,
                        warnings: false
                      }
                    })
                  ]);
                }

                return result;
              })()
            },
            performance: { hints: false },
            plugins: (() => {
              let result = [];

              Array.prototype.push.apply(result, [
                new webpack.DefinePlugin({
                  SETUP: JSON.stringify(SETUP)
                })
              ]);

              return result;
            })()
          };

          const compiler = webpack(WEBPACK_CONFIG);

          if (process.env.NODE_ENV === 'development' && ARGV.location === 'local') {
            // 開発モードでの機動であればファイルを監視する
            const watcher = compiler.watch(
              {
                aggregateTimeout: 300,
                ignored: /node_modules/,
                poll: 1000
              },
              (error, stats) => {
                if (error) {
                  console.error(error.stack || error);
                  if (error.details) {
                    console.error(error.details);
                  }
                  console.error(chalk.red(error.message));
                  watcher.close();
                  process.kill(process.pid, 'SIGHUP');
                  process.exit(0);
                  return;
                }

                const info = stats.toJson();

                if (stats.hasErrors()) console.error(info.errors);
                if (stats.hasWarnings()) console.warn(info.warnings);

                console.log(stats.toString({ chunks: true, colors: true }));
                console.log(chalk.green(`✔︎ Update Script ${moment()}`));
              }
            );
          } else if (
            (process.env.NODE_ENV === 'development' && ARGV.location === 'global') ||
            (process.env.NODE_ENV === 'production' && ARGV.location === 'global')
          ) {
            // 開発モードでの機動であればファイルを書き出す
            compiler.run((error, stats) => {
              if (error) {
                console.error(chalk.red(error.message));
                return;
              }

              console.log(stats.toString({ chunks: false, colors: true }));
            });
          }

          resolve(WEBPACK_CONFIG);
        })().catch(error => {
          console.log(chalk.red('✖︎ Compile Error'));
          console.error(error);
        });
      });
    });
  });
};

(async () => {
  // await iniltileze();
  module.exports = await iniltileze();
})();
