require "../../compile/css/wp-style.css"
require("./typeFrameWork.wp")(window, document, $)


# console.log TypeEvent
# console.log $.TypeFrameWork
# console.log $.TypeThread

# console.log $
# console.log _
# console.log Backbone

# $(window).load (window, document, $=jQuery) ->
do (window, document, $=jQuery) ->
  sn = $.typeApp = {}

  $ ->
    # ============================================================
    # StageClass ( Test Class )
    class sn.Stage extends TypeEvent
      constructor: () ->
        super
        @
 
    # ============================================================
    # TypeFrameWork
    sn.tf = new $.TypeFrameWork()
 
    # --------------------------------------------------------------
    sn.tf.setup ->
      console.log "Setup TypeFrameWork App"

    # --------------------------------------------------------------
    sn.tf.update ->
      console.log 

    # --------------------------------------------------------------
    sn.tf.draw ->
   
    # --------------------------------------------------------------
    sn.tf.hover ->
   
    # --------------------------------------------------------------
    sn.tf.keyPressed (key) ->
   
    # --------------------------------------------------------------
    sn.tf.keyReleased (key) ->
   
    # --------------------------------------------------------------
    sn.tf.click ->
   
    # --------------------------------------------------------------
    sn.tf.pointerDown ->

    # --------------------------------------------------------------
    sn.tf.pointerEnter ->

    # --------------------------------------------------------------
    sn.tf.pointerRleave ->

    # --------------------------------------------------------------
    sn.tf.pointerMoved ->

    # --------------------------------------------------------------
    sn.tf.pointerOut ->

    # --------------------------------------------------------------
    sn.tf.pointerOver ->

    # --------------------------------------------------------------
    sn.tf.pointerUp ->
    
    # --------------------------------------------------------------
    sn.tf.windowScroll (top) ->
   
    # --------------------------------------------------------------
    sn.tf.windowResized (width, height) ->
   
    # --------------------------------------------------------------
    sn.tf.fullScreenChange (full) ->