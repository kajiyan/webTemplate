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
  result.BASE_FONT_SIZE = 62.5; // (%)
  result.BASE_REM = 10; // 62.5(%) = 10(px)

  // Base line-height
  result.LINE_HEIGHT = 15 / result.BASE_REM; // 1.5

  // 配列・オブジェクトの形式にするとpostcss-simple-vars から
  // 参照できないので冗長だが個別に変数に入れる
  result.FONT_FAMILYS_0 = "'游ゴシック体', 'Yu Gothic', 'YuGothic', 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'Meiryo', 'メイリオ', 'ＭＳ Ｐゴシック', 'MS PGothic', -apple-system, BlinkMacSystemFont, sans-serif";
  result.FONT_FAMILYS_1 = "'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'Meiryo', 'メイリオ', 'ＭＳ Ｐゴシック', 'MS PGothic', -apple-system, BlinkMacSystemFont, Verdana, Roboto, 'Droid Sans', sans-serif";

  // Base Window Size (px)
  result.X_LARGE_SCREEN_WIDTH = 1280;
  result.X_LARGE_SCREEN_GUTTEE_WIDTH = 60;
  result.X_LARGE_SCREEN_CONTAINER_WIDTH = result.X_LARGE_SCREEN_WIDTH - (result.X_LARGE_SCREEN_GUTTEE_WIDTH * 2);

  result.LARGE_SCREEN_WIDTH = 980;
  result.LARGE_SCREEN_GUTTEE_WIDTH = 60;
  result.LARGE_SCREEN_CONTAINER_WIDTH = result.LARGE_SCREEN_WIDTH - (result.LARGE_SCREEN_GUTTEE_WIDTH * 2);

  result.MEDIUM_SCREEN_WIDTH = 767;
  result.MEDIUM_SCREEN_GUTTEE_WIDTH = 60;
  result.MEDIUM_SCREEN_CONTAINER_WIDTH = result.MEDIUM_SCREEN_WIDTH - (result.MEDIUM_SCREEN_GUTTEE_WIDTH * 2);

  result.SMALL_SCREEN_WIDTH = 480;
  result.SMALL_SCREEN_GUTTEE_WIDTH = 20;
  result.SMALL_SCREEN_CONTAINER_WIDTH = result.SMALL_SCREEN_WIDTH - (result.SMALL_SCREEN_GUTTEE_WIDTH * 2);

  result.SP_DESIGN_WIDTH = 375;
  result.SP_DESIGN_MIN_WIDTH = 320;
  result.SP_DESIGN_GUTTEE_WIDTH = 36;
  result.SP_DESIGN_CONTAINER_WIDTH = result.SP_DESIGN_WIDTH - (result.SP_DESIGN_GUTTEE_WIDTH * 2);

  // PCCS をベースに色をまとめる
  // White
  result.COLORS_W_0 = '#fff';

  // Light Gray
  // result.COLORS_LTGY_n = '#';

  // Medium Gray
  // result.COLORS_MGY_n = '#';

  // Dark Gray
  // result.COLORS_DKGY_n = '#';

  // Black
  result.COLORS_BK_0 = '#000';

  // Pale
  // result.COLORS_P_n = '#';

  // Light grayish
  // result.COLORS_LTG_n = '#';

  // Grayish
  // result.COLORS_G_n = '#';

  // Dark grayish
  // result.COLORS_DKG_n = '#';

  // Light
  // result.COLORS_LT_n = '#';

  // Soft
  // result.COLORS_ST_n = '#';

  // Dull
  // result.COLORS_D_n = '#';

  // Dark
  // result.COLORS_DK_n = '#';

  // Bright
  // result.COLORS_B_n = '#';

  // Strong
  // result.COLORS_S_n = '#';

  // Deep
  // result.COLORS_DP_n = '#';

  // Vivid
  // result.COLORS_V_n = '#';

  return result;
})();
