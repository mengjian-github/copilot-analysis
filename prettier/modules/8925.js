var r = require(3832);
function i(e, t) {
  r.cipher.registerAlgorithm(e, function () {
    return new r.aes.Algorithm(e, t);
  });
}
require(85649);
require(61967);
require(97116);
module.exports = r.aes = r.aes || {};
r.aes.startEncrypting = function (e, t, n, r) {
  var i = f({
    key: e,
    output: n,
    decrypt: !1,
    mode: r
  });
  i.start(t);
  return i;
};
r.aes.createEncryptionCipher = function (e, t) {
  return f({
    key: e,
    output: null,
    decrypt: !1,
    mode: t
  });
};
r.aes.startDecrypting = function (e, t, n, r) {
  var i = f({
    key: e,
    output: n,
    decrypt: !0,
    mode: r
  });
  i.start(t);
  return i;
};
r.aes.createDecryptionCipher = function (e, t) {
  return f({
    key: e,
    output: null,
    decrypt: !0,
    mode: t
  });
};
r.aes.Algorithm = function (e, t) {
  if (u) {
    p();
  }
  var n = this;
  n.name = e;
  n.mode = new t({
    blockSize: 16,
    cipher: {
      encrypt: function (e, t) {
        return h(n._w, e, t, !1);
      },
      decrypt: function (e, t) {
        return h(n._w, e, t, !0);
      }
    }
  });
  n._init = !1;
};
r.aes.Algorithm.prototype.initialize = function (e) {
  if (!this._init) {
    var t;
    var n = e.key;
    if ("string" != typeof n || 16 !== n.length && 24 !== n.length && 32 !== n.length) {
      if (r.util.isArray(n) && (16 === n.length || 24 === n.length || 32 === n.length)) {
        t = n;
        n = r.util.createBuffer();
        for (var i = 0; i < t.length; ++i) n.putByte(t[i]);
      }
    } else n = r.util.createBuffer(n);
    if (!r.util.isArray(n)) {
      t = n;
      n = [];
      var o = t.length();
      if (16 === o || 24 === o || 32 === o) for (o >>>= 2, i = 0; i < o; ++i) n.push(t.getInt32());
    }
    if (!r.util.isArray(n) || 4 !== n.length && 6 !== n.length && 8 !== n.length) throw new Error("Invalid key parameter.");
    var s = this.mode.name;
    var a = -1 !== ["CFB", "OFB", "CTR", "GCM"].indexOf(s);
    this._w = d(n, e.decrypt && !a);
    this._init = !0;
  }
};
r.aes._expandKey = function (e, t) {
  if (u) {
    p();
  }
  return d(e, t);
};
r.aes._updateBlock = h;
i("AES-ECB", r.cipher.modes.ecb);
i("AES-CBC", r.cipher.modes.cbc);
i("AES-CFB", r.cipher.modes.cfb);
i("AES-OFB", r.cipher.modes.ofb);
i("AES-CTR", r.cipher.modes.ctr);
i("AES-GCM", r.cipher.modes.gcm);
var o;
var s;
var a;
var c;
var l;
var u = !1;
function p() {
  u = !0;
  a = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
  for (e = new Array(256), t = 0, void 0; t < 128; ++t) {
    var e;
    var t;
    e[t] = t << 1;
    e[t + 128] = t + 128 << 1 ^ 283;
  }
  for (o = new Array(256), s = new Array(256), c = new Array(4), l = new Array(4), t = 0; t < 4; ++t) {
    c[t] = new Array(256);
    l[t] = new Array(256);
  }
  var n;
  var r;
  var i;
  var p;
  var d;
  var h;
  var f;
  var m = 0;
  var g = 0;
  for (t = 0; t < 256; ++t) {
    p = (p = g ^ g << 1 ^ g << 2 ^ g << 3 ^ g << 4) >> 8 ^ 255 & p ^ 99;
    o[m] = p;
    s[p] = m;
    h = (d = e[p]) << 24 ^ p << 16 ^ p << 8 ^ p ^ d;
    f = ((n = e[m]) ^ (r = e[n]) ^ (i = e[r])) << 24 ^ (m ^ i) << 16 ^ (m ^ r ^ i) << 8 ^ m ^ n ^ i;
    for (var y = 0; y < 4; ++y) {
      c[y][m] = h;
      l[y][p] = f;
      h = h << 24 | h >>> 8;
      f = f << 24 | f >>> 8;
    }
    if (0 === m) {
      m = g = 1;
    } else {
      m = n ^ e[e[e[n ^ i]]];
      g ^= e[e[g]];
    }
  }
}
function d(e, t) {
  for (r = e.slice(0), i = 1, s = r.length, c = 4 * (s + 6 + 1), u = s, void 0; u < c; ++u) {
    var n;
    var r;
    var i;
    var s;
    var c;
    var u;
    n = r[u - 1];
    if (u % s == 0) {
      n = o[n >>> 16 & 255] << 24 ^ o[n >>> 8 & 255] << 16 ^ o[255 & n] << 8 ^ o[n >>> 24] ^ a[i] << 24;
      i++;
    } else {
      if (s > 6 && u % s == 4) {
        n = o[n >>> 24] << 24 ^ o[n >>> 16 & 255] << 16 ^ o[n >>> 8 & 255] << 8 ^ o[255 & n];
      }
    }
    r[u] = r[u - s] ^ n;
  }
  if (t) {
    for (d = l[0], h = l[1], f = l[2], m = l[3], g = r.slice(0), y = (u = 0, (c = r.length) - 4), void 0; u < c; u += 4, y -= 4) {
      var p;
      var d;
      var h;
      var f;
      var m;
      var g;
      var y;
      if (0 === u || u === c - 4) {
        g[u] = r[y];
        g[u + 1] = r[y + 3];
        g[u + 2] = r[y + 2];
        g[u + 3] = r[y + 1];
      } else for (var _ = 0; _ < 4; ++_) {
        p = r[y + _];
        g[u + (3 & -_)] = d[o[p >>> 24]] ^ h[o[p >>> 16 & 255]] ^ f[o[p >>> 8 & 255]] ^ m[o[255 & p]];
      }
    }
    r = g;
  }
  return r;
}
function h(e, t, n, r) {
  var i;
  var a;
  var u;
  var p;
  var d;
  var h;
  var f;
  var m;
  var g;
  var y;
  var _;
  var v;
  var b = e.length / 4 - 1;
  if (r) {
    i = l[0];
    a = l[1];
    u = l[2];
    p = l[3];
    d = s;
  } else {
    i = c[0];
    a = c[1];
    u = c[2];
    p = c[3];
    d = o;
  }
  h = t[0] ^ e[0];
  f = t[r ? 3 : 1] ^ e[1];
  m = t[2] ^ e[2];
  g = t[r ? 1 : 3] ^ e[3];
  for (E = 3, w = 1, void 0; w < b; ++w) {
    var E;
    var w;
    y = i[h >>> 24] ^ a[f >>> 16 & 255] ^ u[m >>> 8 & 255] ^ p[255 & g] ^ e[++E];
    _ = i[f >>> 24] ^ a[m >>> 16 & 255] ^ u[g >>> 8 & 255] ^ p[255 & h] ^ e[++E];
    v = i[m >>> 24] ^ a[g >>> 16 & 255] ^ u[h >>> 8 & 255] ^ p[255 & f] ^ e[++E];
    g = i[g >>> 24] ^ a[h >>> 16 & 255] ^ u[f >>> 8 & 255] ^ p[255 & m] ^ e[++E];
    h = y;
    f = _;
    m = v;
  }
  n[0] = d[h >>> 24] << 24 ^ d[f >>> 16 & 255] << 16 ^ d[m >>> 8 & 255] << 8 ^ d[255 & g] ^ e[++E];
  n[r ? 3 : 1] = d[f >>> 24] << 24 ^ d[m >>> 16 & 255] << 16 ^ d[g >>> 8 & 255] << 8 ^ d[255 & h] ^ e[++E];
  n[2] = d[m >>> 24] << 24 ^ d[g >>> 16 & 255] << 16 ^ d[h >>> 8 & 255] << 8 ^ d[255 & f] ^ e[++E];
  n[r ? 1 : 3] = d[g >>> 24] << 24 ^ d[h >>> 16 & 255] << 16 ^ d[f >>> 8 & 255] << 8 ^ d[255 & m] ^ e[++E];
}
function f(e) {
  var t;
  var n = "AES-" + ((e = e || {}).mode || "CBC").toUpperCase();
  var i = (t = e.decrypt ? r.cipher.createDecipher(n, e.key) : r.cipher.createCipher(n, e.key)).start;
  t.start = function (e, n) {
    var o = null;
    if (n instanceof r.util.ByteBuffer) {
      o = n;
      n = {};
    }
    (n = n || {}).output = o;
    n.iv = e;
    i.call(t, n);
  };
  return t;
}