var t = {};
module.exports = t;
var n = {};
t.encode = function (e, t, n) {
  if ("string" != typeof t) throw new TypeError('"alphabet" must be a string.');
  if (void 0 !== n && "number" != typeof n) throw new TypeError('"maxline" must be a number.');
  var r = "";
  if (e instanceof Uint8Array) {
    var i = 0;
    var o = t.length;
    var s = t.charAt(0);
    var a = [0];
    for (i = 0; i < e.length; ++i) {
      for (c = 0, l = e[i], void 0; c < a.length; ++c) {
        var c;
        var l;
        l += a[c] << 8;
        a[c] = l % o;
        l = l / o | 0;
      }
      for (; l > 0;) {
        a.push(l % o);
        l = l / o | 0;
      }
    }
    for (i = 0; 0 === e[i] && i < e.length - 1; ++i) r += s;
    for (i = a.length - 1; i >= 0; --i) r += t[a[i]];
  } else r = function (e, t) {
    var n = 0;
    var r = t.length;
    var i = t.charAt(0);
    var o = [0];
    for (n = 0; n < e.length(); ++n) {
      for (s = 0, a = e.at(n), void 0; s < o.length; ++s) {
        var s;
        var a;
        a += o[s] << 8;
        o[s] = a % r;
        a = a / r | 0;
      }
      for (; a > 0;) {
        o.push(a % r);
        a = a / r | 0;
      }
    }
    var c = "";
    for (n = 0; 0 === e.at(n) && n < e.length() - 1; ++n) c += i;
    for (n = o.length - 1; n >= 0; --n) c += t[o[n]];
    return c;
  }(e, t);
  if (n) {
    var u = new RegExp(".{1," + n + "}", "g");
    r = r.match(u).join("\r\n");
  }
  return r;
};
t.decode = function (e, t) {
  if ("string" != typeof e) throw new TypeError('"input" must be a string.');
  if ("string" != typeof t) throw new TypeError('"alphabet" must be a string.');
  var r = n[t];
  if (!r) {
    r = n[t] = [];
    for (var i = 0; i < t.length; ++i) r[t.charCodeAt(i)] = i;
  }
  e = e.replace(/\s/g, "");
  var o = t.length;
  var s = t.charAt(0);
  var a = [0];
  for (i = 0; i < e.length; i++) {
    var c = r[e.charCodeAt(i)];
    if (void 0 === c) return;
    for (l = 0, u = c, void 0; l < a.length; ++l) {
      var l;
      var u;
      u += a[l] * o;
      a[l] = 255 & u;
      u >>= 8;
    }
    for (; u > 0;) {
      a.push(255 & u);
      u >>= 8;
    }
  }
  for (var p = 0; e[p] === s && p < e.length - 1; ++p) a.push(0);
  return "undefined" != typeof Buffer ? Buffer.from(a.reverse()) : new Uint8Array(a.reverse());
};