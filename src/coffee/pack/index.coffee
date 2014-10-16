require "../../compile/css/wp-style.css"
# require "../typeEvent"
require("../typeCanvas")(window, document, $)
# require("./typeEvent.wp")(window)
require("./typeFrameWork.wp")(window, document, $)

test = require("../include")
test.test $, "test"

canvasSource = new $.TypeCanvases([
  $el: $("#js-canvas")
])

console.log TypeEvent
console.log $.TypeFrameWork
console.log $.TypeThread
 
# console.log TypeCanvas

# console.log $
# console.log _
# console.log Backbone

# $(window).load (window, document, $=jQuery) ->
# do (window, document, $=jQuery) ->
#   sn = $.typeApp = {}

#   $ ->
#     # ============================================================
#     # StageClass ( Test Class )
#     class sn.Stage extends TypeEvent
#       constructor: () ->
#         super
#         @
 
#     # ============================================================
#     # TypeFrameWork
#     sn.tf = new $.TypeFrameWork()
 
#     # --------------------------------------------------------------
#     sn.tf.setup ->
#       console.log new $.TypeFrameWork()
#       $("body").aaa()

#       console.log "Setup TypeFrameWork App"

#     # --------------------------------------------------------------
#     sn.tf.update ->
#       console.log 

#     # --------------------------------------------------------------
#     sn.tf.draw ->
   
#     # --------------------------------------------------------------
#     sn.tf.hover ->
   
#     # --------------------------------------------------------------
#     sn.tf.keyPressed (key) ->
   
#     # --------------------------------------------------------------
#     sn.tf.keyReleased (key) ->
   
#     # --------------------------------------------------------------
#     sn.tf.click ->
   
#     # --------------------------------------------------------------
#     sn.tf.mouseMoved ->
   
#     # --------------------------------------------------------------
#     sn.tf.mousePressed ->
   
#     # --------------------------------------------------------------
#     sn.tf.mouseReleased ->
    
#     # --------------------------------------------------------------
#     sn.tf.windowScroll (top) ->
   
#     # --------------------------------------------------------------
#     sn.tf.windowResized (width, height) ->
   
#     # --------------------------------------------------------------
#     sn.tf.fullScreenChange (full) ->