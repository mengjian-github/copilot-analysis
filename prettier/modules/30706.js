var r;
r = require(78249);
(function (e) {
  var t = r;
  var n = t.lib;
  var i = n.WordArray;
  var o = n.Hasher;
  var s = t.algo;
  var a = i.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);
  var c = i.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);
  var l = i.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);
  var u = i.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);
  var p = i.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
  var d = i.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
  var h = s.RIPEMD160 = o.extend({
    _doReset: function () {
      this._hash = i.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
    },
    _doProcessBlock: function (e, t) {
      for (var n = 0; n < 16; n++) {
        var r = t + n;
        var i = e[r];
        e[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
      }
      var o;
      var s;
      var h;
      var b;
      var E;
      var w;
      var T;
      var S;
      var x;
      var C;
      var I;
      var A = this._hash.words;
      var k = p.words;
      var P = d.words;
      var N = a.words;
      var O = c.words;
      var R = l.words;
      var M = u.words;
      for (w = o = A[0], T = s = A[1], S = h = A[2], x = b = A[3], C = E = A[4], n = 0; n < 80; n += 1) {
        I = o + e[t + N[n]] | 0;
        I += n < 16 ? f(s, h, b) + k[0] : n < 32 ? m(s, h, b) + k[1] : n < 48 ? g(s, h, b) + k[2] : n < 64 ? y(s, h, b) + k[3] : _(s, h, b) + k[4];
        I = (I = v(I |= 0, R[n])) + E | 0;
        o = E;
        E = b;
        b = v(h, 10);
        h = s;
        s = I;
        I = w + e[t + O[n]] | 0;
        I += n < 16 ? _(T, S, x) + P[0] : n < 32 ? y(T, S, x) + P[1] : n < 48 ? g(T, S, x) + P[2] : n < 64 ? m(T, S, x) + P[3] : f(T, S, x) + P[4];
        I = (I = v(I |= 0, M[n])) + C | 0;
        w = C;
        C = x;
        x = v(S, 10);
        S = T;
        T = I;
      }
      I = A[1] + h + x | 0;
      A[1] = A[2] + b + C | 0;
      A[2] = A[3] + E + w | 0;
      A[3] = A[4] + o + T | 0;
      A[4] = A[0] + s + S | 0;
      A[0] = I;
    },
    _doFinalize: function () {
      var e = this._data;
      var t = e.words;
      var n = 8 * this._nDataBytes;
      var r = 8 * e.sigBytes;
      t[r >>> 5] |= 128 << 24 - r % 32;
      t[14 + (r + 64 >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8);
      e.sigBytes = 4 * (t.length + 1);
      this._process();
      for (i = this._hash, o = i.words, s = 0, void 0; s < 5; s++) {
        var i;
        var o;
        var s;
        var a = o[s];
        o[s] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8);
      }
      return i;
    },
    clone: function () {
      var e = o.clone.call(this);
      e._hash = this._hash.clone();
      return e;
    }
  });
  function f(e, t, n) {
    return e ^ t ^ n;
  }
  function m(e, t, n) {
    return e & t | ~e & n;
  }
  function g(e, t, n) {
    return (e | ~t) ^ n;
  }
  function y(e, t, n) {
    return e & n | t & ~n;
  }
  function _(e, t, n) {
    return e ^ (t | ~n);
  }
  function v(e, t) {
    return e << t | e >>> 32 - t;
  }
  t.RIPEMD160 = o._createHelper(h);
  t.HmacRIPEMD160 = o._createHmacHelper(h);
})(Math);
module.exports = r.RIPEMD160;