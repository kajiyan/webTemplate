module.exports = function(location) {
  let result = {};
  const defaults = { mode: 'DEBUG_LOCAL' };

  let options = (() => {
    let result = {};

    if (process.env.NODE_ENV === 'production' && location == 'global') {
      result.mode = 'PRODUCTION';
    } else if (process.env.NODE_ENV === 'development' && location == 'global') {
      result.mode = 'DEBUG';
    } else {
      result.mode = 'DEBUG_LOCAL';
    }

    return result;
  })();

  for (let key in defaults) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaults[key];
    }
  }

  const PRODUCTION_PROTOCOL = 'https';
  const PRODUCTION_HOST = 'production.exsample.com';
  const PRODUCTION_BASE_PATH = ''; // 末尾に/（スラッシュ）はつけない
  const PRODUCTION_PORT = 80;

  const DEBUG_PROTOCOL = 'https';
  const DEBUG_HOST = 'development.exsample.com';
  const DEBUG_BASE_PATH = '';
  const DEBUG_PORT = 80;

  const DEBUG_LOCAL_PROTOCOL = 'http';
  const DEBUG_LOCAL_HOST = 'localhost';
  const DEBUG_LOCAL_BASE_PATH = '';
  const DEBUG_LOCAL_PORT = 8080;

  result.MODE = options.mode.toUpperCase();
  result.SHARED = 'shared';
  result.IMAGES = 'images';
  result.CSS = 'css';
  result.JS = 'js';
  result.FONTS = 'fonts';
  result.AUDIO = 'audio';
  result.VIDEO = 'video';

  switch (result.MODE) {
    case 'PRODUCTION':
      result.HOST = PRODUCTION_HOST;
      result.PORT = PRODUCTION_PORT;
      result.PROTOCOL = PRODUCTION_PROTOCOL;
      result.BASE_URL = '//' + PRODUCTION_HOST + (PRODUCTION_PORT === 80 ? '' : ':' + PRODUCTION_PORT);
      result.BASE_PATH = PRODUCTION_BASE_PATH;
      break;
    case 'DEBUG':
      result.HOST = DEBUG_HOST;
      result.PORT = DEBUG_PORT;
      result.PROTOCOL = DEBUG_PROTOCOL;
      result.BASE_URL = '//' + DEBUG_HOST + (DEBUG_PORT === 80 ? '' : ':' + DEBUG_PORT);
      result.BASE_PATH = DEBUG_BASE_PATH;
      break;
    default:
      result.HOST = DEBUG_LOCAL_HOST;
      result.PORT = DEBUG_LOCAL_PORT;
      result.PROTOCOL = DEBUG_LOCAL_PROTOCOL;
      result.BASE_URL = '//' + DEBUG_LOCAL_HOST + (DEBUG_LOCAL_PORT === 80 ? '' : ':' + DEBUG_LOCAL_PORT) + DEBUG_LOCAL_BASE_PATH;
      result.BASE_PATH = DEBUG_LOCAL_BASE_PATH;
      break;
  }

  result.APPLICATION_PREFIX = 'ims';

  result.SYSTEM = 'system';
  result.SYSTEM_CORE = '';
  result.APPLICATION = {
    PRODUCTION: 'production-htdocs',
    DEBUG: 'development-htdocs',
    DEBUG_LOCAL: 'htdocs'
  };
  result.SRC_FOLDER_NAME = 'src';
  result.SHARED_SRC_FOLDER_NAME = 'shared';
  result.CONFIG_FILE_NAME = 'config.json';
  result.DOCS = 'docs';

  result.ROOT = '../';
  result.CORE = result.SYSTEM_CORE + '/';
  result.APPLICATION_DIST = result.ROOT + result.APPLICATION[result.MODE] + '/';
  result.DOCS_DIST = result.ROOT + result.DOCS + '/';

  result.COMMANDS = 'commands';
  result.BUILDER = null;
  result.TEMPLATE_ENGINE_IGNORE_PREFIX = ['_', 'ignore'];
  result.TEMPLATE_ENGINE_FOLDER_NAME = 'templates';
  result.TEMPLATE_ENGINE_ATTRIBUTE = '.e.html';
  result.STYLE_IGNORE_PREFIX = ['_', 'ignore'];
  result.STYLE_FOLDER_NAME = 'styles';
  result.STYLE_ATTRIBUTE = '.pcss';
  result.ALT_JS_IGNORE_PREFIX = ['_', 'ignore'];
  result.ALT_JS_FOLDER_NAME = 'scripts';
  result.ALT_JS_ATTRIBUTE = '.ts'; // .x.js | .ts | .tsx

  result.APP_COMPONENTS = 'app_components';
  result.NODE_MODULES = 'node_modules';

  result.SHARED_IMAGES = `${result.BASE_PATH}/${result.SHARED}/${result.IMAGES}`;
  result.SHARED_CSS = `${result.BASE_PATH}/${result.SHARED}/${result.CSS}`;
  result.SHARED_JS = `${result.BASE_PATH}/${result.SHARED}/${result.JS}`;
  result.SHARED_FONTS = `${result.BASE_PATH}/${result.SHARED}/${result.FONTS}`;
  result.SHARED_AUDIO = `${result.BASE_PATH}/${result.SHARED}/${result.AUDIO}`;
  result.SHARED_VIDEO = `${result.BASE_PATH}/${result.SHARED}/${result.VIDEO}`;

  result.CONFIG = {};

  return result;
};
