module.exports = function e(t, n) {
  if (t === n) return !0;
  if (t && n && "object" == typeof t && "object" == typeof n) {
    if (t.constructor !== n.constructor) return !1;
    var r;
    var i;
    var o;
    if (Array.isArray(t)) {
      if ((r = t.length) != n.length) return !1;
      for (i = r; 0 != i--;) if (!e(t[i], n[i])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
    if ((r = (o = Object.keys(t)).length) !== Object.keys(n).length) return !1;
    for (i = r; 0 != i--;) if (!Object.prototype.hasOwnProperty.call(n, o[i])) return !1;
    for (i = r; 0 != i--;) {
      var s = o[i];
      if (!e(t[s], n[s])) return !1;
    }
    return !0;
  }
  return t != t && n != n;
};