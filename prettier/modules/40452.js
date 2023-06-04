var r;
r = require(78249);
require(98269);
require(68214);
require(90888);
require(75109);
(function () {
  var e = r;
  var t = e.lib.BlockCipher;
  var n = e.algo;
  var i = [];
  var o = [];
  var s = [];
  var a = [];
  var c = [];
  var l = [];
  var u = [];
  var p = [];
  var d = [];
  var h = [];
  !function () {
    for (e = [], t = 0, void 0; t < 256; t++) {
      var e;
      var t;
      e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
    }
    var n = 0;
    var r = 0;
    for (t = 0; t < 256; t++) {
      var f = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4;
      f = f >>> 8 ^ 255 & f ^ 99;
      i[n] = f;
      o[f] = n;
      var m = e[n];
      var g = e[m];
      var y = e[g];
      var _ = 257 * e[f] ^ 16843008 * f;
      s[n] = _ << 24 | _ >>> 8;
      a[n] = _ << 16 | _ >>> 16;
      c[n] = _ << 8 | _ >>> 24;
      l[n] = _;
      _ = 16843009 * y ^ 65537 * g ^ 257 * m ^ 16843008 * n;
      u[f] = _ << 24 | _ >>> 8;
      p[f] = _ << 16 | _ >>> 16;
      d[f] = _ << 8 | _ >>> 24;
      h[f] = _;
      if (n) {
        n = m ^ e[e[e[y ^ m]]];
        r ^= e[e[r]];
      } else {
        n = r = 1;
      }
    }
  }();
  var f = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
  var m = n.AES = t.extend({
    _doReset: function () {
      if (!this._nRounds || this._keyPriorReset !== this._key) {
        for (e = this._keyPriorReset = this._key, t = e.words, n = e.sigBytes / 4, r = 4 * ((this._nRounds = n + 6) + 1), o = this._keySchedule = [], s = 0, void 0; s < r; s++) {
          var e;
          var t;
          var n;
          var r;
          var o;
          var s;
          if (s < n) {
            o[s] = t[s];
          } else {
            l = o[s - 1];
            if (s % n) {
              if (n > 6 && s % n == 4) {
                l = i[l >>> 24] << 24 | i[l >>> 16 & 255] << 16 | i[l >>> 8 & 255] << 8 | i[255 & l];
              }
            } else {
              l = i[(l = l << 8 | l >>> 24) >>> 24] << 24 | i[l >>> 16 & 255] << 16 | i[l >>> 8 & 255] << 8 | i[255 & l];
              l ^= f[s / n | 0] << 24;
            }
            o[s] = o[s - n] ^ l;
          }
        }
        for (a = this._invKeySchedule = [], c = 0, void 0; c < r; c++) {
          var a;
          var c;
          s = r - c;
          if (c % 4) var l = o[s];else l = o[s - 4];
          a[c] = c < 4 || s <= 4 ? l : u[i[l >>> 24]] ^ p[i[l >>> 16 & 255]] ^ d[i[l >>> 8 & 255]] ^ h[i[255 & l]];
        }
      }
    },
    encryptBlock: function (e, t) {
      this._doCryptBlock(e, t, this._keySchedule, s, a, c, l, i);
    },
    decryptBlock: function (e, t) {
      var n = e[t + 1];
      e[t + 1] = e[t + 3];
      e[t + 3] = n;
      this._doCryptBlock(e, t, this._invKeySchedule, u, p, d, h, o);
      n = e[t + 1];
      e[t + 1] = e[t + 3];
      e[t + 3] = n;
    },
    _doCryptBlock: function (e, t, n, r, i, o, s, a) {
      for (c = this._nRounds, l = e[t] ^ n[0], u = e[t + 1] ^ n[1], p = e[t + 2] ^ n[2], d = e[t + 3] ^ n[3], h = 4, f = 1, void 0; f < c; f++) {
        var c;
        var l;
        var u;
        var p;
        var d;
        var h;
        var f;
        var m = r[l >>> 24] ^ i[u >>> 16 & 255] ^ o[p >>> 8 & 255] ^ s[255 & d] ^ n[h++];
        var g = r[u >>> 24] ^ i[p >>> 16 & 255] ^ o[d >>> 8 & 255] ^ s[255 & l] ^ n[h++];
        var y = r[p >>> 24] ^ i[d >>> 16 & 255] ^ o[l >>> 8 & 255] ^ s[255 & u] ^ n[h++];
        var _ = r[d >>> 24] ^ i[l >>> 16 & 255] ^ o[u >>> 8 & 255] ^ s[255 & p] ^ n[h++];
        l = m;
        u = g;
        p = y;
        d = _;
      }
      m = (a[l >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[p >>> 8 & 255] << 8 | a[255 & d]) ^ n[h++];
      g = (a[u >>> 24] << 24 | a[p >>> 16 & 255] << 16 | a[d >>> 8 & 255] << 8 | a[255 & l]) ^ n[h++];
      y = (a[p >>> 24] << 24 | a[d >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[255 & u]) ^ n[h++];
      _ = (a[d >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[255 & p]) ^ n[h++];
      e[t] = m;
      e[t + 1] = g;
      e[t + 2] = y;
      e[t + 3] = _;
    },
    keySize: 8
  });
  e.AES = t._createHelper(m);
})();
module.exports = r.AES;