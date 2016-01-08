// require('babel-core/register');

import webpackConfig from './webpack.config';
import setting from './setting';

import gulp from 'gulp';
import rename from 'gulp-rename';
import swig from 'gulp-swig';
import webpack from 'gulp-webpack';
import compass from 'gulp-compass';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import using from 'gulp-using';
import cached from 'gulp-cached';
import watch from 'gulp-watch';
import runSequence from 'run-sequence';
import minimist from 'minimist';
import path from 'path';


let env = minimist(process.argv.slice(2))

const SETTING = setting(env);

/* ------------------------------ */
let plumberWithNotify = function() {
  return plumber({
    errorHandler: notify.onError("<%= error.message %>")
  });
};


for (let key in SETTING.TARGET) {
	let value = SETTING.TARGET[key];

	// ------------------------------
  // HTML TEMPLATE
  // ------------------------------
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
      pipe(gulp.dest(`${SETTING.DIST}${value}`));
  });

  // ------------------------------
  // STYLE
  // ------------------------------
  gulp.task(`${key}Style`, function() {
  	gulp.src([`${SETTING.CORE}${SETTING.STYLE}/${key}/*.scss`]).
      pipe(plumberWithNotify()).
      pipe(using()).
      pipe(cached('style')).
      pipe(compass({
        project: __dirname,
        config_file: './config.rb',
        comments: false,
        css: `${SETTING.DIST}${value}/${SETTING.CSS}/`,
        sass: `${SETTING.CORE}${SETTING.STYLE}/${key}/`,
        image: `${SETTING.DIST}${value}/${SETTING.IMAGES}/`,
        javascript: `${SETTING.DIST}${value}/${SETTING.JS}/`,
        font: `${SETTING.DIST}${value}/${SETTING.FONT}/`,
      }));
  });

  // ------------------------------
  // WEB PACK
  // ------------------------------
  gulp.task(`${key}Webpack`, function(){
  	gulp.src([
      `${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.coffee`,
      `${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.coffee`,
      `${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.babel.js`,
      `${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.babel.js`
    ]).
    pipe(plumberWithNotify()).
    pipe(using()).
    pipe(cached('webpack')).
    pipe(webpack(webpackConfig(key, SETTING))).
    pipe(gulp.dest(`${SETTING.DIST}${value}/${SETTING.JS}`));
  });

  // ------------------------------
	// File watching
	// ------------------------------
  console.log(`========== ${key}: ${value} ==========`);
  console.log(`[${SETTING.ENGINE}]\n  TARGET:\n    ${SETTING.CORE}${SETTING.ENGINE}/${key}/*.${SETTING.ENGINE_ATTRIBUTE}.html\n  TASK:\n    ${key}TemplateEngine`);
	console.log(`[${SETTING.STYLE}]\n  TARGET:\n    ${SETTING.CORE}${SETTING.STYLE}/${key}/*.scss\n  TASK:\n    ${key}Style`);
	console.log(`[webpack]\n  TARGET:\n    ${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.coffee\n    ${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.coffee\n    ${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.babel.js\n    ${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.babel.js\n  TASK:\n    ${key}Webpack`);
}



gulp.task('watch', function() {
  for (let key in SETTING.TARGET) {
    let value = SETTING.TARGET[key];
    
    gulp.watch(
      [`${SETTING.CORE}${SETTING.ENGINE}/${key}/*.${SETTING.ENGINE_ATTRIBUTE}.html`],
      [`${key}TemplateEngine`]
    );

    gulp.watch(
      [`${SETTING.CORE}${SETTING.STYLE}/${key}/*.scss`],
      [`${key}Style`]
    );

    gulp.watch(
      [
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.coffee`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.coffee`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/*.babel.js`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.babel.js`
      ],
      [`${key}Webpack`]
    );
  }
});

gulp.task('default', ['watch']);

gulp.task('build', function() {
  for (let key in SETTING.TARGET) {
    runSequence(`${key}TemplateEngine`, `${key}Style`, `${key}Webpack`);
  }
});

    










