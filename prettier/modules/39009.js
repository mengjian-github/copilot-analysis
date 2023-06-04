require.d(exports, {
  T: () => h
});
var r;
var i;
var o = Function.prototype.toString;
var s = o.call(Object);
var a = (r = Object.getPrototypeOf, i = Object, function (e) {
  return r(i(e));
});
var c = Object.prototype;
var l = c.hasOwnProperty;
var u = Symbol ? Symbol.toStringTag : void 0;
var p = c.toString;
function d(e) {
  if (!function (e) {
    return null != e && "object" == typeof e;
  }(e) || "[object Object]" !== function (e) {
    return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : u && u in Object(e) ? function (e) {
      var t = l.call(e, u);
      var n = e[u];
      var r = !1;
      try {
        e[u] = void 0;
        r = !0;
      } catch (e) {}
      var i = p.call(e);
      if (r) {
        if (t) {
          e[u] = n;
        } else {
          delete e[u];
        }
      }
      return i;
    }(e) : function (e) {
      return p.call(e);
    }(e);
  }(e)) return !1;
  var t = a(e);
  if (null === t) return !0;
  var n = l.call(t, "constructor") && t.constructor;
  return "function" == typeof n && n instanceof n && o.call(n) === s;
}
function h() {
  for (e = [], t = 0, void 0; t < arguments.length; t++) {
    var e;
    var t;
    e[t] = arguments[t];
  }
  for (n = e.shift(), r = new WeakMap(), void 0; e.length > 0;) {
    var n;
    var r;
    n = m(n, e.shift(), 0, r);
  }
  return n;
}
function f(e) {
  return y(e) ? e.slice() : e;
}
function m(e, t, n, r) {
  var i;
  if (void 0 === n) {
    n = 0;
  }
  if (!(n > 20)) {
    if (n++, b(e) || b(t) || _(t)) i = f(t);else if (y(e)) {
      if (i = e.slice(), y(t)) for (var o = 0, s = t.length; o < s; o++) i.push(f(t[o]));else if (v(t)) for (o = 0, s = (a = Object.keys(t)).length; o < s; o++) i[c = a[o]] = f(t[c]);
    } else if (v(e)) if (v(t)) {
      if (!function (e, t) {
        return !(!d(e) || !d(t));
      }(e, t)) return t;
      var a;
      for (i = Object.assign({}, e), o = 0, s = (a = Object.keys(t)).length; o < s; o++) {
        var c,
          l = t[c = a[o]];
        if (b(l)) void 0 === l ? delete i[c] : i[c] = l;else {
          var u = i[c],
            p = l;
          if (g(e, c, r) || g(t, c, r)) delete i[c];else {
            if (v(u) && v(p)) {
              var h = r.get(u) || [],
                E = r.get(p) || [];
              h.push({
                obj: e,
                key: c
              }), E.push({
                obj: t,
                key: c
              }), r.set(u, h), r.set(p, E);
            }
            i[c] = m(i[c], l, n, r);
          }
        }
      }
    } else i = t;
    return i;
  }
}
function g(e, t, n) {
  for (r = n.get(e[t]) || [], i = 0, o = r.length, void 0; i < o; i++) {
    var r;
    var i;
    var o;
    var s = r[i];
    if (s.key === t && s.obj === e) return !0;
  }
  return !1;
}
function y(e) {
  return Array.isArray(e);
}
function _(e) {
  return "function" == typeof e;
}
function v(e) {
  return !b(e) && !y(e) && !_(e) && "object" == typeof e;
}
function b(e) {
  return "string" == typeof e || "number" == typeof e || "boolean" == typeof e || void 0 === e || e instanceof Date || e instanceof RegExp || null === e;
}