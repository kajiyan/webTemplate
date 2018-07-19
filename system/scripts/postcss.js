const fs = require('fs');
const path = require('path');

const ARGV = require('minimist')(process.argv.slice(2));
const SETUP = require(path.join(process.cwd(), '/setup'))(ARGV.location);
const chokidar = require('chokidar');
const chalk = require('chalk');
const glob = require('glob');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const postcssConfig = require(path.join(process.cwd(), '/postcss.config'));
const mkdirp = require('mkdirp');
const moment = require('moment');

// 書き出し前のディレクトリパスを生成
const SRC_DIR = path.join(process.cwd(), SETUP.SRC_FOLDER_NAME);

// 書き出し先のディレクトリパスを生成
const DIST_DIR = path.join(process.cwd(), SETUP.APPLICATION_DIST);

process.on('unhandledRejection', console.dir);

/**
 * writeFile
 * PostCSSによって生成されたCSS文字列を対象のファイルに書き込む
 *
 * @param {string} file 書き込み対象のファイルまでのパスを表現する文字列
 * @param {string} data 書き込むCSS文字列
 * @returns {Promise} rejectの場合はErrorが、resolveの場合は空が返る
 */
let writeFile = function(file, data) {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(file), function(error) {
      if (error) {
        reject(error);
        return;
      }

      fs.writeFile(file, data, function(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });
};

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

/**
 * readFile
 * @param {string|Buffer|URL|integer} file 読み込むファイルまでのパスを表現する文字列
 * @returns {Promise} rejectの場合はErrorが、
 *                    resolveの場合は読み込んだファイルのstringあるいはBufferが返る
 */
let readFile = function(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: 'utf-8'
      },
      function(error, data) {
        if (error) {
          reject(error);
          return;
        }

        resolve(data);
      }
    );
  });
};

/**
 * @typedef Keydata
 * @type {Object}
 * @property {number} config PostCSSのオプション
 */

/**
 * compileStyle
 * PostCSSで変換する
 * @param {Keydata} keydata 必須引数
 * @return {Promise} resolveの場合は変換後のCSSの文字列を返す
 */
const compileStyle = function(keydata) {
  return new Promise((resolve, reject) => {
    postcssrc(keydata.config).then(
      ({ plugins, options }) => {
        postcss(plugins)
          .process(keydata.targetFile, options)
          .then(
            result => {
              resolve(result);
            },
            error => {
              reject(error);
            }
          );
      },
      error => {
        reject(error);
      }
    );
  });
};

/**
 * iniltileze
 * @returns {Void} 返り値なし
 */
let iniltileze = function() {
  fs.access(DIST_DIR, function(error) {
    if (error) {
      // 書き出し先のディレクトリがない場合の処理
      console.error(chalk.red(error.message));
      return;
    }

    let regExp = new RegExp(`^${SRC_DIR}|/index|/${SETUP.STYLE_FOLDER_NAME}`, 'g');
    let extRegExp = new RegExp(`${SETUP.STYLE_ATTRIBUTE.replace(new RegExp(/\./, 'g'), '\\.')}$`);
    let ignoreRegExp = (function() {
      let result = new RegExp(`^${SETUP.STYLE_IGNORE_PREFIX.join('|^')}`);
      return result;
    })();

    glob(`${SRC_DIR}/**/${SETUP.STYLE_FOLDER_NAME}`, {}, function(error, dirs) {
      if (error) {
        console.error(chalk.red(error.message));
        return;
      }

      for (let i = 0, dirsLen = dirs.length; i < dirsLen; i++) {
        (dir => {
          (async () => {
            let files = await readdir(dir);

            for (let j = 0, filesLen = files.length; j < filesLen; j++) {
              let file = files[j];
              let fileInfo = path.parse(files[j]);

              // コンパイルするべきファイルか拡張子とファイル名から判断する、初期設定は「.x.js」
              if (!extRegExp.test(fileInfo.base) || ignoreRegExp.test(fileInfo.base)) {
                continue;
              }

              const distFile = `${path.join(DIST_DIR, dir.replace(regExp, ''))}${SETUP.CSS}/${fileInfo.base.replace(
                extRegExp,
                ''
              )}.css`;

              const config = postcssConfig({
                setup: SETUP,
                // map: { inline: true },
                parser: false,
                from: file,
                to: distFile
              });

              if (process.env.NODE_ENV === 'development' && ARGV.location === 'local') {
                let createWatcher = (() => {
                  const watcher = chokidar.watch(file);

                  return () => {
                    watcher
                      .on('change', path => {
                        console.log(chalk.green(`✔︎ Update Style ${path}`));

                        (async () => {
                          const compileStartTime = moment();
                          const targetFile = await readFile(config.from);

                          // console.log(targetFile);
                          // console.log(config);

                          const compiled = await compileStyle({
                            config,
                            targetFile
                          });

                          await writeFile(distFile, compiled);

                          const diff = moment().diff(compileStartTime);

                          console.log(chalk.green(`✔︎ Compiled Style ${distFile} (${diff}ms)`));

                          return Promise.resolve();
                        })().catch(error => {
                          console.log(chalk.red(`✖︎ Compile Error ${distFile})`));
                          console.error(error);
                        });
                      })
                      .on('unlink', path => {
                        // ファイルが削除された時の処理
                        watcher.close();
                        console.log(chalk.yellow(`✔︎ Watcher Close ${path}`));
                      })
                      .on('error', path => {
                        watcher.close();
                        process.kill(process.pid, 'SIGHUP');
                        process.exit(0);
                      });
                  };
                })();

                createWatcher();
              } else if (
                (process.env.NODE_ENV === 'development' && ARGV.location === 'global') ||
                (process.env.NODE_ENV === 'production' && ARGV.location === 'global')
              ) {
                (async () => {
                  const compileStartTime = moment();
                  const targetFile = await readFile(config.from);
                  const compiled = await compileStyle({ config, targetFile });

                  await writeFile(distFile, compiled);

                  const diff = moment().diff(compileStartTime);

                  console.log(chalk.green(`✔︎ Compiled Style ${distFile} (${diff}ms)`));

                  return Promise.resolve();
                })().catch(error => {
                  console.log(chalk.red(`✖︎ Compile Error ${distFile})`));
                  console.error(error);
                });
              }
            }

            return Promise.resolve();
          })().catch(error => {
            console.error(chalk.red(error.message));
            return;
          });
        })(path.normalize(`${dirs[i]}/`));
      }
    });
  });
};

iniltileze();
