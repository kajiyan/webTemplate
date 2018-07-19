const fs = require('fs');
const path = require('path');

const ARGV = require('minimist')(process.argv.slice(2));
const SETUP = require(path.join(process.cwd(), '/setup'))(ARGV.location);
const chokidar = require('chokidar');
const chalk = require('chalk');
const glob = require('glob');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const moment = require('moment');

// 書き出し前のディレクトリパスを生成
const SRC_DIR = path.join(process.cwd(), SETUP.SRC_FOLDER_NAME);

// 書き出し先のディレクトリパスを生成
const DIST_DIR = path.join(process.cwd(), SETUP.APPLICATION_DIST);

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

    const REG_EXP = new RegExp(`^${SRC_DIR}|/index|/${SETUP.TEMPLATE_ENGINE_FOLDER_NAME}`, 'g');
    const EXT_REG_EXP = new RegExp(`${SETUP.TEMPLATE_ENGINE_ATTRIBUTE.replace(new RegExp(/\./, 'g'), '\\.')}$`);
    const IGNORE_REG_EXP = new RegExp(`^${SETUP.TEMPLATE_ENGINE_IGNORE_PREFIX.join('|^')}`);

    glob(`${SRC_DIR}/**/${SETUP.TEMPLATE_ENGINE_FOLDER_NAME}`, {}, function(error, dirs) {
      if (error) {
        console.error(chalk.red(error.message));
        return;
      }

      for (let i = 0, len = dirs.length; i < len; i++) {
        (dir => {
          (async () => {
            const files = await readdir(dir);

            for (let i = 0, len = files.length; i < len; i++) {
              const file = files[i];
              const fileInfo = path.parse(files[i]);

              // コンパイルするべきファイルか拡張子とファイル名から判断する、初期設定は「.e.html」
              if (!EXT_REG_EXP.test(fileInfo.base) || IGNORE_REG_EXP.test(fileInfo.base)) {
                continue;
              }

              const config = {
                delimiter: '@'
              };

              if (process.env.NODE_ENV === 'development' && ARGV.location === 'local') {
                const createWatcher = (() => {
                  const watcher = chokidar.watch(file);
                  const distFile = `${path.join(DIST_DIR, dir.replace(REG_EXP, ''))}${fileInfo.base.replace(
                    EXT_REG_EXP,
                    ''
                  )}.html`;

                  return () => {
                    watcher
                      .on('change', path => {
                        console.log(chalk.green(`✔︎ Update Script ${path}`));
                        (async () => {
                          const compileStartTime = moment();

                          const compiled = await (() => {
                            return new Promise((resolve, reject) => {
                              ejs.renderFile(file, { SETUP }, config, function(error, html) {
                                if (error) {
                                  console.error(chalk.red(error.message));
                                  reject(error);
                                  return;
                                }

                                resolve(html);
                              });
                            });
                          })();

                          await writeFile(distFile, compiled);

                          const diff = moment().diff(compileStartTime);

                          console.log(chalk.green(`✔︎ Compiled Style ${distFile} (${diff}ms)`));

                          return Promise.resolve();
                        })().catch(error => {
                          console.log(chalk.red(`✖︎ Compile Error ${distFile})`));
                          console.error(chalk.red(error.message));
                        });
                      })
                      .on('unlink', path => {
                        // ファイルが削除された時の処理
                        watcher.close();
                        console.log(chalk.yellow(`✔︎ Watcher Close ${path}`));
                      })
                      .on('error', () => {
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
                  const distFile = `${path.join(DIST_DIR, dir.replace(REG_EXP, ''))}${fileInfo.base.replace(
                    EXT_REG_EXP,
                    ''
                  )}.html`;
                  const compileStartTime = moment();

                  const compiled = await (() => {
                    return new Promise((resolve, reject) => {
                      ejs.renderFile(file, { SETUP }, config, function(error, html) {
                        if (error) {
                          console.error(chalk.red(error.message));
                          reject(error);
                          return;
                        }

                        resolve(html);
                      });
                    });
                  })();

                  await writeFile(distFile, compiled);

                  const diff = moment().diff(compileStartTime);

                  console.log(chalk.green(`✔︎ Compiled Style ${distFile} (${diff}ms)`));

                  return Promise.resolve();
                })().catch(error => {
                  console.log(chalk.red(`✖︎ Compile Error ${distFile})`));
                });
              }
            }
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
