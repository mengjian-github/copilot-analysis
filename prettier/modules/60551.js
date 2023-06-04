require.d(exports, {
  Do: () => c,
  FT: () => s,
  sy: () => a
});
var r = require(90928);
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
var o = function (e, t) {
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
function s(e) {
  var t;
  var n;
  var s = {};
  if ("object" != typeof e || null == e) return s;
  try {
    for (l = i(Object.entries(e)), u = l.next(), void 0; !u.done; u = l.next()) {
      var l;
      var u;
      var p = o(u.value, 2);
      var d = p[0];
      var h = p[1];
      if (a(d)) {
        if (c(h)) {
          if (Array.isArray(h)) {
            s[d] = h.slice();
          } else {
            s[d] = h;
          }
        } else {
          r.K.warn("Invalid attribute value set for key: " + d);
        }
      } else {
        r.K.warn("Invalid attribute key: " + d);
      }
    }
  } catch (e) {
    t = {
      error: e
    };
  } finally {
    try {
      if (u && !u.done && (n = l.return)) {
        n.call(l);
      }
    } finally {
      if (t) throw t.error;
    }
  }
  return s;
}
function a(e) {
  return "string" == typeof e && e.length > 0;
}
function c(e) {
  return null == e || (Array.isArray(e) ? function (e) {
    var t;
    var n;
    var r;
    try {
      for (o = i(e), s = o.next(), void 0; !s.done; s = o.next()) {
        var o;
        var s;
        var a = s.value;
        if (null != a) {
          if (!r) {
            if (l(a)) {
              r = typeof a;
              continue;
            }
            return !1;
          }
          if (typeof a !== r) return !1;
        }
      }
    } catch (e) {
      t = {
        error: e
      };
    } finally {
      try {
        if (s && !s.done && (n = o.return)) {
          n.call(o);
        }
      } finally {
        if (t) throw t.error;
      }
    }
    return !0;
  }(e) : l(e));
}
function l(e) {
  switch (typeof e) {
    case "number":
    case "boolean":
    case "string":
      return !0;
  }
  return !1;
}