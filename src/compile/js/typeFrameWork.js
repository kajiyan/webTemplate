(function() {
  var __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(window, document, $) {
    var $document, $window, FLT_EPSILON, KEY_CHARS, ns;
    ns = $.TypeFrameWork = {};
    ns.support = {};
    ns.support.addEventListener = "addEventListener" in document;
    $window = $(window);
    $document = $(document);
    FLT_EPSILON = 0.0000001192092896;
    KEY_CHARS = [];
    KEY_CHARS[27] = "Esc";
    KEY_CHARS[8] = "BackSpace";
    KEY_CHARS[9] = "Tab";
    KEY_CHARS[32] = "Space";
    KEY_CHARS[45] = "Insert";
    KEY_CHARS[46] = "Delete";
    KEY_CHARS[35] = "End";
    KEY_CHARS[36] = "Home";
    KEY_CHARS[33] = "PageUp";
    KEY_CHARS[34] = "PageDown";
    KEY_CHARS[38] = "up";
    KEY_CHARS[40] = "down";
    KEY_CHARS[37] = "left";
    KEY_CHARS[39] = "right";
    ns.Event = (function() {
      function Event() {
        this._callbacks = {};
      }

      Event.prototype.on = function(ev, callback) {
        var evs, name, _base, _i, _len;
        evs = ev.split(' ');
        for (_i = 0, _len = evs.length; _i < _len; _i++) {
          name = evs[_i];
          (_base = this._callbacks)[name] || (_base[name] = []);
          this._callbacks[name].push(callback);
        }
        return this;
      };

      Event.prototype.one = function(ev, callback) {
        return this.on(ev, function() {
          this.off(ev, arguments.callee);
          return callback.apply(this, arguments);
        });
      };

      Event.prototype.trigger = function() {
        var args, callback, ev, list, _i, _len, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        ev = args.shift();
        list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
        if (!list) {
          return;
        }
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          callback = list[_i];
          if (callback.apply(this, args) === false) {
            break;
          }
        }
        return this;
      };

      Event.prototype.off = function(ev, callback) {
        var cb, i, list, _i, _len, _ref;
        if (!ev) {
          this._callbacks = {};
          return this;
        }
        list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
        if (!list) {
          return this;
        }
        if (!callback) {
          delete this._callbacks[ev];
          return this;
        }
        for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
          cb = list[i];
          if (!(cb === callback)) {
            continue;
          }
          list = list.slice();
          list.splice(i, 1);
          this._callbacks[ev] = list;
          break;
        }
        return this;
      };

      Event.prototype.bind = function() {
        return this.on.apply(this, arguments);
      };

      Event.prototype.unbind = function() {
        return this.off.apply(this, arguments);
      };

      return Event;

    })();
    ns.vec2f = (function() {
      function vec2f(x, y) {
        this.x = x;
        this.y = y;
      }

      return vec2f;

    })();
    ns.TypeFrameWork = (function(_super) {
      __extends(TypeFrameWork, _super);

      TypeFrameWork.prototype.defaults = {
        frameRate: 60.0,
        resizeInterval: 200
      };

      function TypeFrameWork(options) {
        this._get_root_path = __bind(this._get_root_path, this);
        this._get_relative_path = __bind(this._get_relative_path, this);
        this.devicemotionProcess = __bind(this.devicemotionProcess, this);
        this.fullScreenChangeProcess = __bind(this.fullScreenChangeProcess, this);
        this.orientationChangeProcess = __bind(this.orientationChangeProcess, this);
        this.windowScrollProcess = __bind(this.windowScrollProcess, this);
        this.windowResizedProcess = __bind(this.windowResizedProcess, this);
        this._keyProcess = __bind(this._keyProcess, this);
        this.keyReleasedProcess = __bind(this.keyReleasedProcess, this);
        this.keyPressedProcess = __bind(this.keyPressedProcess, this);
        this.options = $.extend({}, this.defaults, options);
        window.requestAnimationFrame = (function(_this) {
          return function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
              return window.setTimeout(callback, 1000 / _this.options.frameRate);
            };
          };
        })(this)();
        window.cancelAnimationFrame = (function(_this) {
          return function() {
            return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
              return window.clearTimeout(id);
            };
          };
        })(this)();
        window.getTime = function() {
          var now;
          now = window.perfomance && (perfomance.now || perfomance.webkitNow || perfomance.mozNow || perfomance.msNow || perfomance.oNow);
          return (now && now.cell(perfomance)) || (new Date().getTime());
        };
        this.updateProcess = null;
        this.oldFrame = null;
        this.startTime = window.getTime();
        this.els = [];
        this._keyPressed = function() {};
        this._keyReleased = function() {};
        this._windowResized = function() {};
        this._windowScroll = function() {};
        this._orientationChange = $.noop;
        this._fullScreenChange = function() {};
        $document.on("keydown", this.keyPressedProcess);
        $document.on("keyup", this.keyReleasedProcess);
        this.resizeTimer = null;
        $window.on("resize", this.windowResizedProcess);
        $window.on("scroll", this.windowScrollProcess);
        if (typeof window.onorientationchange === "object") {
          $window.on("orientationchange", this.orientationChangeProcess);
        }
        $window.on("fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange", this.fullScreenChangeProcess);
        if (ns.support.addEventListener) {
          window.addEventListener("devicemotion", this.devicemotionProcess);
        }
      }

      TypeFrameWork.prototype.setup = function(method) {
        if (method == null) {
          method = function() {};
        }
        method();
      };

      TypeFrameWork.prototype.update = function(method) {
        var currentFrame;
        if (method == null) {
          method = function() {};
        }
        this.lastTime = window.getTime();
        currentFrame = Math.floor((this.lastTime - this.startTime) / (1000.0 / this.options.frameRate) % 2);
        if (currentFrame !== this.oldFrame) {
          method();
          if (this._draw != null) {
            this._draw();
          }
        }
        this.oldFrame = currentFrame;
        this.updateProcess = window.requestAnimationFrame((function(_this) {
          return function() {
            _this.update(method);
          };
        })(this));
      };

      TypeFrameWork.prototype.draw = function(method) {
        if (method == null) {
          method = function() {};
        }
        this._draw = method;
      };

      TypeFrameWork.prototype.keyPressed = function(method) {
        if (method == null) {
          method = $.noop;
        }
        this._keyPressed = method;
      };

      TypeFrameWork.prototype.keyPressedProcess = function(e) {
        var key;
        key = this._keyProcess(e);
        this._keyPressed(key);
      };

      TypeFrameWork.prototype.keyPressedOn = function() {
        $document.on("keydown", this.keyPressedProcess);
      };

      TypeFrameWork.prototype.keyPressedOff = function() {
        $document.off("keydown");
      };

      TypeFrameWork.prototype.keyReleased = function(method) {
        if (method == null) {
          method = $.noop;
        }
        this._keyReleased = method;
      };

      TypeFrameWork.prototype.keyReleasedProcess = function(e) {
        var key;
        key = this._keyProcess(e);
        this._keyReleased(key);
      };

      TypeFrameWork.prototype.keyReleasedOn = function() {
        $document.on("keyup", this.keyReleasedProcess);
      };

      TypeFrameWork.prototype.keyReleasedOff = function() {
        $document.off("keyup");
      };

      TypeFrameWork.prototype._keyProcess = function(e) {
        var ctrl, keyChar, keyCode, result, shift;
        if (e !== null) {
          keyCode = e.which;
          ctrl = typeof e.modifiers === 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK;
          shift = typeof e.modifiers === 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK;
        } else {
          keyCode = event.keyCode;
          ctrl = event.ctrlKey;
          shift = event.shiftKey;
          event.returnValue = false;
          event.cancelBubble = true;
        }
        keyChar = KEY_CHARS[keyCode];
        if (!(keyChar != null)) {
          keyChar = String.fromCharCode(keyCode).toUpperCase();
        }
        result = {
          "keyCode": keyCode,
          "keyChar": keyChar,
          "ctrl": ctrl,
          "shift": shift
        };
        return result;
      };

      TypeFrameWork.prototype.hover = function(method) {
        if (method == null) {
          method = function() {};
        }
        method.apply();
      };

      TypeFrameWork.prototype.setHover = function(el, enter, leave) {
        if (el == null) {
          $.error("Some error TypeFrameWorksetHover() object.");
        }
        if (enter == null) {
          enter = function() {};
        }
        if (leave == null) {
          leave = function() {};
        }
        if (this.type(enter) !== "function" && this.type(leave) !== "function") {
          $.error("Some error TypeFrameWork hover() object.");
        }
        this.els.push(el);
        el.on({
          "mouseenter": function(e) {
            return enter(e, this);
          },
          "mouseleave": function(e) {
            return leave(e, this);
          }
        });
      };

      TypeFrameWork.prototype.mouseMoved = function(method) {
        if (method == null) {
          method = function() {};
        }
        method();
      };

      TypeFrameWork.prototype.setMouseMoved = function(el, method, translate) {
        if (translate == null) {
          translate = "page";
        }
        if ((el == null) && (method == null)) {
          $.error("Some error TypeFrameWork mouseMoved() object.");
        }
        if (this.type(el) !== "object" && this.type(method) !== "function") {
          $.error("Some error TypeFrameWork mouseMoved() object.");
        }
        this.els.push(el);
        switch (translate) {
          case "page":
            el.on({
              "mousemove": function(e) {
                return method(e.pageX, e.pageY);
              }
            });
            break;
          case "client":
            el.on({
              "mousemove": function(e) {
                return method(e.clientX, e.clientY);
              }
            });
            break;
          case "offset":
            el.on({
              "mousemove": function(e) {
                return method(e.offsetX, e.offsetY);
              }
            });
            break;
          default:
            el.on({
              "mousemove": function(e) {
                return method(e.pageX, e.pageY);
              }
            });
        }
      };

      TypeFrameWork.prototype.mousePressed = function(method) {
        if (method == null) {
          method = function() {};
        }
        method();
      };

      TypeFrameWork.prototype.setMousePressed = function(el, method) {
        if ((el == null) && (method == null)) {
          $.error("Some error TypeFrameWork mousePressed() object.");
        }
        if (this.type(el) !== "object" && this.type(method) !== "function") {
          $.error("Some error TypeFrameWork mousePressed() object.");
        }
        this.els.push(el);
        el.on({
          "mousedown": function(e) {
            return method(e.offsetX, e.offsetY);
          }
        });
      };

      TypeFrameWork.prototype.click = function(method) {
        if (method == null) {
          method = function() {};
        }
        method();
      };

      TypeFrameWork.prototype.setClick = function(el, method) {
        if ((el == null) && (method == null)) {
          $.error("Some error TypeFrameWork mousePressed() object.");
        }
        if (this.type(el) !== "object" && this.type(method) !== "function") {
          $.error("Some error TypeFrameWork mousePressed() object.");
        }
        this.els.push(el);
        el.on({
          "click": function(e) {
            return method(e, this);
          }
        });
      };

      TypeFrameWork.prototype.mouseReleased = function(method) {
        if (method == null) {
          method = function() {};
        }
        method();
      };

      TypeFrameWork.prototype.setMouseReleased = function(el, method, translate) {
        if (translate == null) {
          translate = "page";
        }
        if ((el == null) && (method == null)) {
          $.error("Some error TypeFrameWork mouseReleased() object.");
        }
        if (this.type(el) !== "object" && this.type(method) !== "function") {
          $.error("Some error TypeFrameWork mouseReleased() object.");
        }
        this.els.push(el);
        switch (translate) {
          case "page":
            el.on({
              "mouseup": function(e) {
                return method(e.pageX, e.pageY);
              }
            });
            break;
          case "client":
            el.on({
              "mouseup": function(e) {
                return method(e.clientX, e.clientY);
              }
            });
            break;
          case "offset":
            el.on({
              "mouseup": function(e) {
                return method(e.offsetX, e.offsetY);
              }
            });
            break;
          default:
            el.on({
              "mouseup": function(e) {
                return method(e.pageX, e.pageY);
              }
            });
        }
      };

      TypeFrameWork.prototype.windowResized = function(method) {
        this._windowResized = method;
      };

      TypeFrameWork.prototype.windowResizedProcess = function() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout((function(_this) {
          return function() {
            var h, w;
            w = $window.width();
            h = $window.height();
            return _this._windowResized(w, h);
          };
        })(this), this.options.resizeInterval);
      };

      TypeFrameWork.prototype.windowScroll = function(method) {
        this._windowScroll = method;
      };

      TypeFrameWork.prototype.windowScrollProcess = function() {
        var top;
        top = $window.scrollTop();
        this._windowScroll(top);
      };

      TypeFrameWork.prototype._checkLandScape = function() {
        var orientation, userAgent;
        userAgent = navigator.userAgent;
        if ((window.orientation != null) && userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1 || userAgent.indexOf("iPod") !== -1 || userAgent.indexOf("Android") !== -1) {
          orientation = window.orientation;
          if (orientation === 0) {
            return "portrait";
          } else {
            return "landscape";
          }
        } else {
          return false;
        }
      };

      TypeFrameWork.prototype.orientationChange = function(method) {
        if (method == null) {
          method = $.noop;
        }
        this._orientationChange = method;
      };

      TypeFrameWork.prototype.orientationChangeProcess = function() {
        this._orientationChange(this._checkLandScape());
      };

      TypeFrameWork.prototype.exit = function(callback) {
        var els, _i, _len, _ref;
        $window.off();
        _ref = this.els;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          els = _ref[_i];
          els.off();
        }
        if (this.updateProcess != null) {
          cancelAnimationFrame(this.updateProcess);
          this.updateProcess = false;
        }
        if (this.type(callback) === "function") {
          callback();
        } else {
          $.error("Some error TypeFrameWork exit() callback function.");
        }
        return null;
      };

      TypeFrameWork.prototype.fullScreen = function(support, el) {
        if (support == null) {
          support = false;
        }
        if (el == null) {
          el = document;
        }
        if (!support) {
          if ((el.fullScreenElement && el.fullScreenElement(!null)) || (!el.mozFullScreen && !el.webkitIsFullScreen)) {
            if (el.documentElement.requestFullScreen) {
              el.documentElement.requestFullScreen();
            } else if (el.documentElement.webkitRequestFullScreen) {
              el.documentElement.webkitRequestFullScreen();
            } else if (el.documentElement.mozRequestFullScreen) {
              el.documentElement.mozRequestFullScreen();
            } else if (el.msRequestFullscreen) {
              el.msRequestFullscreen();
            } else {
              return false;
            }
          }
          return true;
        } else {
          if (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen) {
            return true;
          } else {
            return false;
          }
        }
      };

      TypeFrameWork.prototype.exitFullScreen = function(el) {
        if (el == null) {
          el = document;
        }
        if (el.exitFullscreen) {
          el.exitFullscreen();
        } else if (el.webkitCancelFullScreen) {
          el.webkitCancelFullScreen();
        } else if (el.mozCancelFullScreen) {
          el.mozCancelFullScreen();
        } else if (el.msExitFullscreen) {
          el.msExitFullscreen();
        } else if (el.cancelFullScreen) {
          el.cancelFullScreen();
        } else {
          return false;
        }
        return true;
      };

      TypeFrameWork.prototype.isFullScreen = function(el) {
        if (el == null) {
          el = document;
        }
        if (el.fullscreen || el.webkitIsFullScreen || el.mozFullScreen || el.msFullScreen) {
          return true;
        } else {
          return false;
        }
      };

      TypeFrameWork.prototype.fullScreenChange = function(method) {
        if (method == null) {
          method = function() {};
        }
        this._fullScreenChange = method;
      };

      TypeFrameWork.prototype.fullScreenChangeProcess = function() {
        this._fullScreenChange(this.isFullScreen());
      };

      TypeFrameWork.prototype.devicemotionProcess = function(e) {
        var acceleration, accelerationIncludingGravity, rotationRate;
        e.preventDefault();
        acceleration = e.acceleration;
        accelerationIncludingGravity = e.accelerationIncludingGravity;
        rotationRate = e.rotationRate;
        this.accelerationX = acceleration.x;
        this.accelerationY = acceleration.y;
        this.accelerationZ = acceleration.z;
        this.gravityX = accelerationIncludingGravity.x;
        this.gravityY = accelerationIncludingGravity.y;
        this.gravityZ = accelerationIncludingGravity.z;
        this.rotationA = rotationRate.alpha;
        this.rotationB = rotationRate.beta;
        this.rotationG = rotationRate.gamma;
      };

      TypeFrameWork.prototype.type = function(obj) {
        var classToType;
        if (obj === void 0 || obj === null) {
          return String(obj);
        }
        classToType = {
          '[object Boolean]': 'boolean',
          '[object Number]': 'number',
          '[object String]': 'string',
          '[object Function]': 'function',
          '[object Array]': 'array',
          '[object Date]': 'date',
          '[object RegExp]': 'regexp',
          '[object Object]': 'object'
        };
        return classToType[Object.prototype.toString.call(obj)];
      };

      TypeFrameWork.prototype.vec2f = function(x, y) {
        return new ns.vec2f(x, y);
      };

      TypeFrameWork.prototype.random = function() {
        var args, len, num;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        len = args.length;
        if (len === 0) {
          num = Math.random();
        } else if (len === 1) {
          num = Math.floor(Math.random() * (args[0] + 1));
        } else if (len === 2) {
          num = Math.floor(Math.random() * (args[1] + 1));
        } else {
          $.error("Some error TypeFrameWork random() object.");
        }
        return num;
      };

      TypeFrameWork.prototype.valueMap = function(value, inputMin, inputMax, outputMin, outputMax, clamp) {
        var outVal;
        FLT_EPSILON = 0.0000001192092896;
        if (Math.abs(inputMin - inputMax) < FLT_EPSILON) {
          $.error("valueMap avoiding possible divide by zero, check inputMin and inputMax: " + inputMin + " " + inputMax);
          return outputMin;
        } else {
          outVal = (value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
          if (clamp === true) {
            if (outputMax < outputMin) {
              if (outVal < outputMax) {
                outVal = outputMax;
              } else if (outVal > outputMin) {
                outVal = outputMin;
              }
            } else {
              if (outVal > outputMax) {
                outVal = outputMax;
              } else if (outVal < outputMin) {
                outVal = outputMin;
              }
            }
          }
          return outVal;
        }
      };

      TypeFrameWork.prototype.setPath = function(options) {
        var defaults;
        defaults = {
          host: window.location.href,
          asset_dir: "assets",
          css_dir: "css",
          script_dir: "script",
          image_dir: "images",
          fonts_dir: "fonts",
          pc_dir: "pc",
          tablet_dir: "tablet",
          sp_dir: "sp",
          relative: "relative",
          deviceIsParent: true,
          strictSlash: false,
          root: null
        };
        this._path = $.extend({}, defaults, options);
      };

      TypeFrameWork.prototype.get_host_path = function() {
        return this._path.host;
      };

      TypeFrameWork.prototype.get_css_path = function(rule, device) {
        var func;
        if (rule === this._path.relative) {
          func = this._get_relative_path;
        } else {
          func = this._get_root_path;
        }
        return func(this._path.css_dir, device);
      };

      TypeFrameWork.prototype.get_script_path = function(rule, device) {
        var func;
        if (rule === this._path.relative) {
          func = this._get_relative_path;
        } else {
          func = this._get_root_path;
        }
        return func(this._path.script_dir, device);
      };

      TypeFrameWork.prototype.get_image_path = function(rule, device) {
        var func;
        if (rule === this._path.relative) {
          func = this._get_relative_path;
        } else {
          func = this._get_root_path;
        }
        return func(this._path.image_dir, device);
      };

      TypeFrameWork.prototype.get_fonts_path = function(rule, device) {
        var func;
        if (rule === this._path.relative) {
          func = this._get_relative_path;
        } else {
          func = this._get_root_path;
        }
        return func(this._path.fonts_dir, device);
      };

      TypeFrameWork.prototype._get_relative_path = function(asset, device) {
        var fragment, i, level, result;
        fragment = window.location.pathname;
        if (this._path.root != null) {
          fragment = fragment.replace(this._path.root, "");
        }
        level = fragment.split('/').length - 1;
        result = this._get_path(asset, device);
        i = 0;
        while (i < level) {
          result = "../" + result;
          i++;
        }
        if (asset.strictSlash) {
          result + "/";
        }
        return result;
      };

      TypeFrameWork.prototype._get_root_path = function(asset, device) {
        var result;
        result = "/" + this._get_path(asset, device);
        if (asset.strictSlash) {
          result + "/";
        }
        return result;
      };

      TypeFrameWork.prototype._get_path = function(asset, device) {
        var result, targetAsset, targetDev;
        targetDev = "";
        targetAsset = "";
        switch (device) {
          case this._path.pc_dir:
            targetDev = this._path.pc_dir;
            break;
          case this._path.tablet_dir:
            targetDev = this._path.tablet_dir;
            break;
          case this._path.sp_dir:
            targetDev = this._path.sp_dir;
            break;
          default:
            targetDev = "";
        }
        switch (asset) {
          case this._path.css_dir:
            targetAsset = this._path.css_dir;
            break;
          case this._path.image_dir:
            targetAsset = this._path.image_dir;
            break;
          case this._path.script_dir:
            targetAsset = this._path.script_dir;
            break;
          case this._path.data_dir:
            targetAsset = asset.data_DIR;
            break;
          default:
            throw new Error('asset type fail');
        }
        if ((targetDev != null) && targetDev !== "") {
          if (this._path.asset_dir === "") {
            result = this._path.deviceIsParent ? [targetDev, targetAsset] : [targetAsset, targetDev];
          } else {
            result = this._path.deviceIsParent ? [this._path.asset_dir, targetDev, targetAsset] : [this._path.asset_dir, targetAsset, targetDev];
          }
        } else {
          if (this._path.asset_dir === "") {
            result = [targetAsset];
          } else {
            result = [this._path.asset_dir, targetAsset];
          }
        }
        result = result.join("/");
        return result;
      };

      TypeFrameWork.prototype.getFrameRate = function() {
        return this.options.frameRate;
      };

      TypeFrameWork.prototype.getResizeInterval = function() {
        return this.options.resizeInterval;
      };

      TypeFrameWork.prototype.getWindowWidth = function() {
        return $window.width();
      };

      TypeFrameWork.prototype.getWindowHeight = function() {
        return $window.height();
      };

      TypeFrameWork.prototype.getLandscape = function() {
        return this._checkLandScape();
      };

      TypeFrameWork.prototype.cssTransition = function(duration, easing) {
        var css;
        css = "" + duration + "s " + easing;
        return {
          "-webkit-transition": css,
          "-moz-transition": css,
          "-o-transition": css,
          "-ms-transition": css,
          "transition": css
        };
      };

      TypeFrameWork.prototype.transitionProperty = function(property) {
        var value;
        if (property == null) {
          property = ["all"];
        }
        value = property.join(", ");
        return {
          "-webkit-transition-property": "" + value,
          "-moz-transition-property": "" + value,
          "-o-transition-property": "" + value,
          "-ms-transition": "" + value,
          "transition-property": "" + value
        };
      };

      TypeFrameWork.prototype.transitionDuration = function(duration) {
        return {
          "-webkit-transition-duration": "" + duration + "s",
          "-moz-transition-duration": "" + duration + "s",
          "-o-transition-duration": "" + duration + "s",
          "-ms-transition-duration": "" + duration + "s",
          "transition-duration": "" + duration + "s"
        };
      };

      TypeFrameWork.prototype.transitionTimingFunction = function(property) {
        return {
          "-webkit-transition-timing-function": "" + property,
          "-moz-transition-timing-function": "" + property,
          "-o-transition-timing-function": "" + property,
          "-ms-transition-timing-function": "" + property,
          "transition-timing-function": "" + property
        };
      };

      TypeFrameWork.prototype.transitionDelay = function(delay) {
        return {
          "-webkit-transition-delay": "" + delay + "s",
          "-moz-transition-delay": "" + delay + "s",
          "-o-transition-delay": "" + delay + "s",
          "-ms-transition-delay": "" + delay + "s",
          "transition-delay": "" + delay + "s"
        };
      };

      TypeFrameWork.prototype.cssScale = function(scale) {
        var css3;
        css3 = "scale(" + scale + ")";
        return {
          "-webkit-transform": css3,
          "-moz-transform": css3,
          "-o-transform": css3,
          "-ms-transform": css3,
          "transform": css3
        };
      };

      TypeFrameWork.prototype.cssTranslate = function(x, y, z) {
        var css3;
        css3 = "translateX(" + x + "px) translateY(" + y + "px) translateZ(" + z + "px)";
        return {
          "-webkit-transform": css3,
          "-moz-transform": css3,
          "-o-transform": css3,
          "-ms-transform": css3,
          "transform": css3
        };
      };

      TypeFrameWork.prototype.cssRotation = function(rx, ry, z) {
        var css3;
        css3 = "translateZ(" + z + "px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        return {
          "-webkit-transform": css3,
          "-moz-transform": css3,
          "-o-transform": css3,
          "-ms-transform": css3,
          "transform": css3
        };
      };

      TypeFrameWork.prototype.css3DSet = function(perspective, originX, originY) {
        var css, orign, style;
        perspective = "" + perspective + "px";
        style = "preserve-3d";
        orign = "" + originX + " " + originY;
        css = {
          "-webkit-perspective": perspective,
          "-moz-perspective": perspective,
          "-o-perspective": perspective,
          "-ms-perspective": perspective,
          "perspective": perspective,
          "-webkit-transform-style": style,
          "-moz-transform-style": style,
          "-o-transform-style": style,
          "-ms-transform-style": style,
          "transform-style": style,
          "-webkit-perspective-origin": orign,
          "-moz-perspective-origin": orign,
          "-o-perspective-origin": orign,
          "-ms-perspective-origin": orign,
          "-transform-perspective-origin": orign
        };
        return css;
      };

      TypeFrameWork.prototype.css3PerspectiveOrigin = function(originX, originY) {
        var orign;
        orign = "" + originX + " " + originY;
        return {
          "-webkit-perspective-origin": orign,
          "-moz-perspective-origin": orign,
          "-o-perspective-origin": orign,
          "-ms-perspective-origin": orign,
          "-transform-perspective-origin": orign
        };
      };

      TypeFrameWork.prototype.cssTransformOrig = function(x, y) {
        var css3;
        css3 = "" + x + " " + y;
        return {
          "-webkit-transform-origin": css3,
          "-moz-transform-origin": css3,
          "-o-transform-origin": css3,
          "-ms-transform-origin": css3,
          "transform-origin": css3
        };
      };

      return TypeFrameWork;

    })(ns.Event);
    ns.TypeThread = (function(_super) {
      __extends(TypeThread, _super);

      TypeThread.prototype.defaults = {
        frameRate: 60
      };

      function TypeThread(options) {
        this.options = $.extend({}, this.defaults, options);
        this.updateProcess = $.noop;
        this.lastTime = null;
        this.startTime = null;
        this.oldFrame = null;
        this.stop = false;
      }

      TypeThread.prototype.setup = function() {
        return this.startTime = window.getTime();
      };

      TypeThread.prototype.update = function(method) {
        var currentFrame;
        if (method == null) {
          method = $.noop;
        }
        this.updateProcess = window.requestAnimationFrame((function(_this) {
          return function() {
            return _this.update(method);
          };
        })(this));
        this.lastTime = window.getTime();
        currentFrame = Math.floor((this.lastTime - this.startTime) / (1000.0 / this.options.frameRate) % 2);
        if (currentFrame !== this.oldFrame) {
          method();
          if (this._draw != null) {
            this._draw();
          }
        }
        return this.oldFrame = currentFrame;
      };

      TypeThread.prototype.draw = function(method) {
        if (method == null) {
          method = $.noop;
        }
        this._draw = method;
      };

      TypeThread.prototype["break"] = function() {
        return cancelAnimationFrame(this.updateProcess);
      };

      return TypeThread;

    })(ns.Event);
    $.TypeFrameWork = ns.TypeFrameWork;
    return $.TypeThread = ns.TypeThread;
  })(window, document, jQuery);


  /*
   
   * document
   
   * ============================================================
   * hover method
   * hover (jQuery Element, enter Event, leave Event)
   
   * example
   
    tf.hover $("#js-index-nav").find("a"),
      (e, index) ->
        $(e.target).css "display", "none"
        console.log index
      (e, index) ->
         *e.target.css "opacty", 1
        console.log "leave"
   
   
   
   * ============================================================
   * example
     * mousemove method
     * mousemove (jQuery Element, moved Event)
   
    tf.mouseMoved ->
      tf.setMouseMoved($("#content"), (x, y) -> console.log "x: #{x} y: #{y}", option translate)
   
   
   * ============================================================
   * example
     * mousePressed method
     * mousePressed (jQuery Element, moved Event)
   
    tf.mousePressed ->
      tf.setMousePressed($("#content"), (x, y) -> console.log "x: #{x} y: #{y}")
   
   
   * ============================================================
   * example
     * mouseReleased method
     * mouseReleased (jQuery Element, moved Event)
   
    tf.mouseReleased ->
      tf.setMouseReleased($("#content"), (x, y) -> console.log "x: #{x} y: #{y}")
   
   
   * ============================================================
   * example
     * windowResized method
     * windowResized
   
    tf.windowResized (w, h) ->
      console.log "w: #{w} h: #{h}"
   
   
   * ============================================================
   * example
     * exit method
     * exit
    
    TypeFrameWork instance
    
    instance = instance.exit callbackFunction
   
    return null
   
   
    tf = new $.TypeFrameWork
    tf = tf.exit ->
      console.log "callback"
   
   
   * ============================================================
   * TypeThread example
    t = new $.TypeThread
        frameRate: 1
      t.setup()
      t.update ->
        console.log ""
   
   *--------------------------------------------------------------
   * CSS Animate Helper
     * cssTransitionProperty method
    
    tf.cssTransitionProperty(["width", "height"])
   */

}).call(this);

//# sourceMappingURL=typeFrameWork.js.map
