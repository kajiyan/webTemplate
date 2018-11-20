module.exports = (() => {
  let result = {};

  result.LOCATION = 'local';

  result.ROOT = '';
  result.APP_DIR_NAME = 'app';
  result.APP_DIR_PATH = `${ result.ROOT }${ result.APP_DIR_NAME }/`;
  result.BUILD_DIR_NAME = 'htdocs';
  result.BUILD_DIR_PATH = `${ result.ROOT }${ result.BUILD_DIR_NAME }/`;

  result.PROTOCOL = 'http';
  result.HOST = 'localhost';
  result.BASE_PATH = '';
  result.PORT = 8080;

  result.BASE_URL = `//${ result.HOST + (result.PORT === 80 ? '' : ':' + result.PORT) }`;
  result.GA_TRACKING_ID = 'UA-xxxxxxxxx-x';

  // template engine
  result.TEMPLATE_ENGINE_IGNORE_PREFIX = ['_', 'ignore'];
  result.TEMPLATE_ENGINE_FOLDER_NAME = 'templates';
  result.TEMPLATE_ENGINE_ATTRIBUTE = '.pug';

  // style sheet
  result.STYLE_IGNORE_PREFIX = ['_', 'ignore'];
  result.STYLE_FOLDER_NAME = 'styles';
  result.STYLE_ATTRIBUTE = '.pcss';

  // script
  result.ALT_JS_IGNORE_PREFIX = ['_', 'ignore'];
  result.ALT_JS_FOLDER_NAME = 'scripts';
  result.ALT_JS_ATTRIBUTE = '.ts';

  // assets dir name
  result.SHARED = 'shared';
  result.IMAGES = 'images';
  result.CSS = 'css';
  result.JS = 'js';
  result.FONTS = 'fonts';
  result.AUDIO = 'audio';
  result.VIDEO = 'video';

  result.SHARED_IMAGES = `${result.BASE_PATH}/${result.SHARED}/${result.IMAGES}`;
  result.SHARED_CSS = `${result.BASE_PATH}/${result.SHARED}/${result.CSS}`;
  result.SHARED_JS = `${result.BASE_PATH}/${result.SHARED}/${result.JS}`;
  result.SHARED_FONTS = `${result.BASE_PATH}/${result.SHARED}/${result.FONTS}`;
  result.SHARED_AUDIO = `${result.BASE_PATH}/${result.SHARED}/${result.AUDIO}`;
  result.SHARED_VIDEO = `${result.BASE_PATH}/${result.SHARED}/${result.VIDEO}`;

  return result;
})();
