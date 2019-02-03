const path = require('path');
const browserslist = require('browserslist');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

module.exports = (() => {
  let result = {};

  // https://browserl.ist/?q=%3E0.25%25%2C+ie+11%2C+not+op_mini+all%2C+not+Opera+55
  result.BROWSERS = browserslist(pkg.browserslist);

  result.LOCATION = 'local';

  result.ROOT = '';
  result.APP_NS = 'ims';
  result.APP_DIR_NAME = 'app';
  result.APP_DIR_PATH = `${ result.ROOT }${ result.APP_DIR_NAME }/`;
  result.BUILD_DIR_NAME = 'htdocs';
  result.BUILD_DIR_PATH = `${ result.ROOT }${ result.BUILD_DIR_NAME }/`;

  result.PROTOCOL = 'http';
  result.HOST = 'localhost';
  result.BASE_PATH = '';
  result.PORT = 8080;

  result.BASE_URL = `${ result.PROTOCOL }://${ result.HOST + (result.PORT === 80 ? '' : ':' + result.PORT) }`;
  result.GA_TRACKING_ID = 'UA-xxxxxxxxx-x';

  // template engine
  result.TEMPLATE_ENGINE_IGNORE_PREFIX = ['_', 'ignore'];
  result.TEMPLATE_ENGINE_FOLDER_NAME = 'templates';
  result.TEMPLATE_ENGINE_ATTRIBUTE = ['.pug'];

  // style sheet
  result.STYLE_IGNORE_PREFIX = ['_', 'ignore'];
  result.STYLE_FOLDER_NAME = 'styles';
  result.STYLE_ATTRIBUTE = ['.pcss'];

  // script
  result.ALT_JS_IGNORE_PREFIX = ['_', 'ignore'];
  result.ALT_JS_FOLDER_NAME = 'scripts';
  result.ALT_JS_ATTRIBUTE = ['.js', '.jsx', '.ts', '.tsx'];

  // assets dir name
  result.CONFIG = 'config';
  result.ASSETS = 'assets';
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

  result.HOT_RELOAD = true;

  result.PI = Math.PI;

  // Base Font size
  result.baseFontSize = 62.5; // (%)
  result.baseRem = 10; // 62.5(%) = 10(px)

  // Base line-height
  result.lineHeight = result.baseRem / 15; // 1.5

  result.fontFamilys = [
    "'游ゴシック体', 'Yu Gothic', 'YuGothic', 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'Meiryo', 'メイリオ', 'ＭＳ Ｐゴシック', 'MS PGothic', -apple-system, BlinkMacSystemFont, sans-serif",
    "'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'Meiryo', 'メイリオ', 'ＭＳ Ｐゴシック', 'MS PGothic', -apple-system, BlinkMacSystemFont, Verdana, Roboto, 'Droid Sans', sans-serif"
  ];

  // Base Window Size (px)
  result.xLargeScreenWidth = 1280;
  result.xLargeScreenGutterWidth = 60;
  result.xLargeScreenContainerWidth = result.xLargeScreenWidth - (result.xLargeScreenGutterWidth * 2);

  result.largeScreenWidth = 980;
  result.largeScreenGutterWidth = 60;
  result.largeScreenContainerWidth = result.largeScreenWidth - (result.largeScreenGutterWidth * 2);

  result.mediumScreenWidth = 767;
  result.mediumScreenGutterWidth = 60;
  result.mediumScreenContainerWidth = result.mediumScreenWidth - (result.mediumScreenGutterWidth * 2);

  result.smallScreenWidth = 480;
  result.smallScreenGutterWidth = 20;
  result.smallScreenContainerWidth = result.smallScreenWidth - (result.smallScreenGutterWidth * 2);

  result.spDesignWidth = 375;
  result.spDesignMinWidth = 320;
  result.spDesignGutterWidth = 36;
  result.spDesignInnerWidth = result.spDesignWidth - (result.spDesignGutterWidth * 2);

  result.colors = {};

  return result;
})();
