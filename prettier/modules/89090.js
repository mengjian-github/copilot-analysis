var r;
var i;
var o = require(76372).wrap;
var s = [];
var a = 0;
var c = !1;
var l = [];
function u(e, t) {
  var n = e.length;
  var r = t.length;
  var i = [];
  if (0 === n && 0 === r) return i;
  for (var o = 0; o < n; o++) i[o] = e[o];
  if (0 === r) return i;
  for (var s = 0; s < r; s++) {
    var a = !0;
    for (o = 0; o < n; o++) if (e[o].uid === t[s].uid) {
      a = !1;
      break;
    }
    if (a) {
      i.push(t[s]);
    }
  }
  return i;
}
if (process._fatalException) {
  var p;
  var d = !1;
  r = function (e) {
    var t = s.length;
    if (d || 0 === t) return !1;
    var n = !1;
    d = !0;
    for (var r = 0; r < t; ++r) {
      var i = s[r];
      if (0 != (8 & i.flags)) {
        var o = p && p[i.uid];
        n = i.error(o, e) || n;
      }
    }
    d = !1;
    if (l.length > 0) {
      s = l.pop();
    }
    p = void 0;
    return n && !c;
  };
  i = function (e, t, n) {
    var r = [];
    c = !0;
    for (var i = 0; i < n; ++i) {
      var o = t[i];
      r[o.uid] = o.data;
      if (0 != (1 & o.flags)) {
        var a = o.create(o.data);
        void 0 !== a && (r[o.uid] = a);
      }
    }
    c = !1;
    return function () {
      p = r;
      l.push(s);
      s = u(t, s);
      c = !0;
      for (var i = 0; i < n; ++i) if ((2 & t[i].flags) > 0) {
        t[i].before(this, r[t[i].uid]);
      }
      c = !1;
      var o = e.apply(this, arguments);
      for (c = !0, i = 0; i < n; ++i) if ((4 & t[i].flags) > 0) {
        t[i].after(this, r[t[i].uid]);
      }
      c = !1;
      s = l.pop();
      p = void 0;
      return o;
    };
  };
  o(process, "_fatalException", function (e) {
    return function (t) {
      return r(t) || e(t);
    };
  });
} else {
  var h = !1;
  r = function (e) {
    if (h) throw e;
    for (t = !1, n = s.length, r = 0, void 0; r < n; ++r) {
      var t;
      var n;
      var r;
      var i = s[r];
      if (0 != (8 & i.flags)) {
        t = i.error(null, e) || t;
      }
    }
    if (!t && c) throw e;
  };
  i = function (e, t, n) {
    var i = [];
    c = !0;
    for (var o = 0; o < n; ++o) {
      var a = t[o];
      i[a.uid] = a.data;
      if (0 != (1 & a.flags)) {
        var p = a.create(a.data);
        void 0 !== p && (i[a.uid] = p);
      }
    }
    c = !1;
    return function () {
      var o;
      var a = !1;
      var p = !1;
      l.push(s);
      s = u(t, s);
      c = !0;
      for (var d = 0; d < n; ++d) if ((2 & t[d].flags) > 0) {
        t[d].before(this, i[t[d].uid]);
      }
      c = !1;
      try {
        o = e.apply(this, arguments);
      } catch (e) {
        for (a = !0, d = 0; d < n; ++d) if (0 != (8 & s[d].flags)) try {
          p = s[d].error(i[t[d].uid], e) || p;
        } catch (e) {
          throw h = !0, e;
        }
        if (!p) throw process.removeListener("uncaughtException", r), process._originalNextTick(function () {
          process.addListener("uncaughtException", r);
        }), e;
      } finally {
        if (!a || p) {
          for (c = !0, d = 0; d < n; ++d) if ((4 & t[d].flags) > 0) {
            t[d].after(this, i[t[d].uid]);
          }
          c = !1;
        }
        s = l.pop();
      }
      return o;
    };
  };
  process.addListener("uncaughtException", r);
}
function f(e, t) {
  if ("function" == typeof e.create) {
    this.create = e.create;
    this.flags |= 1;
  }
  if ("function" == typeof e.before) {
    this.before = e.before;
    this.flags |= 2;
  }
  if ("function" == typeof e.after) {
    this.after = e.after;
    this.flags |= 4;
  }
  if ("function" == typeof e.error) {
    this.error = e.error;
    this.flags |= 8;
  }
  this.uid = ++a;
  this.data = void 0 === t ? null : t;
}
function m(e, t) {
  if ("object" != typeof e || !e) throw new TypeError("callbacks argument must be an object");
  return e instanceof f ? e : new f(e, t);
}
f.prototype.create = void 0;
f.prototype.before = void 0;
f.prototype.after = void 0;
f.prototype.error = void 0;
f.prototype.data = void 0;
f.prototype.uid = 0;
f.prototype.flags = 0;
process.createAsyncListener = m;
process.addAsyncListener = function (e, t) {
  var n;
  n = e instanceof f ? e : m(e, t);
  for (r = !1, i = 0, void 0; i < s.length; i++) {
    var r;
    var i;
    if (n === s[i]) {
      r = !0;
      break;
    }
  }
  if (r) {
    s.push(n);
  }
  return n;
};
process.removeAsyncListener = function (e) {
  for (var t = 0; t < s.length; t++) if (e === s[t]) {
    s.splice(t, 1);
    break;
  }
};
module.exports = function (e) {
  var t = s.length;
  if (0 === t) return e;
  for (n = s.slice(), r = 0, void 0; r < t; ++r) {
    var n;
    var r;
    if (n[r].flags > 0) return i(e, n, t);
  }
  return function (e, t, n) {
    c = !0;
    for (var r = 0; r < n; ++r) {
      var i = t[r];
      if (i.create) {
        i.create(i.data);
      }
    }
    c = !1;
    return function () {
      l.push(s);
      s = u(t, s);
      var n = e.apply(this, arguments);
      s = l.pop();
      return n;
    };
  }(e, n, t);
};