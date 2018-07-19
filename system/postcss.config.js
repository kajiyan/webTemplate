const path = require('path');
const browserslist = require('browserslist');

const ARGV = require('minimist')(process.argv.slice(2));
const SETUP = require(path.join(process.cwd(), '/setup'))(ARGV.location);

module.exports = ctx => ({
  // map: ctx.map,
  map: ctx.env === 'production' ? false : { inline: true },
  parser: ctx.parser ? 'sugarss' : false,
  // syntax: ctx.syntax ? ctx.syntax : undefined,
  // stringifier: ctx.options.stringifier ? ctx.stringifier : undefined,
  from: ctx.from,
  to: ctx.to,
  plugins: {
    'postcss-import': (function() {
      let result = {};
      result.path = ['src'];
      return result;
    })(),
    'postcss-simple-vars': {
      silent: true,
      variables: SETUP
    },
    'postcss-extend': {},
    'postcss-mixins': {
      mixins: {
        linearInterpolation: function(mixin, json) {
          let keydata = JSON.parse(json.replace(/^'+|'+$/g, ''));
          let m = (keydata['max']['to'] - keydata['min']['to']) / (keydata['max']['view'] - keydata['min']['view']);
          let b = keydata['max']['to'] - m * keydata['max']['view'];
          let sign = '+';

          if (b < 0) {
            sign = '-';
            b = Math.abs(b);
          }

          return { [keydata.property]: `calc(${m * 100}vw ${sign} ${b}px);` };
        }
      }
    },
    // 'postcss-nesting': {},
    'postcss-nested': {},
    'postcss-cssnext': {
      browsers: browserslist('last 2 versions, not dead, not android 67, not samsung 7.2'),
      features: {
        nesting: false
      }
    },
    'postcss-flexbugs-fixes': {},
    'postcss-sorting': {},
    'css-mqpacker': {},
    'postcss-discard-duplicates': {},
    cssnano: ctx.env === 'production' ? { autoprefixer: false, normalizeUrl: false, zindex: false } : false
  }
});
