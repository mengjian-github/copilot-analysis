var r;
r = require(78249);
(function (e) {
  var t = r;
  var n = t.lib;
  var i = n.WordArray;
  var o = n.Hasher;
  var s = t.algo;
  var a = [];
  !function () {
    for (var t = 0; t < 64; t++) a[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0;
  }();
  var c = s.MD5 = o.extend({
    _doReset: function () {
      this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878]);
    },
    _doProcessBlock: function (e, t) {
      for (var n = 0; n < 16; n++) {
        var r = t + n;
        var i = e[r];
        e[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
      }
      var o = this._hash.words;
      var s = e[t + 0];
      var c = e[t + 1];
      var h = e[t + 2];
      var f = e[t + 3];
      var m = e[t + 4];
      var g = e[t + 5];
      var y = e[t + 6];
      var _ = e[t + 7];
      var v = e[t + 8];
      var b = e[t + 9];
      var E = e[t + 10];
      var w = e[t + 11];
      var T = e[t + 12];
      var S = e[t + 13];
      var x = e[t + 14];
      var C = e[t + 15];
      var I = o[0];
      var A = o[1];
      var k = o[2];
      var P = o[3];
      I = l(I, A, k, P, s, 7, a[0]);
      P = l(P, I, A, k, c, 12, a[1]);
      k = l(k, P, I, A, h, 17, a[2]);
      A = l(A, k, P, I, f, 22, a[3]);
      I = l(I, A, k, P, m, 7, a[4]);
      P = l(P, I, A, k, g, 12, a[5]);
      k = l(k, P, I, A, y, 17, a[6]);
      A = l(A, k, P, I, _, 22, a[7]);
      I = l(I, A, k, P, v, 7, a[8]);
      P = l(P, I, A, k, b, 12, a[9]);
      k = l(k, P, I, A, E, 17, a[10]);
      A = l(A, k, P, I, w, 22, a[11]);
      I = l(I, A, k, P, T, 7, a[12]);
      P = l(P, I, A, k, S, 12, a[13]);
      k = l(k, P, I, A, x, 17, a[14]);
      I = u(I, A = l(A, k, P, I, C, 22, a[15]), k, P, c, 5, a[16]);
      P = u(P, I, A, k, y, 9, a[17]);
      k = u(k, P, I, A, w, 14, a[18]);
      A = u(A, k, P, I, s, 20, a[19]);
      I = u(I, A, k, P, g, 5, a[20]);
      P = u(P, I, A, k, E, 9, a[21]);
      k = u(k, P, I, A, C, 14, a[22]);
      A = u(A, k, P, I, m, 20, a[23]);
      I = u(I, A, k, P, b, 5, a[24]);
      P = u(P, I, A, k, x, 9, a[25]);
      k = u(k, P, I, A, f, 14, a[26]);
      A = u(A, k, P, I, v, 20, a[27]);
      I = u(I, A, k, P, S, 5, a[28]);
      P = u(P, I, A, k, h, 9, a[29]);
      k = u(k, P, I, A, _, 14, a[30]);
      I = p(I, A = u(A, k, P, I, T, 20, a[31]), k, P, g, 4, a[32]);
      P = p(P, I, A, k, v, 11, a[33]);
      k = p(k, P, I, A, w, 16, a[34]);
      A = p(A, k, P, I, x, 23, a[35]);
      I = p(I, A, k, P, c, 4, a[36]);
      P = p(P, I, A, k, m, 11, a[37]);
      k = p(k, P, I, A, _, 16, a[38]);
      A = p(A, k, P, I, E, 23, a[39]);
      I = p(I, A, k, P, S, 4, a[40]);
      P = p(P, I, A, k, s, 11, a[41]);
      k = p(k, P, I, A, f, 16, a[42]);
      A = p(A, k, P, I, y, 23, a[43]);
      I = p(I, A, k, P, b, 4, a[44]);
      P = p(P, I, A, k, T, 11, a[45]);
      k = p(k, P, I, A, C, 16, a[46]);
      I = d(I, A = p(A, k, P, I, h, 23, a[47]), k, P, s, 6, a[48]);
      P = d(P, I, A, k, _, 10, a[49]);
      k = d(k, P, I, A, x, 15, a[50]);
      A = d(A, k, P, I, g, 21, a[51]);
      I = d(I, A, k, P, T, 6, a[52]);
      P = d(P, I, A, k, f, 10, a[53]);
      k = d(k, P, I, A, E, 15, a[54]);
      A = d(A, k, P, I, c, 21, a[55]);
      I = d(I, A, k, P, v, 6, a[56]);
      P = d(P, I, A, k, C, 10, a[57]);
      k = d(k, P, I, A, y, 15, a[58]);
      A = d(A, k, P, I, S, 21, a[59]);
      I = d(I, A, k, P, m, 6, a[60]);
      P = d(P, I, A, k, w, 10, a[61]);
      k = d(k, P, I, A, h, 15, a[62]);
      A = d(A, k, P, I, b, 21, a[63]);
      o[0] = o[0] + I | 0;
      o[1] = o[1] + A | 0;
      o[2] = o[2] + k | 0;
      o[3] = o[3] + P | 0;
    },
    _doFinalize: function () {
      var t = this._data;
      var n = t.words;
      var r = 8 * this._nDataBytes;
      var i = 8 * t.sigBytes;
      n[i >>> 5] |= 128 << 24 - i % 32;
      var o = e.floor(r / 4294967296);
      var s = r;
      n[15 + (i + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8);
      n[14 + (i + 64 >>> 9 << 4)] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
      t.sigBytes = 4 * (n.length + 1);
      this._process();
      for (a = this._hash, c = a.words, l = 0, void 0; l < 4; l++) {
        var a;
        var c;
        var l;
        var u = c[l];
        c[l] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8);
      }
      return a;
    },
    clone: function () {
      var e = o.clone.call(this);
      e._hash = this._hash.clone();
      return e;
    }
  });
  function l(e, t, n, r, i, o, s) {
    var a = e + (t & n | ~t & r) + i + s;
    return (a << o | a >>> 32 - o) + t;
  }
  function u(e, t, n, r, i, o, s) {
    var a = e + (t & r | n & ~r) + i + s;
    return (a << o | a >>> 32 - o) + t;
  }
  function p(e, t, n, r, i, o, s) {
    var a = e + (t ^ n ^ r) + i + s;
    return (a << o | a >>> 32 - o) + t;
  }
  function d(e, t, n, r, i, o, s) {
    var a = e + (n ^ (t | ~r)) + i + s;
    return (a << o | a >>> 32 - o) + t;
  }
  t.MD5 = o._createHelper(c);
  t.HmacMD5 = o._createHmacHelper(c);
})(Math);
module.exports = r.MD5;