require.d(exports, {
  u: () => l,
  H: () => c
});
var r = require(95774);
var i = function (e) {
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
};
var o = function () {
  function e(e) {
    this._entries = e ? new Map(e) : new Map();
  }
  e.prototype.getEntry = function (e) {
    var t = this._entries.get(e);
    if (t) return Object.assign({}, t);
  };
  e.prototype.getAllEntries = function () {
    return Array.from(this._entries.entries()).map(function (e) {
      var t = function (e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n) return e;
        var r;
        var i;
        var o = n.call(e);
        var s = [];
        try {
          for (; (void 0 === t || t-- > 0) && !(r = o.next()).done;) s.push(r.value);
        } catch (e) {
          i = {
            error: e
          };
        } finally {
          try {
            if (r && !r.done && (n = o.return)) {
              n.call(o);
            }
          } finally {
            if (i) throw i.error;
          }
        }
        return s;
      }(e, 2);
      return [t[0], t[1]];
    });
  };
  e.prototype.setEntry = function (t, n) {
    var r = new e(this._entries);
    r._entries.set(t, n);
    return r;
  };
  e.prototype.removeEntry = function (t) {
    var n = new e(this._entries);
    n._entries.delete(t);
    return n;
  };
  e.prototype.removeEntries = function () {
    for (r = [], o = 0, void 0; o < arguments.length; o++) {
      var t;
      var n;
      var r;
      var o;
      r[o] = arguments[o];
    }
    var s = new e(this._entries);
    try {
      for (a = i(r), c = a.next(), void 0; !c.done; c = a.next()) {
        var a;
        var c;
        var l = c.value;
        s._entries.delete(l);
      }
    } catch (e) {
      t = {
        error: e
      };
    } finally {
      try {
        if (c && !c.done && (n = a.return)) {
          n.call(a);
        }
      } finally {
        if (t) throw t.error;
      }
    }
    return s;
  };
  e.prototype.clear = function () {
    return new e();
  };
  return e;
}();
var s = Symbol("BaggageEntryMetadata");
var a = r.G.instance();
function c(e) {
  if (void 0 === e) {
    e = {};
  }
  return new o(new Map(Object.entries(e)));
}
function l(e) {
  if ("string" != typeof e) {
    a.error("Cannot create baggage metadata from unknown type: " + typeof e);
    e = "";
  }
  return {
    __TYPE__: s,
    toString: function () {
      return e;
    }
  };
}