window.SETTING = {}

window.SETTING.MODE = "DEBUG"
# window.SETTING.MODE = "PRODUCTION"

window.SETTING.HOST = ""
window.SETTING.PORT = ""


noop = () ->
setConsole = () ->
  if window.SETTING.MODE is "DEBUG"
    unless window.console?
      window.console = log: noop
  else if window.SETTING.MODE is "PRODUCTION"
    window.console = log: noop


# if "#{location.host}:#{location.port}" is "#{window.SETTING.HOST}:#{window.SETTING.PORT}" and window.SETTING.MODE is "PRODUCTION"
if window.SETTING.MODE is "PRODUCTION"
  setConsole()
  window.SETTING.BASE_URL = ""
  window.SETTING.BASE_VIDEO_URL = ""
  window.SETTING.BASE_SOUND_URL = ""
  window.SETTING.BASE_IMG_URL = ""
else
  setConsole()
  window.SETTING.BASE_URL = ""
  window.SETTING.BASE_VIDEO_URL = ""
  window.SETTING.BASE_SOUND_URL = ""
  window.SETTING.BASE_IMG_URL = ""