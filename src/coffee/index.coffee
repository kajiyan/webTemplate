require "../compile/css/wp-style.css"
require "./typeEvent"
require "./typeFrameWork"

# console.log $
# console.log _
# console.log Backbone

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
      console.log "Setup TypeFrameWork App AA"

    # --------------------------------------------------------------
    sn.tf.update ->
   
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
    sn.tf.mouseMoved ->
   
    # --------------------------------------------------------------
    sn.tf.mousePressed ->
   
    # --------------------------------------------------------------
    sn.tf.mouseReleased ->
    
    # --------------------------------------------------------------
    sn.tf.windowScroll (top) ->
   
    # --------------------------------------------------------------
    sn.tf.windowResized (width, height) ->
   
    # --------------------------------------------------------------
    sn.tf.fullScreenChange (full) ->