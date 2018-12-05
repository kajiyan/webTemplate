const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');
const config = require('config');
const glob = require('glob');
const mkdirp = require('mkdirp');
const moment = require('moment');
const pug = require('pug');

const APP_DIR_PATH = path.join(process.cwd(), config.APP_DIR_PATH);
const BUILD_DIR_PATH = path.join(process.cwd(), config.BUILD_DIR_PATH);

const options = {
  config,
  basedir: APP_DIR_PATH,
  cache: process.env.NODE_ENV === 'production',
  pretty: true
};

/**
 * writeFile
 * Pugによって生成されたHTML文字列を対象のファイルに書き込む
 *
 * @param {string} file 書き込み対象のファイルまでのパスを表現する文字列
 * @param {string} data 書き込むHTML文字列
 * @returns {Promise} rejectの場合はErrorが、resolveの場合は空が返る
 */
let writeFile = function(file, data) {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(file), function(err) {
      if (err) {
        reject(err);
        return;
      }

      fs.writeFile(file, data, function(err) {
        if (err) {
          reject(err);
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
    fs.readdir(searchDir, function(err, files) {
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

fs.access(BUILD_DIR_PATH, (err) => {
  if (err) {
    // 書き出し先のディレクトリがない場合ディレクトリを作成する
    mkdirp(BUILD_DIR_PATH);

    /*
    // 書き出し先のディレクトリがない場合はエラーメッセージを出力して終了
    console.error(chalk.red(err.message));
    process.exit(1);
    return;
    */
  }

  const REG_EXP = new RegExp(`^${APP_DIR_PATH}|index|/${config.TEMPLATE_ENGINE_FOLDER_NAME}`, 'g');
  const EXT_REG_EXP = new RegExp(`${config.TEMPLATE_ENGINE_ATTRIBUTE.replace(new RegExp(/\./, 'g'), '\\.')}$`);
  const IGNORE_REG_EXP = new RegExp(`^${config.TEMPLATE_ENGINE_IGNORE_PREFIX.join('|^')}`);

  glob(`${APP_DIR_PATH}**/${config.TEMPLATE_ENGINE_FOLDER_NAME}`, {}, (err, dirs) => {
    if (err) {
      console.error(chalk.red(err.message));
      return;
    }

    for (const dir of dirs) {
      (_dir => {
        (async () => {
          const files = await readdir(_dir);

          for (const file of files) {
            const fileInfo = path.parse(file);
            // コンパイルするべきファイルか拡張子とファイル名から判断する、初期設定は「.pug」
            if (!EXT_REG_EXP.test(fileInfo.base) || IGNORE_REG_EXP.test(fileInfo.base)) {
              continue;
            }

            if (process.env.NODE_ENV === 'development' && config.LOCATION === 'local') {
              const createWatcher = (() => {
                const watcher = chokidar.watch(file);
                const distFile = `${path.join(BUILD_DIR_PATH, dir.replace(REG_EXP, ''))}${fileInfo.base.replace(EXT_REG_EXP, '')}.html`;

                return () => {
                  watcher
                    .on('change', path => {
                      console.log(chalk.green(`✔︎ Update Template ${path}`));
                      (async () => {
                        const compileStartTime = moment();

                        const html = pug.renderFile(file, options);

                        await writeFile(distFile, html);

                        const diffTime = moment().diff(compileStartTime);

                        console.log(chalk.green(`✔︎ Compiled Style ${distFile} (${diffTime}ms)`));

                        return Promise.resolve();
                      })()
                        .catch(err => {
                          console.log(chalk.red(`✖︎ Compile Error ${distFile})`));
                          console.error(chalk.red(err.message));
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
              (process.env.NODE_ENV === 'development' && config.LOCATION === 'global') ||
              (process.env.NODE_ENV === 'production' && config.LOCATION === 'global')
            ) {
              (async () => {
                const distFile = `${path.join(BUILD_DIR_PATH, dir.replace(REG_EXP, ''))}${fileInfo.base.replace(EXT_REG_EXP, '')}.html`;
                const compileStartTime = moment();

                const html = pug.renderFile(file, options);

                await writeFile(distFile, html);

                const diffTime = moment().diff(compileStartTime);

                console.log(chalk.green(`✔︎ Compiled Style ${distFile} (${diffTime}ms)`));

                return Promise.resolve();
              })().catch(err => {
                console.log(chalk.red(`✖︎ Compile Error ${distFile})`));
                console.error(chalk.red(err.message));
              });
            } else {
              process.exit(1);
            }
          }
        })()
          .catch(err => {
            console.error(chalk.red(err.message));
            process.exit(1);
            return;
          });
      })(path.normalize(`${dir}/`));
    }
  });
});
