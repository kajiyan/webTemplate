(function() {
  var sn,
    __slice = [].slice;

  sn = window;

  sn.TypeEvent = (function() {
    function TypeEvent() {}

    TypeEvent.prototype.on = function(ev, callback) {
      var evs, name, _base, _i, _len;
      if (this._callbacks == null) {
        this._callbacks = {};
      }
      evs = ev.split(' ');
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        (_base = this._callbacks)[name] || (_base[name] = []);
        this._callbacks[name].push(callback);
      }
      return this;
    };

    TypeEvent.prototype.once = function(ev, callback) {
      this.on(ev, function() {
        this.off(ev, arguments.callee);
        return callback.apply(this, arguments);
      });
      return this;
    };

    TypeEvent.prototype.trigger = function() {
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

    TypeEvent.prototype.off = function(ev, callback) {
      var cb, evs, i, list, name, _i, _j, _len, _len1, _ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      evs = ev.split(' ');
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        list = (_ref = this._callbacks) != null ? _ref[name] : void 0;
        if (list) {
          if (callback) {
            for (i = _j = 0, _len1 = list.length; _j < _len1; i = ++_j) {
              cb = list[i];
              if (!(cb === callback)) {
                continue;
              }
              list = list.slice();
              list.splice(i, 1);
              this._callbacks[name] = list;
            }
          } else {
            delete this._callbacks[name];
          }
        }
      }
      return this;
    };

    return TypeEvent;

  })();

}).call(this);

//# sourceMappingURL=typeEvent.js.map
