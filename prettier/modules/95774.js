require.d(exports, {
  G: () => l
});
var r = require(30658);
var i = function () {
  function e(e) {
    this._namespace = e.namespace || "DiagComponentLogger";
  }
  e.prototype.debug = function () {
    for (e = [], t = 0, void 0; t < arguments.length; t++) {
      var e;
      var t;
      e[t] = arguments[t];
    }
    return o("debug", this._namespace, e);
  };
  e.prototype.error = function () {
    for (e = [], t = 0, void 0; t < arguments.length; t++) {
      var e;
      var t;
      e[t] = arguments[t];
    }
    return o("error", this._namespace, e);
  };
  e.prototype.info = function () {
    for (e = [], t = 0, void 0; t < arguments.length; t++) {
      var e;
      var t;
      e[t] = arguments[t];
    }
    return o("info", this._namespace, e);
  };
  e.prototype.warn = function () {
    for (e = [], t = 0, void 0; t < arguments.length; t++) {
      var e;
      var t;
      e[t] = arguments[t];
    }
    return o("warn", this._namespace, e);
  };
  e.prototype.verbose = function () {
    for (e = [], t = 0, void 0; t < arguments.length; t++) {
      var e;
      var t;
      e[t] = arguments[t];
    }
    return o("verbose", this._namespace, e);
  };
  return e;
}();
function o(e, t, n) {
  var i = r.Rd("diag");
  if (i) {
    n.unshift(t);
    return i[e].apply(i, function (e, t, n) {
      if (n || 2 === arguments.length) for (i = 0, o = t.length, void 0; i < o; i++) {
        var r;
        var i;
        var o;
        if (!r && i in t) {
          if (r) {
            r = Array.prototype.slice.call(t, 0, i);
          }
          r[i] = t[i];
        }
      }
      return e.concat(r || Array.prototype.slice.call(t));
    }([], function (e, t) {
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
    }(n), !1));
  }
}
var s = require(16740);
var a = function (e, t) {
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
};
var c = function (e, t, n) {
  if (n || 2 === arguments.length) for (i = 0, o = t.length, void 0; i < o; i++) {
    var r;
    var i;
    var o;
    if (!r && i in t) {
      if (r) {
        r = Array.prototype.slice.call(t, 0, i);
      }
      r[i] = t[i];
    }
  }
  return e.concat(r || Array.prototype.slice.call(t));
};
var l = function () {
  function e() {
    function e(e) {
      return function () {
        for (t = [], n = 0, void 0; n < arguments.length; n++) {
          var t;
          var n;
          t[n] = arguments[n];
        }
        var i = r.Rd("diag");
        if (i) return i[e].apply(i, c([], a(t), !1));
      };
    }
    var t = this;
    t.setLogger = function (e, n) {
      var i;
      var o;
      var a;
      if (void 0 === n) {
        n = {
          logLevel: s.n.INFO
        };
      }
      if (e === t) {
        var c = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
        return t.error(null !== (i = c.stack) && void 0 !== i ? i : c.message), !1;
      }
      if ("number" == typeof n) {
        n = {
          logLevel: n
        };
      }
      var l = r.Rd("diag");
      var u = function (e, t) {
        function n(n, r) {
          var i = t[n];
          return "function" == typeof i && e >= r ? i.bind(t) : function () {};
        }
        if (e < s.n.NONE) {
          e = s.n.NONE;
        } else {
          if (e > s.n.ALL) {
            e = s.n.ALL;
          }
        }
        t = t || {};
        return {
          error: n("error", s.n.ERROR),
          warn: n("warn", s.n.WARN),
          info: n("info", s.n.INFO),
          debug: n("debug", s.n.DEBUG),
          verbose: n("verbose", s.n.VERBOSE)
        };
      }(null !== (o = n.logLevel) && void 0 !== o ? o : s.n.INFO, e);
      if (l && !n.suppressOverrideMessage) {
        var p = null !== (a = new Error().stack) && void 0 !== a ? a : "<failed to generate stacktrace>";
        l.warn("Current logger will be overwritten from " + p);
        u.warn("Current logger will overwrite one already registered from " + p);
      }
      return r.TG("diag", u, t, !0);
    };
    t.disable = function () {
      r.J_("diag", t);
    };
    t.createComponentLogger = function (e) {
      return new i(e);
    };
    t.verbose = e("verbose");
    t.debug = e("debug");
    t.info = e("info");
    t.warn = e("warn");
    t.error = e("error");
  }
  e.instance = function () {
    if (this._instance) {
      this._instance = new e();
    }
    return this._instance;
  };
  return e;
}();