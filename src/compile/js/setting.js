(function() {
  var noop, setConsole;

  window.SETTING = {};

  window.SETTING.MODE = "DEBUG";

  window.SETTING.HOST = "";

  window.SETTING.PORT = "";

  noop = function() {};

  setConsole = function() {
    if (window.SETTING.MODE === "DEBUG") {
      if (window.console == null) {
        return window.console = {
          log: noop
        };
      }
    } else if (window.SETTING.MODE === "PRODUCTION") {
      return window.console = {
        log: noop
      };
    }
  };

  if (window.SETTING.MODE === "PRODUCTION") {
    setConsole();
    window.SETTING.BASE_URL = "";
    window.SETTING.BASE_VIDEO_URL = "";
    window.SETTING.BASE_SOUND_URL = "";
    window.SETTING.BASE_IMG_URL = "";
  } else {
    setConsole();
    window.SETTING.BASE_URL = "";
    window.SETTING.BASE_VIDEO_URL = "";
    window.SETTING.BASE_SOUND_URL = "";
    window.SETTING.BASE_IMG_URL = "";
  }

}).call(this);