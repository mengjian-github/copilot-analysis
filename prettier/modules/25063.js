var r = require(3832);
require(28991);
require(97116);
var i = module.exports = r.md5 = r.md5 || {};
r.md.md5 = r.md.algorithms.md5 = i;
i.create = function () {
  if (l) {
    (function () {
      o = String.fromCharCode(128);
      o += r.util.fillString(String.fromCharCode(0), 64);
      s = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 6, 11, 0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 5, 8, 11, 14, 1, 4, 7, 10, 13, 0, 3, 6, 9, 12, 15, 2, 0, 7, 14, 5, 12, 3, 10, 1, 8, 15, 6, 13, 4, 11, 2, 9];
      a = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
      c = new Array(64);
      for (var e = 0; e < 64; ++e) c[e] = Math.floor(4294967296 * Math.abs(Math.sin(e + 1)));
      l = !0;
    })();
  }
  var e = null;
  var t = r.util.createBuffer();
  var n = new Array(16);
  var i = {
    algorithm: "md5",
    blockLength: 64,
    digestLength: 16,
    messageLength: 0,
    fullMessageLength: null,
    messageLengthSize: 8,
    start: function () {
      i.messageLength = 0;
      i.fullMessageLength = i.messageLength64 = [];
      for (n = i.messageLengthSize / 4, o = 0, void 0; o < n; ++o) {
        var n;
        var o;
        i.fullMessageLength.push(0);
      }
      t = r.util.createBuffer();
      e = {
        h0: 1732584193,
        h1: 4023233417,
        h2: 2562383102,
        h3: 271733878
      };
      return i;
    }
  };
  i.start();
  i.update = function (o, s) {
    if ("utf8" === s) {
      o = r.util.encodeUtf8(o);
    }
    var a = o.length;
    i.messageLength += a;
    a = [a / 4294967296 >>> 0, a >>> 0];
    for (var c = i.fullMessageLength.length - 1; c >= 0; --c) {
      i.fullMessageLength[c] += a[1];
      a[1] = a[0] + (i.fullMessageLength[c] / 4294967296 >>> 0);
      i.fullMessageLength[c] = i.fullMessageLength[c] >>> 0;
      a[0] = a[1] / 4294967296 >>> 0;
    }
    t.putBytes(o);
    u(e, n, t);
    if (t.read > 2048 || 0 === t.length()) {
      t.compact();
    }
    return i;
  };
  i.digest = function () {
    var s = r.util.createBuffer();
    s.putBytes(t.bytes());
    var a = i.fullMessageLength[i.fullMessageLength.length - 1] + i.messageLengthSize & i.blockLength - 1;
    s.putBytes(o.substr(0, i.blockLength - a));
    for (l = 0, p = i.fullMessageLength.length - 1, void 0; p >= 0; --p) {
      var c;
      var l;
      var p;
      l = (c = 8 * i.fullMessageLength[p] + l) / 4294967296 >>> 0;
      s.putInt32Le(c >>> 0);
    }
    var d = {
      h0: e.h0,
      h1: e.h1,
      h2: e.h2,
      h3: e.h3
    };
    u(d, n, s);
    var h = r.util.createBuffer();
    h.putInt32Le(d.h0);
    h.putInt32Le(d.h1);
    h.putInt32Le(d.h2);
    h.putInt32Le(d.h3);
    return h;
  };
  return i;
};
var o = null;
var s = null;
var a = null;
var c = null;
var l = !1;
function u(e, t, n) {
  for (h = n.length(), void 0; h >= 64;) {
    var r;
    var i;
    var o;
    var l;
    var u;
    var p;
    var d;
    var h;
    for (i = e.h0, o = e.h1, l = e.h2, u = e.h3, d = 0; d < 16; ++d) {
      t[d] = n.getInt32Le();
      r = i + (u ^ o & (l ^ u)) + c[d] + t[d];
      i = u;
      u = l;
      l = o;
      o += r << (p = a[d]) | r >>> 32 - p;
    }
    for (; d < 32; ++d) {
      r = i + (l ^ u & (o ^ l)) + c[d] + t[s[d]];
      i = u;
      u = l;
      l = o;
      o += r << (p = a[d]) | r >>> 32 - p;
    }
    for (; d < 48; ++d) {
      r = i + (o ^ l ^ u) + c[d] + t[s[d]];
      i = u;
      u = l;
      l = o;
      o += r << (p = a[d]) | r >>> 32 - p;
    }
    for (; d < 64; ++d) {
      r = i + (l ^ (o | ~u)) + c[d] + t[s[d]];
      i = u;
      u = l;
      l = o;
      o += r << (p = a[d]) | r >>> 32 - p;
    }
    e.h0 = e.h0 + i | 0;
    e.h1 = e.h1 + o | 0;
    e.h2 = e.h2 + l | 0;
    e.h3 = e.h3 + u | 0;
    h -= 64;
  }
}