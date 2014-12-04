module.exports = (function(window){
  var setting = {};

  setting.MODE = "DEBUG";
  // setting.MODE = "PRODUCTION"

  setting.HOST = "";
  setting.PORT = "";

  setting.CONSTANT = {
    BASE_WIDTH      : 320,
    BASE_HEIGHT     : 780,
    BASE_MAX_WIDTH  : null,
    BASE_MAX_HEIGHT : null,
    BASE_MIN_WIDTH  : null,
    BASE_MIN_HEIGHT : null
  };

  noop = function() {};

  setConsole = function() {
    if (setting.MODE === "DEBUG") {
      if (window.console == null) {
        window.console = {
          log: noop
        };
      }
    } else if (setting.MODE === "PRODUCTION") {
       window.console = {
         log: noop
       };
    }
  };

  if (setting.MODE === "PRODUCTION") {
    setConsole();
    setting.BASE_URL = "http://www.ajioka.co.jp/_test/sp/";
    setting.BASE_PATH = "/_test/sp/";
    setting.BASE_VIDEO_URL = "";
    setting.BASE_SOUND_URL = "";
    setting.BASE_IMG_URL = "";
  } else {
    setConsole();
    setting.BASE_URL = "http://kajiyaMac.local/ajioka/sp/src/compile/";
    setting.BASE_PATH = "/ajioka/sp/src/compile/";
    setting.BASE_VIDEO_URL = "";
    setting.BASE_SOUND_URL = "";
    setting.BASE_IMG_URL = "";
  }

  return setting;
})({});