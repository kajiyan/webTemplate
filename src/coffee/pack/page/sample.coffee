# ============================================================
# PAGE TEMPLATE
module.exports = (sn, $, Backbone, _) ->
  class sn.Page extends TypeEvent
    constructor: () ->
      super
      
      console.log "Page -> constructor"

      @$window = $(window)
      @$els = {}
      @controlEnabled = false

      @

    setup: (skip = false) ->
      return $.Deferred (defer) =>
        onDone = =>
          console.log "Page -> setup"
          defer.resolve()

        # コントロールできる状態に
        @controlEnabled = true

        # オブジェクトを取得
        @_getElements()

        onDone()
      .promise()

    # --------------------------------------------------------------
    update: ->

    # --------------------------------------------------------------
    draw: ->
   
    # --------------------------------------------------------------
    hover: ->
   
    # --------------------------------------------------------------
    keyPressed: (key) ->
   
    # --------------------------------------------------------------
    keyReleased: (key) ->
   
    # --------------------------------------------------------------
    click: ->
   
    # --------------------------------------------------------------
    pointerDown: ->

    # --------------------------------------------------------------
    pointerEnter: ->

    # --------------------------------------------------------------
    pointerLeave: ->

    # --------------------------------------------------------------
    pointerMoved: ->

    # --------------------------------------------------------------
    pointerOut: ->

    # --------------------------------------------------------------
    pointerOver: ->

    # --------------------------------------------------------------
    pointerUp: ->
    
    # --------------------------------------------------------------
    windowScroll: (top) ->
   
    # --------------------------------------------------------------
    windowResized: (width, height) ->

    exit: () ->
      return $.Deferred (defer) =>
        onDone = =>
          console.log "Page -> exit"
          defer.resolve()

        # コントロールできない状態に
        @controlEnabled = false

        onDone()
      .promise()

    _getElements: () ->
      @$els = {}
      return @$els
