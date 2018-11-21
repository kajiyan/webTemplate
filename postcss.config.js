const path = require('path');
const browserslist = require('browserslist');
const config = require('config');
const stylelint = require('stylelint');

// https://browserl.ist/?q=%3E0.25%25%2C+ie+11%2C+not+op_mini+all%2C+not+Opera+55
const browsers = browserslist('>0.25%, ie 11, not op_mini all, not Opera 55');

module.exports = ctx => ({
  map: ctx.env === 'production' ? false : { inline: true },
  parser: ctx.parser ? 'sugarss' : false,
  // syntax: ctx.syntax ? ctx.syntax : undefined,
  // stringifier: ctx.options.stringifier ? ctx.stringifier : undefined,
  from: ctx.from,
  to: ctx.to,
  plugins: {
    'postcss-custom-properties': {},
    'postcss-simple-vars': {
      silent: true,
      variables: config
    },
    'postcss-calc': {},
    'doiuse': {
      'browsers': browsers
    },
    'stylelint': {},
    'postcss-import': (() => {
      let result = {};
      result.path = ['src'];
      result.plugins = [stylelint()];
      return result;
    })(),
    // 'postcss-short': {},
    // 'postcss-apply': {},
    'postcss-easings': {},
    'postcss-extend': {},
    'postcss-mixins': {
      mixins: {
        lerp: (mixin, json) => {
          const keydata = JSON.parse(json.replace(/^'+|'+$/g, ''));
          const m = (keydata['max']['to'] - keydata['min']['to']) / (keydata['max']['view'] - keydata['min']['view']);
          const b = keydata['max']['to'] - m * keydata['max']['view'];
          let sign = '+';

          if (b < 0) {
            sign = '-';
            b = Math.abs(b);
          }

          return { [keydata.property]: `calc(${m * 100}vw ${sign} ${b}px)` };
        }
      }
    },
    // 'postcss-calc': {},
    // 'postcss-color-function': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      'stage': 2,
      'browsers': browsers,
      'features': {
        'all-property': true,
        'functional-color-notation': true,
        'custom-media-queries': true,
        'custom-properties': true,
        'media-query-ranges': true
      }
    },
    'postcss-flexbugs-fixes': {},
    'postcss-discard-duplicates': {},
    'postcss-sorting': {},
    'pixrem': {},
    'css-mqpacker': {},
    'cssnano': ctx.env === 'production' ? { autoprefixer: false, normalizeUrl: false, zindex: false } : false,
    'postcss-reporter': { clearReportedMessages: true }
  }
});
