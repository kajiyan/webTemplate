const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');
const config = require('config');
const glob = require('glob');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const createPostcssConfig = require(path.join(process.cwd(), 'postcss.config'));
const mkdirp = require('mkdirp');
const moment = require('moment');

const APP_DIR_PATH = path.join(process.cwd(), config.APP_DIR_PATH);
const BUILD_DIR_PATH = path.join(process.cwd(), config.BUILD_DIR_PATH, config.ASSETS);

/**
 * writeFile
 * PostCSSによって生成されたCSS文字列を対象のファイルに書き込む
 *
 * @param {string} file 書き込み対象のファイルまでのパスを表現する文字列
 * @param {string} data 書き込むCSS文字列
 * @returns {Promise} rejectの場合はErrorが、resolveの場合は空が返る
 */
let writeFile = (file, data) => {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(file), err => {
      if (err) {
        reject(err);
        return;
      }

      fs.writeFile(file, data, err => {
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

/**
 * readFile
 * @param {string|Buffer|URL|integer} file 読み込むファイルまでのパスを表現する文字列
 * @returns {Promise} rejectの場合はErrorが、
 *                    resolveの場合は読み込んだファイルのstringあるいはBufferが返る
 */
let readFile = file =>  {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: 'utf-8'
      },
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      }
    );
  });
};

/**
 * compileStyle
 * PostCSSで変換する
 * @param {object} keydata 必須引数
 * @param {object} keydata.config PostCSSのオプション
 * @param {object} keydata.css コンパイル前のCSSの文字列
 * @return {Promise} resolveの場合は変換後のCSSの文字列を返す
 */
const compileStyle = keydata =>  {
  return new Promise((resolve, reject) => {
    postcssrc(keydata.config).then(
      ({ plugins, options }) => {
        postcss(plugins)
          .process(keydata.css, options)
          .then(
            result => {
              resolve(result);
            },
            err => {
              reject(err);
            }
          );
      },
      err => {
        reject(err);
      }
    );
  });
};

fs.access(BUILD_DIR_PATH, err => {
  if (err) {
    // 書き出し先のディレクトリがない場合ディレクトリを作成する
    mkdirp(BUILD_DIR_PATH);
  }

  let regExp = new RegExp(`^${APP_DIR_PATH}|index|/${config.STYLE_FOLDER_NAME}`, 'g');
  let extRegExp = new RegExp(`${config.STYLE_ATTRIBUTE.replace(new RegExp(/\./, 'g'), '\\.')}$`);
  let ignoreRegExp = (() => {
    let result = new RegExp(`^${config.STYLE_IGNORE_PREFIX.join('|^')}`);
    return result;
  })();

  glob(`${APP_DIR_PATH}**/${config.STYLE_FOLDER_NAME}/`, {}, (err, dirs) => {
    if (err) {
      console.error(chalk.red(err.message));
      return;
    }

    for (let i = 0, dirsLen = dirs.length; i < dirsLen; i++) {
      (dir => {
        (async () => {
          let files = await readdir(dir);

          for (let j = 0, filesLen = files.length; j < filesLen; j++) {
            let file = files[j];
            let fileInfo = path.parse(files[j]);

            // コンパイルするべきファイルか拡張子とファイル名から判断する、初期設定は「.pcss」
            if (!extRegExp.test(fileInfo.base) || ignoreRegExp.test(fileInfo.base)) {
              continue;
            }

            const distFile = `${path.join(BUILD_DIR_PATH, dir.replace(regExp, ''))}${config.CSS}/${fileInfo.base.replace(extRegExp, '')}.css`;

            const postcssConfig = createPostcssConfig({
              // map: { inline: true },
              env: process.env.NODE_ENV,
              parser: false,
              from: file,
              to: distFile
            });

            if (process.env.NODE_ENV === 'development' && config.LOCATION === 'local') {
              let createWatcher = (() => {
                const watcher = chokidar.watch(file);

                return () => {
                  watcher
                    .on('change', path => {
                      console.log(chalk.green(`✔︎ Update Style ${path}`));

                      (async () => {
                        const compileStartTime = moment();

                        const beforeCSS = await readFile(postcssConfig.from);

                        const afterCSS = await compileStyle({
                          config: postcssConfig,
                          css: beforeCSS
                        });

                        await writeFile(distFile, afterCSS);

                        const diffTime = moment().diff(compileStartTime);

                        console.log(chalk.green(`✔︎ Compiled Style ${distFile} (${diffTime}ms)`));

                        return Promise.resolve();
                      })().catch(err => {
                        console.log(chalk.red(`✖︎ Compile Error ${distFile})`));
                        console.error(err);
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
              (process.env.NODE_ENV === 'development' && config.LOCATION === 'global') ||
              (process.env.NODE_ENV === 'production' && config.LOCATION === 'global')
            ) {
              (async () => {
                const compileStartTime = moment();
                const beforeCSS = await readFile(postcssConfig.from);
                const afterCSS = await compileStyle({
                  config: postcssConfig,
                  css: beforeCSS
                });

                await writeFile(distFile, afterCSS);

                const diffTime = moment().diff(compileStartTime);

                console.log(chalk.green(`✔︎ Compiled Style ${distFile} (${diffTime}ms)`));

                return Promise.resolve();
              })().catch(error => {
                console.log(chalk.red(`✖︎ Compile Error ${distFile})`));
                console.error(error);
              });
            } else {
              process.exit(1);
            }
          }

          return Promise.resolve();
        })().catch(err => {
          console.error(chalk.red(err.message));
          return;
        });
      })(path.normalize(`${dirs[i]}/`));
    }
  });
});
