var r = require(3832);
require(15764);
require(49563);
require(63219);
require(97116);
var i = require(59205);
var o = i.publicKeyValidator;
var s = i.privateKeyValidator;
if (void 0 === a) var a = r.jsbn.BigInteger;
var c = r.util.ByteBuffer;
var l = "undefined" == typeof Buffer ? Uint8Array : Buffer;
r.pki = r.pki || {};
module.exports = r.pki.ed25519 = r.ed25519 = r.ed25519 || {};
var u = r.ed25519;
function p(e) {
  var t = e.message;
  if (t instanceof Uint8Array || t instanceof l) return t;
  var n = e.encoding;
  if (void 0 === t) {
    if (!e.md) throw new TypeError('"options.message" or "options.md" not specified.');
    t = e.md.digest().getBytes();
    n = "binary";
  }
  if ("string" == typeof t && !n) throw new TypeError('"options.encoding" must be "binary" or "utf8".');
  if ("string" == typeof t) {
    if ("undefined" != typeof Buffer) return Buffer.from(t, n);
    t = new c(t, n);
  } else if (!(t instanceof c)) throw new TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.');
  for (r = new l(t.length()), i = 0, void 0; i < r.length; ++i) {
    var r;
    var i;
    r[i] = t.at(i);
  }
  return r;
}
u.constants = {};
u.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
u.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
u.constants.SEED_BYTE_LENGTH = 32;
u.constants.SIGN_BYTE_LENGTH = 64;
u.constants.HASH_BYTE_LENGTH = 64;
u.generateKeyPair = function (e) {
  var t = (e = e || {}).seed;
  if (void 0 === t) t = r.random.getBytesSync(u.constants.SEED_BYTE_LENGTH);else if ("string" == typeof t) {
    if (t.length !== u.constants.SEED_BYTE_LENGTH) throw new TypeError('"seed" must be ' + u.constants.SEED_BYTE_LENGTH + " bytes in length.");
  } else if (!(t instanceof Uint8Array)) throw new TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
  t = p({
    message: t,
    encoding: "binary"
  });
  for (n = new l(u.constants.PUBLIC_KEY_BYTE_LENGTH), i = new l(u.constants.PRIVATE_KEY_BYTE_LENGTH), o = 0, void 0; o < 32; ++o) {
    var n;
    var i;
    var o;
    i[o] = t[o];
  }
  (function (e, t) {
    var n;
    var r = [L(), L(), L(), L()];
    var i = b(t, 32);
    for (i[0] &= 248, i[31] &= 127, i[31] |= 64, N(r, i), x(e, r), n = 0; n < 32; ++n) t[n + 32] = e[n];
  })(n, i);
  return {
    publicKey: n,
    privateKey: i
  };
};
u.privateKeyFromAsn1 = function (e) {
  var t = {};
  var n = [];
  if (!r.asn1.validate(e, s, t, n)) {
    var i = new Error("Invalid Key.");
    throw i.errors = n, i;
  }
  var o = r.asn1.derToOid(t.privateKeyOid);
  var a = r.oids.EdDSA25519;
  if (o !== a) throw new Error('Invalid OID "' + o + '"; OID must be "' + a + '".');
  var c = t.privateKey;
  return {
    privateKeyBytes: p({
      message: r.asn1.fromDer(c).value,
      encoding: "binary"
    })
  };
};
u.publicKeyFromAsn1 = function (e) {
  var t = {};
  var n = [];
  if (!r.asn1.validate(e, o, t, n)) {
    var i = new Error("Invalid Key.");
    throw i.errors = n, i;
  }
  var s = r.asn1.derToOid(t.publicKeyOid);
  var a = r.oids.EdDSA25519;
  if (s !== a) throw new Error('Invalid OID "' + s + '"; OID must be "' + a + '".');
  var c = t.ed25519PublicKey;
  if (c.length !== u.constants.PUBLIC_KEY_BYTE_LENGTH) throw new Error("Key length is invalid.");
  return p({
    message: c,
    encoding: "binary"
  });
};
u.publicKeyFromPrivateKey = function (e) {
  var t = p({
    message: (e = e || {}).privateKey,
    encoding: "binary"
  });
  if (t.length !== u.constants.PRIVATE_KEY_BYTE_LENGTH) throw new TypeError('"options.privateKey" must have a byte length of ' + u.constants.PRIVATE_KEY_BYTE_LENGTH);
  for (n = new l(u.constants.PUBLIC_KEY_BYTE_LENGTH), r = 0, void 0; r < n.length; ++r) {
    var n;
    var r;
    n[r] = t[32 + r];
  }
  return n;
};
u.sign = function (e) {
  var t = p(e = e || {});
  var n = p({
    message: e.privateKey,
    encoding: "binary"
  });
  if (n.length === u.constants.SEED_BYTE_LENGTH) n = u.generateKeyPair({
    seed: n
  }).privateKey;else if (n.length !== u.constants.PRIVATE_KEY_BYTE_LENGTH) throw new TypeError('"options.privateKey" must have a byte length of ' + u.constants.SEED_BYTE_LENGTH + " or " + u.constants.PRIVATE_KEY_BYTE_LENGTH);
  var r = new l(u.constants.SIGN_BYTE_LENGTH + t.length);
  !function (e, t, n, r) {
    var i;
    var o;
    var s = new Float64Array(64);
    var a = [L(), L(), L(), L()];
    var c = b(r, 32);
    c[0] &= 248;
    c[31] &= 127;
    c[31] |= 64;
    for (i = 0; i < n; ++i) e[64 + i] = t[i];
    for (i = 0; i < 32; ++i) e[32 + i] = c[32 + i];
    var l = b(e.subarray(32), n + 32);
    for (w(l), N(a, l), x(e, a), i = 32; i < 64; ++i) e[i] = r[i];
    var u = b(e, n + 64);
    for (w(u), i = 32; i < 64; ++i) s[i] = 0;
    for (i = 0; i < 32; ++i) s[i] = l[i];
    for (i = 0; i < 32; ++i) for (o = 0; o < 32; o++) s[i + o] += u[i] * c[o];
    E(e.subarray(32), s);
  }(r, t, t.length, n);
  for (i = new l(u.constants.SIGN_BYTE_LENGTH), o = 0, void 0; o < i.length; ++o) {
    var i;
    var o;
    i[o] = r[o];
  }
  return i;
};
u.verify = function (e) {
  var t = p(e = e || {});
  if (void 0 === e.signature) throw new TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.');
  var n = p({
    message: e.signature,
    encoding: "binary"
  });
  if (n.length !== u.constants.SIGN_BYTE_LENGTH) throw new TypeError('"options.signature" must have a byte length of ' + u.constants.SIGN_BYTE_LENGTH);
  var r = p({
    message: e.publicKey,
    encoding: "binary"
  });
  if (r.length !== u.constants.PUBLIC_KEY_BYTE_LENGTH) throw new TypeError('"options.publicKey" must have a byte length of ' + u.constants.PUBLIC_KEY_BYTE_LENGTH);
  var i;
  var o = new l(u.constants.SIGN_BYTE_LENGTH + t.length);
  var s = new l(u.constants.SIGN_BYTE_LENGTH + t.length);
  for (i = 0; i < u.constants.SIGN_BYTE_LENGTH; ++i) o[i] = n[i];
  for (i = 0; i < t.length; ++i) o[i + u.constants.SIGN_BYTE_LENGTH] = t[i];
  return function (e, t, n, r) {
    var i;
    var o = new l(32);
    var s = [L(), L(), L(), L()];
    var a = [L(), L(), L(), L()];
    if (n < 64) return -1;
    if (function (e, t) {
      var n = L();
      var r = L();
      var i = L();
      var o = L();
      var s = L();
      var a = L();
      var c = L();
      O(e[2], h);
      (function (e, t) {
        var n;
        for (n = 0; n < 16; ++n) e[n] = t[2 * n] + (t[2 * n + 1] << 8);
        e[15] &= 32767;
      })(e[1], t);
      F(i, e[1]);
      j(o, i, f);
      B(i, i, e[2]);
      D(o, e[2], o);
      F(s, o);
      F(a, s);
      j(c, a, s);
      j(n, c, i);
      j(n, n, o);
      (function (e, t) {
        var n;
        var r = L();
        for (n = 0; n < 16; ++n) r[n] = t[n];
        for (n = 250; n >= 0; --n) {
          F(r, r);
          if (1 !== n) {
            j(r, r, t);
          }
        }
        for (n = 0; n < 16; ++n) e[n] = r[n];
      })(n, n);
      j(n, n, i);
      j(n, n, o);
      j(n, n, o);
      j(e[0], n, o);
      F(r, e[0]);
      j(r, r, o);
      if (I(r, i)) {
        j(e[0], e[0], v);
      }
      F(r, e[0]);
      j(r, r, o);
      return I(r, i) ? -1 : (k(e[0]) === t[31] >> 7 && B(e[0], d, e[0]), j(e[3], e[0], e[1]), 0);
    }(a, r)) return -1;
    for (i = 0; i < n; ++i) e[i] = t[i];
    for (i = 0; i < 32; ++i) e[i + 32] = r[i];
    var c = b(e, n);
    w(c);
    P(s, a, c);
    N(a, t.subarray(32));
    T(s, a);
    x(o, s);
    n -= 64;
    if (A(t, 0, o, 0)) {
      for (i = 0; i < n; ++i) e[i] = 0;
      return -1;
    }
    for (i = 0; i < n; ++i) e[i] = t[i + 64];
    return n;
  }(s, o, o.length, r) >= 0;
};
var d = L();
var h = L([1]);
var f = L([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]);
var m = L([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]);
var g = L([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]);
var y = L([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]);
var _ = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
var v = L([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
function b(e, t) {
  var n = r.md.sha512.create();
  var i = new c(e);
  n.update(i.getBytes(t), "binary");
  var o = n.digest().getBytes();
  if ("undefined" != typeof Buffer) return Buffer.from(o, "binary");
  for (s = new l(u.constants.HASH_BYTE_LENGTH), a = 0, void 0; a < 64; ++a) {
    var s;
    var a;
    s[a] = o.charCodeAt(a);
  }
  return s;
}
function E(e, t) {
  var n;
  var r;
  var i;
  var o;
  for (r = 63; r >= 32; --r) {
    for (n = 0, i = r - 32, o = r - 12; i < o; ++i) {
      t[i] += n - 16 * t[r] * _[i - (r - 32)];
      n = t[i] + 128 >> 8;
      t[i] -= 256 * n;
    }
    t[i] += n;
    t[r] = 0;
  }
  for (n = 0, i = 0; i < 32; ++i) {
    t[i] += n - (t[31] >> 4) * _[i];
    n = t[i] >> 8;
    t[i] &= 255;
  }
  for (i = 0; i < 32; ++i) t[i] -= n * _[i];
  for (r = 0; r < 32; ++r) {
    t[r + 1] += t[r] >> 8;
    e[r] = 255 & t[r];
  }
}
function w(e) {
  for (t = new Float64Array(64), n = 0, void 0; n < 64; ++n) {
    var t;
    var n;
    t[n] = e[n];
    e[n] = 0;
  }
  E(e, t);
}
function T(e, t) {
  var n = L();
  var r = L();
  var i = L();
  var o = L();
  var s = L();
  var a = L();
  var c = L();
  var l = L();
  var u = L();
  B(n, e[1], e[0]);
  B(u, t[1], t[0]);
  j(n, n, u);
  D(r, e[0], e[1]);
  D(u, t[0], t[1]);
  j(r, r, u);
  j(i, e[3], t[3]);
  j(i, i, m);
  j(o, e[2], t[2]);
  D(o, o, o);
  B(s, r, n);
  B(a, o, i);
  D(c, o, i);
  D(l, r, n);
  j(e[0], s, a);
  j(e[1], l, c);
  j(e[2], c, a);
  j(e[3], s, l);
}
function S(e, t, n) {
  for (var r = 0; r < 4; ++r) M(e[r], t[r], n);
}
function x(e, t) {
  var n = L();
  var r = L();
  var i = L();
  !function (e, t) {
    var n;
    var r = L();
    for (n = 0; n < 16; ++n) r[n] = t[n];
    for (n = 253; n >= 0; --n) {
      F(r, r);
      if (2 !== n && 4 !== n) {
        j(r, r, t);
      }
    }
    for (n = 0; n < 16; ++n) e[n] = r[n];
  }(i, t[2]);
  j(n, t[0], i);
  j(r, t[1], i);
  C(e, r);
  e[31] ^= k(n) << 7;
}
function C(e, t) {
  var n;
  var r;
  var i;
  var o = L();
  var s = L();
  for (n = 0; n < 16; ++n) s[n] = t[n];
  for (R(s), R(s), R(s), r = 0; r < 2; ++r) {
    for (o[0] = s[0] - 65517, n = 1; n < 15; ++n) {
      o[n] = s[n] - 65535 - (o[n - 1] >> 16 & 1);
      o[n - 1] &= 65535;
    }
    o[15] = s[15] - 32767 - (o[14] >> 16 & 1);
    i = o[15] >> 16 & 1;
    o[14] &= 65535;
    M(s, o, 1 - i);
  }
  for (n = 0; n < 16; n++) {
    e[2 * n] = 255 & s[n];
    e[2 * n + 1] = s[n] >> 8;
  }
}
function I(e, t) {
  var n = new l(32);
  var r = new l(32);
  C(n, e);
  C(r, t);
  return A(n, 0, r, 0);
}
function A(e, t, n, r) {
  return function (e, t, n, r, i) {
    var o;
    var s = 0;
    for (o = 0; o < 32; ++o) s |= e[t + o] ^ n[r + o];
    return (1 & s - 1 >>> 8) - 1;
  }(e, t, n, r);
}
function k(e) {
  var t = new l(32);
  C(t, e);
  return 1 & t[0];
}
function P(e, t, n) {
  var r;
  var i;
  for (O(e[0], d), O(e[1], h), O(e[2], h), O(e[3], d), i = 255; i >= 0; --i) {
    S(e, t, r = n[i / 8 | 0] >> (7 & i) & 1);
    T(t, e);
    T(e, e);
    S(e, t, r);
  }
}
function N(e, t) {
  var n = [L(), L(), L(), L()];
  O(n[0], g);
  O(n[1], y);
  O(n[2], h);
  j(n[3], g, y);
  P(e, n, t);
}
function O(e, t) {
  var n;
  for (n = 0; n < 16; n++) e[n] = 0 | t[n];
}
function R(e) {
  var t;
  var n;
  var r = 1;
  for (t = 0; t < 16; ++t) {
    n = e[t] + r + 65535;
    r = Math.floor(n / 65536);
    e[t] = n - 65536 * r;
  }
  e[0] += r - 1 + 37 * (r - 1);
}
function M(e, t, n) {
  for (i = ~(n - 1), o = 0, void 0; o < 16; ++o) {
    var r;
    var i;
    var o;
    r = i & (e[o] ^ t[o]);
    e[o] ^= r;
    t[o] ^= r;
  }
}
function L(e) {
  var t;
  var n = new Float64Array(16);
  if (e) for (t = 0; t < e.length; ++t) n[t] = e[t];
  return n;
}
function D(e, t, n) {
  for (var r = 0; r < 16; ++r) e[r] = t[r] + n[r];
}
function B(e, t, n) {
  for (var r = 0; r < 16; ++r) e[r] = t[r] - n[r];
}
function F(e, t) {
  j(e, t, t);
}
function j(e, t, n) {
  var r;
  var i;
  var o = 0;
  var s = 0;
  var a = 0;
  var c = 0;
  var l = 0;
  var u = 0;
  var p = 0;
  var d = 0;
  var h = 0;
  var f = 0;
  var m = 0;
  var g = 0;
  var y = 0;
  var _ = 0;
  var v = 0;
  var b = 0;
  var E = 0;
  var w = 0;
  var T = 0;
  var S = 0;
  var x = 0;
  var C = 0;
  var I = 0;
  var A = 0;
  var k = 0;
  var P = 0;
  var N = 0;
  var O = 0;
  var R = 0;
  var M = 0;
  var L = 0;
  var D = n[0];
  var B = n[1];
  var F = n[2];
  var j = n[3];
  var U = n[4];
  var $ = n[5];
  var V = n[6];
  var H = n[7];
  var q = n[8];
  var z = n[9];
  var K = n[10];
  var G = n[11];
  var W = n[12];
  var Q = n[13];
  var Z = n[14];
  var X = n[15];
  o += (r = t[0]) * D;
  s += r * B;
  a += r * F;
  c += r * j;
  l += r * U;
  u += r * $;
  p += r * V;
  d += r * H;
  h += r * q;
  f += r * z;
  m += r * K;
  g += r * G;
  y += r * W;
  _ += r * Q;
  v += r * Z;
  b += r * X;
  s += (r = t[1]) * D;
  a += r * B;
  c += r * F;
  l += r * j;
  u += r * U;
  p += r * $;
  d += r * V;
  h += r * H;
  f += r * q;
  m += r * z;
  g += r * K;
  y += r * G;
  _ += r * W;
  v += r * Q;
  b += r * Z;
  E += r * X;
  a += (r = t[2]) * D;
  c += r * B;
  l += r * F;
  u += r * j;
  p += r * U;
  d += r * $;
  h += r * V;
  f += r * H;
  m += r * q;
  g += r * z;
  y += r * K;
  _ += r * G;
  v += r * W;
  b += r * Q;
  E += r * Z;
  w += r * X;
  c += (r = t[3]) * D;
  l += r * B;
  u += r * F;
  p += r * j;
  d += r * U;
  h += r * $;
  f += r * V;
  m += r * H;
  g += r * q;
  y += r * z;
  _ += r * K;
  v += r * G;
  b += r * W;
  E += r * Q;
  w += r * Z;
  T += r * X;
  l += (r = t[4]) * D;
  u += r * B;
  p += r * F;
  d += r * j;
  h += r * U;
  f += r * $;
  m += r * V;
  g += r * H;
  y += r * q;
  _ += r * z;
  v += r * K;
  b += r * G;
  E += r * W;
  w += r * Q;
  T += r * Z;
  S += r * X;
  u += (r = t[5]) * D;
  p += r * B;
  d += r * F;
  h += r * j;
  f += r * U;
  m += r * $;
  g += r * V;
  y += r * H;
  _ += r * q;
  v += r * z;
  b += r * K;
  E += r * G;
  w += r * W;
  T += r * Q;
  S += r * Z;
  x += r * X;
  p += (r = t[6]) * D;
  d += r * B;
  h += r * F;
  f += r * j;
  m += r * U;
  g += r * $;
  y += r * V;
  _ += r * H;
  v += r * q;
  b += r * z;
  E += r * K;
  w += r * G;
  T += r * W;
  S += r * Q;
  x += r * Z;
  C += r * X;
  d += (r = t[7]) * D;
  h += r * B;
  f += r * F;
  m += r * j;
  g += r * U;
  y += r * $;
  _ += r * V;
  v += r * H;
  b += r * q;
  E += r * z;
  w += r * K;
  T += r * G;
  S += r * W;
  x += r * Q;
  C += r * Z;
  I += r * X;
  h += (r = t[8]) * D;
  f += r * B;
  m += r * F;
  g += r * j;
  y += r * U;
  _ += r * $;
  v += r * V;
  b += r * H;
  E += r * q;
  w += r * z;
  T += r * K;
  S += r * G;
  x += r * W;
  C += r * Q;
  I += r * Z;
  A += r * X;
  f += (r = t[9]) * D;
  m += r * B;
  g += r * F;
  y += r * j;
  _ += r * U;
  v += r * $;
  b += r * V;
  E += r * H;
  w += r * q;
  T += r * z;
  S += r * K;
  x += r * G;
  C += r * W;
  I += r * Q;
  A += r * Z;
  k += r * X;
  m += (r = t[10]) * D;
  g += r * B;
  y += r * F;
  _ += r * j;
  v += r * U;
  b += r * $;
  E += r * V;
  w += r * H;
  T += r * q;
  S += r * z;
  x += r * K;
  C += r * G;
  I += r * W;
  A += r * Q;
  k += r * Z;
  P += r * X;
  g += (r = t[11]) * D;
  y += r * B;
  _ += r * F;
  v += r * j;
  b += r * U;
  E += r * $;
  w += r * V;
  T += r * H;
  S += r * q;
  x += r * z;
  C += r * K;
  I += r * G;
  A += r * W;
  k += r * Q;
  P += r * Z;
  N += r * X;
  y += (r = t[12]) * D;
  _ += r * B;
  v += r * F;
  b += r * j;
  E += r * U;
  w += r * $;
  T += r * V;
  S += r * H;
  x += r * q;
  C += r * z;
  I += r * K;
  A += r * G;
  k += r * W;
  P += r * Q;
  N += r * Z;
  O += r * X;
  _ += (r = t[13]) * D;
  v += r * B;
  b += r * F;
  E += r * j;
  w += r * U;
  T += r * $;
  S += r * V;
  x += r * H;
  C += r * q;
  I += r * z;
  A += r * K;
  k += r * G;
  P += r * W;
  N += r * Q;
  O += r * Z;
  R += r * X;
  v += (r = t[14]) * D;
  b += r * B;
  E += r * F;
  w += r * j;
  T += r * U;
  S += r * $;
  x += r * V;
  C += r * H;
  I += r * q;
  A += r * z;
  k += r * K;
  P += r * G;
  N += r * W;
  O += r * Q;
  R += r * Z;
  M += r * X;
  b += (r = t[15]) * D;
  s += 38 * (w += r * F);
  a += 38 * (T += r * j);
  c += 38 * (S += r * U);
  l += 38 * (x += r * $);
  u += 38 * (C += r * V);
  p += 38 * (I += r * H);
  d += 38 * (A += r * q);
  h += 38 * (k += r * z);
  f += 38 * (P += r * K);
  m += 38 * (N += r * G);
  g += 38 * (O += r * W);
  y += 38 * (R += r * Q);
  _ += 38 * (M += r * Z);
  v += 38 * (L += r * X);
  o = (r = (o += 38 * (E += r * B)) + (i = 1) + 65535) - 65536 * (i = Math.floor(r / 65536));
  s = (r = s + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  a = (r = a + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  c = (r = c + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  l = (r = l + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  u = (r = u + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  p = (r = p + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  d = (r = d + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  h = (r = h + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  f = (r = f + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  m = (r = m + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  g = (r = g + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  y = (r = y + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  _ = (r = _ + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  v = (r = v + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  b = (r = b + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  o = (r = (o += i - 1 + 37 * (i - 1)) + (i = 1) + 65535) - 65536 * (i = Math.floor(r / 65536));
  s = (r = s + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  a = (r = a + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  c = (r = c + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  l = (r = l + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  u = (r = u + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  p = (r = p + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  d = (r = d + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  h = (r = h + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  f = (r = f + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  m = (r = m + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  g = (r = g + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  y = (r = y + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  _ = (r = _ + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  v = (r = v + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  b = (r = b + i + 65535) - 65536 * (i = Math.floor(r / 65536));
  o += i - 1 + 37 * (i - 1);
  e[0] = o;
  e[1] = s;
  e[2] = a;
  e[3] = c;
  e[4] = l;
  e[5] = u;
  e[6] = p;
  e[7] = d;
  e[8] = h;
  e[9] = f;
  e[10] = m;
  e[11] = g;
  e[12] = y;
  e[13] = _;
  e[14] = v;
  e[15] = b;
}