const minimist = require('minimist');

const ARGV = minimist(process.argv.slice(2));

module.exports = (() => {
  let result = {};

  if (ARGV.location === 'global') {
    result.LOCATION = 'global';

    result.ROOT = '';
    result.BUILD_DIR_NAME = 'development-htdocs';
    result.BUILD_DIR_PATH = `${ result.ROOT }${ result.BUILD_DIR_NAME }/`;

    result.PROTOCOL = 'http';
    result.HOST = 'development.hirokikajiya.com';
    result.LOCAL_BASE_PATH = '';
    result.PORT = 80;

    result.BASE_URL = `${ result.PROTOCOL }//${ result.HOST + (result.PORT === 80 ? '' : ':' + result.PORT) }`;

    result.HOT_RELOAD = false;
  }

  return result;
})();
