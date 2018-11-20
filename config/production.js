module.exports = (() => {
  let result = {};

  result.LOCATION = 'global';

  result.ROOT = '';
  result.BUILD_DIR_NAME = 'production-htdocs';
  result.BUILD_DIR_PATH = `${ result.ROOT }${ result.BUILD_DIR_NAME }/`;

  result.PROTOCOL = 'http';
  result.HOST = 'hirokikajiya.com';
  result.LOCAL_BASE_PATH = '';
  result.LOCAL_BASE_PATH = 80;

  result.BASE_URL = `//${ result.HOST + (result.PORT === 80 ? '' : ':' + result.PORT) }`;
  result.GA_TRACKING_ID = 'UA-xxxxxxxxx-x';

  return result;
})();