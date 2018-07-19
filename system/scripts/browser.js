const fs = require('fs');
const path = require('path');

const ARGV = require('minimist')(process.argv.slice(2));
const SETUP = require(path.join(process.cwd(), '/setup'))(ARGV.location);
const browserSync = require('browser-sync').create();
const chalk = require('chalk');
// const historyApiFallback = require('connect-history-api-fallback');

// 書き出し先のディレクトリパスを生成
const DIST_DIR = path.join(process.cwd(), SETUP.APPLICATION_DIST);

/**
 * iniltileze
 * @returns {Void} 返り値なし
 */
const iniltileze = () => {
  fs.access(DIST_DIR, error => {
    if (error) {
      // 書き出し先のディレクトリがない場合の処理
      console.error(chalk.red(error.message));
      return;
    }

    browserSync.init({
      files: [`${DIST_DIR}**/*`],
      injectChanges: true,
      server: {
        baseDir: DIST_DIR,
        index: 'index.html',
        middleware: [] /* historyApiFallback() */
      },
      port: SETUP.PORT
    });

    browserSync.watch(`${DIST_DIR}**/*.css`, (event, file) => {
      if (event === 'change') {
        browserSync.reload(`${DIST_DIR}**/*.css`);
      }
    });
  });
};

iniltileze();
