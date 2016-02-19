// gulp build --ENV -m PRODUCTION
// gulp build --ENV -m DEBUG
// gulp build --ENV -m DEBUG_LOCAL

// require('babel-core/register');

import webpackConfig from './webpack.config';
import setting from './setting';

import gulp from 'gulp';
import rename from 'gulp-rename';
import swig from 'gulp-swig';
import webpack from 'gulp-webpack';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';
import csswring from 'csswring';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import using from 'gulp-using';
import cached from 'gulp-cached';

import jsdoc from 'gulp-jsdoc';

import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import minimist from 'minimist';
import path from 'path';


let env = minimist(process.argv.slice(2))

const SETTING = setting((function() {
  return env['m'] != null ? { mode: env['m'] } : null;
})());

const SUPPORT_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 20',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 2.3',
  'and_ff >= 20',
  'and_chr >= 34'
];

/* ------------------------------ */
let plumberWithNotify = function() {
  return plumber({
    errorHandler: notify.onError("<%= error.message %>")
  });
};


for (let key in SETTING.TARGET) {
	let value = SETTING.TARGET[key];

	/**
   * ------------------------------
   * HTML TEMPLATE
   * ------------------------------
   */
  gulp.task(`${key}TemplateEngine`, function() {
    let options = {
      data: SETTING,
      defaults: { cache: false }
    }

    gulp.src([`${SETTING.CORE}${SETTING.ENGINE}/${key}/*.${SETTING.ENGINE_ATTRIBUTE}.html`]).
      pipe(plumberWithNotify()).
      pipe(using()).
      pipe(cached('swig')).
      pipe(swig(options)).
      pipe(rename(function(filePath) {
        filePath.basename = path.basename(filePath.basename, `.${SETTING.ENGINE_ATTRIBUTE}`);
      })).
      pipe(gulp.dest(`${SETTING.APPLICATION_DIST}${value}`));
  });

  /**
   * ------------------------------
   * STYLE
   * ------------------------------
   */
  gulp.task(`${key}Style`, function() {
    gulp.src([`${SETTING.CORE}${SETTING.STYLE}/${key}/*.scss`]).
      pipe(plumberWithNotify()).
      pipe(using()).
      pipe(cached(`${key}Style`)).
      pipe(sass().on('error', sass.logError)).
      pipe(postcss([
        autoprefixer({
          browsers: SUPPORT_BROWSERS,
          cascade: true
        }),
        mqpacker,
        csswring
      ])).
      pipe(gulp.dest(`${SETTING.APPLICATION_DIST}${value}/${SETTING.CSS}/`));
  });

  /**
   * ------------------------------
   * WEB PACK
   * ------------------------------
   */
  gulp.task(`${key}Webpack`, function(){
  	gulp.src([
      `${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.${SETTING.ALT_JS_ATTRIBUTE}`,
      `${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.${SETTING.ALT_JS_ATTRIBUTE}`
    ]).
    pipe(plumberWithNotify()).
    pipe(using()).
    pipe(cached('webpack')).
    pipe(webpack(webpackConfig(key, SETTING))).
    pipe(gulp.dest(`${SETTING.APPLICATION_DIST}${value}/${SETTING.JS}`));
  });


  /**
   * ------------------------------
   * JS DOC
   * ------------------------------
   */
  gulp.task(`${key}JsDoc`, function(){
    gulp.
      src([
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.${SETTING.ALT_JS_ATTRIBUTE}`,
        `${SETTING.ROOT}README.md`
      ]).
      pipe(jsdoc.parser(
        {
          name: `${key}JsDoc`,
          version: '1.0.0'
        }
      )).
      pipe(jsdoc.generator(`${SETTING.DOCS_DIST}`,
        {
          // テンプレートプラグイン「ink-docstrap」を使用する
          path: 'ink-docstrap',
          // プロジェクト名 ページタイトル・ヘッダーの左上に表示される
          systemName: 'Web Template',
          // HTMLのスタイルテーマ
          // cerulean, cosmo, cyborg, darkly, flatly, journal, lumen, paper, readable, sandstone, simplex, slate, spacelab, superhero, united, yeti
          theme: 'cosmo',
          // ソースコードに行番号を表示するかどうか
          linenums: true
        },
        {
          // ソースコードを記述したHTMLを生成するかどうか
          outputSourceFiles: true
        }
      ));
  });


  /**
	 * ------------------------------
   * File watching
	 * ------------------------------
   */
  console.log(`========== ${key}: ${value} ==========`);
  console.log(`[${SETTING.ENGINE}]\n  TARGET:\n    ${SETTING.CORE}${SETTING.ENGINE}/${key}/*.${SETTING.ENGINE_ATTRIBUTE}.html\n  TASK:\n    ${key}TemplateEngine`);
	console.log(`[${SETTING.STYLE}]\n  TARGET:\n    ${SETTING.CORE}${SETTING.STYLE}/${key}/*.scss\n  TASK:\n    ${key}Style`);
	console.log(`[webpack]\n  TARGET:\n    ${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.coffee\n    ${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.coffee\n    ${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.babel.js\n    ${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.babel.js\n  TASK:\n    ${key}Webpack`);
}


/**
 * ------------------------------
 * Server
 * ------------------------------
 */
gulp.task('server', function() {
  if (SETTING.MODE === 'DEBUG_LOCAL' && SETTING.PORT !== 80) {
    browserSync({
      startPath: './index.html',
      port: `${SETTING.PORT}`,
      server: {
        baseDir: `${SETTING.APPLICATION_DIST}`
      }
    });
  }
});


gulp.task('watch', ['server'], function() {
  for (let key in SETTING.TARGET) {
    let value = SETTING.TARGET[key];
    
    gulp.watch(
      [`${SETTING.CORE}${SETTING.ENGINE}/${key}/*.${SETTING.ENGINE_ATTRIBUTE}.html`],
      [`${key}TemplateEngine`]
    );
    gulp.watch(`${SETTING.APPLICATION_DIST}${value}*.html`).
      on('change', browserSync.reload)

    gulp.watch(
      [`${SETTING.CORE}${SETTING.STYLE}/${key}/*.scss`],
      [`${key}Style`]
    );
    gulp.watch(`${SETTING.APPLICATION_DIST}${value}/${SETTING.CSS}/*.css`).
      on('change', browserSync.reload)

    gulp.watch(
      [
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.coffee`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.coffee`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.babel.js`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.babel.js`
      ],
      [`${key}Webpack`]
    );
    gulp.watch(`${SETTING.APPLICATION_DIST}${value}/${SETTING.JS}/*.js`).
      on('change', browserSync.reload)
  }
});

gulp.task('default', ['watch']);

gulp.task('doc', function() {
  for (let key in SETTING.TARGET) {
    runSequence(`${key}JsDoc`);
  }
});

gulp.task('build', function() {
  for (let key in SETTING.TARGET) {
    runSequence(`${key}TemplateEngine`, `${key}Style`, `${key}Webpack`);
  }
});




    










