/**
 * @param {Object} [options] - 
 */
export default function ( options = { mode: 'DEBUG_LOCAL' } ) {
  let result = {};

  let defaults = { mode: 'DEBUG_LOCAL' };

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      defaults[key] = options[key];
    }
  }

  result.MODE = defaults.mode.toUpperCase();

  const PRODUCTION_PROTOCOL  = 'http';
  const PRODUCTION_HOST      = 'www.godiva-surprise-messenger.com';
  const PRODUCTION_PORT      = 80;

  const DEBUG_PROTOCOL       = 'http';
  const DEBUG_HOST           = 'godiva2016.imgsrc.co.jp';
  const DEBUG_PORT           = 80;

  const DEBUG_LOCAL_PROTOCOL = 'http';
  const DEBUG_LOCAL_HOST     = 'localhost';
  const DEBUG_LOCAL_PORT     = 3000;

  result.COMMON  = 'common';
  result.IMAGES  = 'images';
  result.CSS     = 'css';
  result.JS      = 'js';
  result.FONT    = 'fonts';
  result.AUDIO   = 'audio';
  result.VIDEO   = 'video';

  let urlSet = {
    PRODUCTION() {
      result.FB_APP_ID = '';
      result.GA_ID = '';
      result.HOST = PRODUCTION_HOST;
      result.PORT = PRODUCTION_PORT;
      result.BASE_URL = '//' + PRODUCTION_HOST + '/';
      result.BASE_PATH = '';
      result.COMMON_BASE_PATH = `/${result.COMMON}/`;
    },
    DEBUG () {
      result.FB_APP_ID = '';
      result.GA_ID = '';
      result.HOST = DEBUG_HOST;
      result.PORT = DEBUG_PORT;
      result.BASE_URL = '//' + DEBUG_HOST + '/';
      result.BASE_PATH = '';
      result.COMMON_BASE_PATH = `/${result.COMMON}/`;
    },
    DEBUG_LOCAL() {
      result.FB_APP_ID = '';
      result.GA_ID = '';
      result.HOST = DEBUG_LOCAL_HOST;
      result.PORT = DEBUG_LOCAL_PORT;
      result.BASE_URL = '//' + DEBUG_LOCAL_HOST + '/';
      result.BASE_PATH = '';
      result.COMMON_BASE_PATH = `/${result.COMMON}/`;
    }
  };

  try {
    urlSet[result.MODE]();
  } catch (e) {
    return new Error(`ビルドモードのオプションは'PRODUCTION', 'DEBUG', 'DEBUG_LOCAL'である必要があります。`);
  }


  if (typeof window !== 'undefined' && window !== null) {
    if (window.location.hostname.indexOf(result.PRODUCTION_HOST) >= 0) {
      window.console = {
        log: function() {}
      };
      urlSet[result.MODE]('PRODUCTION');
    } else if (window.location.hostname.indexOf(result.DEBUG_HOST) >= 0){
      urlSet[result.MODE]('DEBUG');
    } else if (window.location.hostname.indexOf(result.DEBUG_LOCAL_HOST) >= 0) {
      urlSet[result.MODE]('DEBUG_LOCAL');
    }

    console.log('Front End Setting | /system/gulp/setting.js');
  } else {
    result.TARGET = {
      index: ''
      // example: '/example'
    };

    result.SYSTEM      = 'system';
    result.SYSTEM_CORE = 'core';
    result.APPLICATION = 'application';

    result.CORE = `${result.SYSTEM_CORE}/`;
    result.DIST = `../${result.APPLICATION}/`;

    result.BUILDER          = 'gulp';
    result.ENGINE           = 'swig';
    result.ENGINE_ATTRIBUTE = 'swig';
    result.STYLE            = 'sass';
    result.ALT_JS           = 'alt-js';
    result.ALT_JS_ATTRIBUTE = 'babel.js'; // or coffee
    result.COFFEE           = 'coffee';
    result.BABEL_ATTRIBUTE  = 'babel';

    result.APP_COMPONENTS   = 'app_components';
    result.NODE_MODULES     = 'node_modules';
    result.BOWER_COMPONENTS = 'bower_components';

    console.log('Builder End Setting | /system/gulp/setting.js');
    console.log(`MODE: ${result.MODE}`);
    console.log(`HOST: ${result.HOST} | PORT: ${result.PORT}`);
  }

  result.COMMON_IMAGES   = `${result.COMMON_BASE_PATH}${result.IMAGES}/`;
  result.COMMON_CSS      = `${result.COMMON_BASE_PATH}${result.CSS}/`;
  result.COMMON_JS       = `${result.COMMON_BASE_PATH}${result.JS}/`;
  result.COMMON_FONT     = `${result.COMMON_BASE_PATH}${result.FONT}/`;
  result.COMMON_AUDIO    = `${result.COMMON_BASE_PATH}${result.AUDIO}/`;
  result.COMMON_VIDEO    = `${result.COMMON_BASE_PATH}${result.VIDEO}/`;
  result.ABSOLUTE_IMAGES = `${result.BASE_PATH}${result.IMAGES}/`;
  result.ABSOLUTE_CSS    = `${result.BASE_PATH}${result.CSS}/`;
  result.ABSOLUTE_JS     = `${result.BASE_PATH}${result.JS}/`;
  result.ABSOLUTE_FONT   = `${result.BASE_PATH}${result.FONT}/`;
  result.ABSOLUTE_AUDIO  = `${result.BASE_PATH}${result.AUDIO}/`;
  result.ABSOLUTE_VIDEO  = `${result.BASE_PATH}${result.VIDEO}/`;

  result.CONFIG = {};

  return result;
}