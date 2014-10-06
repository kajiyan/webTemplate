(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require("./typeEvent");

  require("./typeFrameWork");

  (function(window, document, $) {
    var sn;
    sn = $.typeApp = {};
    return $(function() {
      sn.Stage = (function(_super) {
        __extends(Stage, _super);

        function Stage() {
          Stage.__super__.constructor.apply(this, arguments);
          this;
        }

        return Stage;

      })(TypeEvent);
      sn.tf = new $.TypeFrameWork();
      sn.tf.setup(function() {
        return console.log("Setup TypeFrameWork App");
      });
      sn.tf.update(function() {});
      sn.tf.draw(function() {});
      sn.tf.hover(function() {});
      sn.tf.keyPressed(function(key) {});
      sn.tf.keyReleased(function(key) {});
      sn.tf.click(function() {});
      sn.tf.mouseMoved(function() {});
      sn.tf.mousePressed(function() {});
      sn.tf.mouseReleased(function() {});
      sn.tf.windowScroll(function(top) {});
      sn.tf.windowResized(function(width, height) {});
      return sn.tf.fullScreenChange(function(full) {});
    });
  })(window, document, jQuery);

}).call(this);

//# sourceMappingURL=index.js.map
