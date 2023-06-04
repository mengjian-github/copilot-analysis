require.d(exports, {
  Y: () => i
});
var r = require(90928);
var i = function () {
  function e(e) {
    var t;
    if (void 0 === e) {
      e = {};
    }
    this._propagators = null !== (t = e.propagators) && void 0 !== t ? t : [];
    this._fields = Array.from(new Set(this._propagators.map(function (e) {
      return "function" == typeof e.fields ? e.fields() : [];
    }).reduce(function (e, t) {
      return e.concat(t);
    }, [])));
  }
  e.prototype.inject = function (e, t, n) {
    var i;
    var o;
    try {
      for (s = function (e) {
        var t = "function" == typeof Symbol && Symbol.iterator;
        var n = t && e[t];
        var r = 0;
        if (n) return n.call(e);
        if (e && "number" == typeof e.length) return {
          next: function () {
            if (e && r >= e.length) {
              e = void 0;
            }
            return {
              value: e && e[r++],
              done: !e
            };
          }
        };
        throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }(this._propagators), a = s.next(), void 0; !a.done; a = s.next()) {
        var s;
        var a;
        var c = a.value;
        try {
          c.inject(e, t, n);
        } catch (e) {
          r.K.warn("Failed to inject with " + c.constructor.name + ". Err: " + e.message);
        }
      }
    } catch (e) {
      i = {
        error: e
      };
    } finally {
      try {
        if (a && !a.done && (o = s.return)) {
          o.call(s);
        }
      } finally {
        if (i) throw i.error;
      }
    }
  };
  e.prototype.extract = function (e, t, n) {
    return this._propagators.reduce(function (e, i) {
      try {
        return i.extract(e, t, n);
      } catch (e) {
        r.K.warn("Failed to inject with " + i.constructor.name + ". Err: " + e.message);
      }
      return e;
    }, e);
  };
  e.prototype.fields = function () {
    return this._fields.slice();
  };
  return e;
}();