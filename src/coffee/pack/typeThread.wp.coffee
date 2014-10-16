module.exports = (window=window, document=document, $=jQuery) ->
  require("./typeEvent.wp")(window)

  sn = $.TypeFrameWork = {}

  # ============================================================
  # typeThread
  # ============================================================
  class sn.TypeThread extends TypeEvent
    defaults:
      frameRate: 60
    #--------------------------------------------------------------
    constructor: (options) ->
      @options = $.extend {}, @defaults, options
      @updateProcess = $.noop
      @lastTime = null
      @startTime = null
      @oldFrame = null
      @stop = false
    #--------------------------------------------------------------
    setup: () ->
      @startTime = window.getTime()
    #--------------------------------------------------------------
    update: (method = $.noop) ->
      @updateProcess = window.requestAnimationFrame =>
        @update method
 
      @lastTime = window.getTime()
 
      currentFrame = Math.floor( (@lastTime - @startTime) / (1000.0 / @optiosn.frameRate) % 2 )
      if currentFrame isnt @oldFrame
        method()
        if @_draw?
          @_draw()
      @oldFrame = currentFrame
    #--------------------------------------------------------------
    draw: (method = $.noop) ->
      @_draw = method
      return
    #--------------------------------------------------------------
    break: () ->
      cancelAnimationFrame @updateProcess

  # ============================================================
  # bridge to plugin
  # ============================================================
  $.TypeThread = sn.TypeThread