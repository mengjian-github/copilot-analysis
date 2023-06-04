require.d(exports, {
  c: () => h
});
var r = require(15834);
var i = function (e, t) {
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
var o = function (e, t, n) {
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
var s = function () {
  function e() {}
  e.prototype.active = function () {
    return r.I;
  };
  e.prototype.with = function (e, t, n) {
    for (r = [], s = 3, void 0; s < arguments.length; s++) {
      var r;
      var s;
      r[s - 3] = arguments[s];
    }
    return t.call.apply(t, o([n], i(r), !1));
  };
  e.prototype.bind = function (e, t) {
    return t;
  };
  e.prototype.enable = function () {
    return this;
  };
  e.prototype.disable = function () {
    return this;
  };
  return e;
}();
var a = require(30658);
var c = require(95774);
var l = function (e, t) {
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
var u = function (e, t, n) {
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
var p = "context";
var d = new s();
var h = function () {
  function e() {}
  e.getInstance = function () {
    if (this._instance) {
      this._instance = new e();
    }
    return this._instance;
  };
  e.prototype.setGlobalContextManager = function (e) {
    return a.TG(p, e, c.G.instance());
  };
  e.prototype.active = function () {
    return this._getContextManager().active();
  };
  e.prototype.with = function (e, t, n) {
    for (i = [], o = 3, void 0; o < arguments.length; o++) {
      var r;
      var i;
      var o;
      i[o - 3] = arguments[o];
    }
    return (r = this._getContextManager()).with.apply(r, u([e, t, n], l(i), !1));
  };
  e.prototype.bind = function (e, t) {
    return this._getContextManager().bind(e, t);
  };
  e.prototype._getContextManager = function () {
    return a.Rd(p) || d;
  };
  e.prototype.disable = function () {
    this._getContextManager().disable();
    a.J_(p, c.G.instance());
  };
  return e;
}();