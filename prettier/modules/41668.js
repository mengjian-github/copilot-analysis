var r = require(3832);
require(28991);
require(97116);
var i = module.exports = r.sha256 = r.sha256 || {};
r.md.sha256 = r.md.algorithms.sha256 = i;
i.create = function () {
  if (s) {
    o = String.fromCharCode(128);
    o += r.util.fillString(String.fromCharCode(0), 64);
    a = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
    s = !0;
  }
  var e = null;
  var t = r.util.createBuffer();
  var n = new Array(64);
  var i = {
    algorithm: "sha256",
    blockLength: 64,
    digestLength: 32,
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
        h0: 1779033703,
        h1: 3144134277,
        h2: 1013904242,
        h3: 2773480762,
        h4: 1359893119,
        h5: 2600822924,
        h6: 528734635,
        h7: 1541459225
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
    for (var l = i.fullMessageLength.length - 1; l >= 0; --l) {
      i.fullMessageLength[l] += a[1];
      a[1] = a[0] + (i.fullMessageLength[l] / 4294967296 >>> 0);
      i.fullMessageLength[l] = i.fullMessageLength[l] >>> 0;
      a[0] = a[1] / 4294967296 >>> 0;
    }
    t.putBytes(o);
    c(e, n, t);
    if (t.read > 2048 || 0 === t.length()) {
      t.compact();
    }
    return i;
  };
  i.digest = function () {
    var s = r.util.createBuffer();
    s.putBytes(t.bytes());
    var a;
    var l = i.fullMessageLength[i.fullMessageLength.length - 1] + i.messageLengthSize & i.blockLength - 1;
    s.putBytes(o.substr(0, i.blockLength - l));
    for (u = 8 * i.fullMessageLength[0], p = 0, void 0; p < i.fullMessageLength.length - 1; ++p) {
      var u;
      var p;
      u += (a = 8 * i.fullMessageLength[p + 1]) / 4294967296 >>> 0;
      s.putInt32(u >>> 0);
      u = a >>> 0;
    }
    s.putInt32(u);
    var d = {
      h0: e.h0,
      h1: e.h1,
      h2: e.h2,
      h3: e.h3,
      h4: e.h4,
      h5: e.h5,
      h6: e.h6,
      h7: e.h7
    };
    c(d, n, s);
    var h = r.util.createBuffer();
    h.putInt32(d.h0);
    h.putInt32(d.h1);
    h.putInt32(d.h2);
    h.putInt32(d.h3);
    h.putInt32(d.h4);
    h.putInt32(d.h5);
    h.putInt32(d.h6);
    h.putInt32(d.h7);
    return h;
  };
  return i;
};
var o = null;
var s = !1;
var a = null;
function c(e, t, n) {
  for (y = n.length(), void 0; y >= 64;) {
    var r;
    var i;
    var o;
    var s;
    var c;
    var l;
    var u;
    var p;
    var d;
    var h;
    var f;
    var m;
    var g;
    var y;
    for (c = 0; c < 16; ++c) t[c] = n.getInt32();
    for (; c < 64; ++c) {
      r = ((r = t[c - 2]) >>> 17 | r << 15) ^ (r >>> 19 | r << 13) ^ r >>> 10;
      i = ((i = t[c - 15]) >>> 7 | i << 25) ^ (i >>> 18 | i << 14) ^ i >>> 3;
      t[c] = r + t[c - 7] + i + t[c - 16] | 0;
    }
    for (l = e.h0, u = e.h1, p = e.h2, d = e.h3, h = e.h4, f = e.h5, m = e.h6, g = e.h7, c = 0; c < 64; ++c) {
      o = (l >>> 2 | l << 30) ^ (l >>> 13 | l << 19) ^ (l >>> 22 | l << 10);
      s = l & u | p & (l ^ u);
      r = g + ((h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7)) + (m ^ h & (f ^ m)) + a[c] + t[c];
      g = m;
      m = f;
      f = h;
      h = d + r >>> 0;
      d = p;
      p = u;
      u = l;
      l = r + (i = o + s) >>> 0;
    }
    e.h0 = e.h0 + l | 0;
    e.h1 = e.h1 + u | 0;
    e.h2 = e.h2 + p | 0;
    e.h3 = e.h3 + d | 0;
    e.h4 = e.h4 + h | 0;
    e.h5 = e.h5 + f | 0;
    e.h6 = e.h6 + m | 0;
    e.h7 = e.h7 + g | 0;
    y -= 64;
  }
}