var r = require(3832);
require(28991);
require(97116);
var i = module.exports = r.sha1 = r.sha1 || {};
r.md.sha1 = r.md.algorithms.sha1 = i;
i.create = function () {
  if (s) {
    o = String.fromCharCode(128);
    o += r.util.fillString(String.fromCharCode(0), 64);
    s = !0;
  }
  var e = null;
  var t = r.util.createBuffer();
  var n = new Array(80);
  var i = {
    algorithm: "sha1",
    blockLength: 64,
    digestLength: 20,
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
        h3: 271733878,
        h4: 3285377520
      };
      return i;
    }
  };
  i.start();
  i.update = function (o, s) {
    if ("utf8" === s) {
      o = r.util.encodeUtf8(o);
    }
    var c = o.length;
    i.messageLength += c;
    c = [c / 4294967296 >>> 0, c >>> 0];
    for (var l = i.fullMessageLength.length - 1; l >= 0; --l) {
      i.fullMessageLength[l] += c[1];
      c[1] = c[0] + (i.fullMessageLength[l] / 4294967296 >>> 0);
      i.fullMessageLength[l] = i.fullMessageLength[l] >>> 0;
      c[0] = c[1] / 4294967296 >>> 0;
    }
    t.putBytes(o);
    a(e, n, t);
    if (t.read > 2048 || 0 === t.length()) {
      t.compact();
    }
    return i;
  };
  i.digest = function () {
    var s = r.util.createBuffer();
    s.putBytes(t.bytes());
    var c;
    var l = i.fullMessageLength[i.fullMessageLength.length - 1] + i.messageLengthSize & i.blockLength - 1;
    s.putBytes(o.substr(0, i.blockLength - l));
    for (u = 8 * i.fullMessageLength[0], p = 0, void 0; p < i.fullMessageLength.length - 1; ++p) {
      var u;
      var p;
      u += (c = 8 * i.fullMessageLength[p + 1]) / 4294967296 >>> 0;
      s.putInt32(u >>> 0);
      u = c >>> 0;
    }
    s.putInt32(u);
    var d = {
      h0: e.h0,
      h1: e.h1,
      h2: e.h2,
      h3: e.h3,
      h4: e.h4
    };
    a(d, n, s);
    var h = r.util.createBuffer();
    h.putInt32(d.h0);
    h.putInt32(d.h1);
    h.putInt32(d.h2);
    h.putInt32(d.h3);
    h.putInt32(d.h4);
    return h;
  };
  return i;
};
var o = null;
var s = !1;
function a(e, t, n) {
  for (u = n.length(), void 0; u >= 64;) {
    var r;
    var i;
    var o;
    var s;
    var a;
    var c;
    var l;
    var u;
    for (i = e.h0, o = e.h1, s = e.h2, a = e.h3, c = e.h4, l = 0; l < 16; ++l) {
      r = n.getInt32();
      t[l] = r;
      r = (i << 5 | i >>> 27) + (a ^ o & (s ^ a)) + c + 1518500249 + r;
      c = a;
      a = s;
      s = (o << 30 | o >>> 2) >>> 0;
      o = i;
      i = r;
    }
    for (; l < 20; ++l) {
      r = (r = t[l - 3] ^ t[l - 8] ^ t[l - 14] ^ t[l - 16]) << 1 | r >>> 31;
      t[l] = r;
      r = (i << 5 | i >>> 27) + (a ^ o & (s ^ a)) + c + 1518500249 + r;
      c = a;
      a = s;
      s = (o << 30 | o >>> 2) >>> 0;
      o = i;
      i = r;
    }
    for (; l < 32; ++l) {
      r = (r = t[l - 3] ^ t[l - 8] ^ t[l - 14] ^ t[l - 16]) << 1 | r >>> 31;
      t[l] = r;
      r = (i << 5 | i >>> 27) + (o ^ s ^ a) + c + 1859775393 + r;
      c = a;
      a = s;
      s = (o << 30 | o >>> 2) >>> 0;
      o = i;
      i = r;
    }
    for (; l < 40; ++l) {
      r = (r = t[l - 6] ^ t[l - 16] ^ t[l - 28] ^ t[l - 32]) << 2 | r >>> 30;
      t[l] = r;
      r = (i << 5 | i >>> 27) + (o ^ s ^ a) + c + 1859775393 + r;
      c = a;
      a = s;
      s = (o << 30 | o >>> 2) >>> 0;
      o = i;
      i = r;
    }
    for (; l < 60; ++l) {
      r = (r = t[l - 6] ^ t[l - 16] ^ t[l - 28] ^ t[l - 32]) << 2 | r >>> 30;
      t[l] = r;
      r = (i << 5 | i >>> 27) + (o & s | a & (o ^ s)) + c + 2400959708 + r;
      c = a;
      a = s;
      s = (o << 30 | o >>> 2) >>> 0;
      o = i;
      i = r;
    }
    for (; l < 80; ++l) {
      r = (r = t[l - 6] ^ t[l - 16] ^ t[l - 28] ^ t[l - 32]) << 2 | r >>> 30;
      t[l] = r;
      r = (i << 5 | i >>> 27) + (o ^ s ^ a) + c + 3395469782 + r;
      c = a;
      a = s;
      s = (o << 30 | o >>> 2) >>> 0;
      o = i;
      i = r;
    }
    e.h0 = e.h0 + i | 0;
    e.h1 = e.h1 + o | 0;
    e.h2 = e.h2 + s | 0;
    e.h3 = e.h3 + a | 0;
    e.h4 = e.h4 + c | 0;
    u -= 64;
  }
}