const path = require('path');
const config = require('config');
const stylelint = require('stylelint');

module.exports = (ctx) => ({
  ident: 'postcss',
  map: process.env.NODE_ENV === 'production' ? false : { inline: true },
  parser: (() => {
    if (typeof ctx.parser !== 'undefined') return ctx.parser;
    if (typeof ctx.options.parser !== 'undefined') return ctx.options.parser;
    return undefined
  })(),
  syntax: (() => {
    if (typeof ctx.syntax !== 'undefined') return ctx.syntax;
    if (typeof ctx.options.syntax !== 'undefined') return ctx.options.syntax;
    return undefined
  })(),
  stringifier: (() => {
    if (typeof ctx.stringifier !== 'undefined') return ctx.stringifier;
    if (typeof ctx.options.stringifier !== 'undefined') return ctx.options.stringifier;
    return undefined
  })(),
  from: typeof ctx.from !== 'undefined' ? ctx.from : undefined,
  to: typeof ctx.to !== 'undefined' ? ctx.to : undefined,
  plugins: {
    'stylelint': {},
    'postcss-import': (() => {
      const result = {};
      result.path = [config.APP_DIR_NAME];
      result.plugins = [stylelint()];
      return result;
    })(),
    'postcss-custom-properties': {},
    'postcss-simple-vars': {
      silent: true,
      variables: config
    },
    'postcss-calc': {},
    // 'doiuse': {
    //   'browsers': config.BROWSERS,
    //   'ignore': ['css-touch-action', 'user-select-none', 'pointer', 'outline'],
    //   'ignoreFiles': ['**/_sanitize.pcss']
    // },
    // 'postcss-short': {},
    // 'postcss-apply': {},
    'postcss-easings': {},
    'postcss-extend': {},
    'postcss-mixins': {
      mixins: {
        lerp: (mixin, json) => {
          const keydata = JSON.parse(json.replace(/^'+|'+$/g, ''));
          const m = (keydata.max.to - keydata.min.to) / (keydata.max.view - keydata.min.view);
          const b = keydata.max.to - m * keydata.max.view;
          let sign = '+';

          if (b < 0) {
            sign = '-';
            b = Math.abs(b);
          }

          return { [keydata.property]: `calc(${m * 100}vw ${sign} ${b}px)` };
        }
      }
    },
    // 'postcss-color-function': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      'stage': 2,
      'browsers': config.BROWSERS,
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
    // 'pixrem': {},
    'css-mqpacker': {},
    'cssnano': process.env.NODE_ENV === 'production' ? { autoprefixer: false, normalizeUrl: false, zindex: false } : false,
    'postcss-reporter': { clearReportedMessages: true }
  }
});
