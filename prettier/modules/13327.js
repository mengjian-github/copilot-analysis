var r;
r = require(78249);
require(64938);
(function (e) {
  var t = r;
  var n = t.lib;
  var i = n.WordArray;
  var o = n.Hasher;
  var s = t.x64.Word;
  var a = t.algo;
  var c = [];
  var l = [];
  var u = [];
  !function () {
    for (e = 1, t = 0, n = 0, void 0; n < 24; n++) {
      var e;
      var t;
      var n;
      c[e + 5 * t] = (n + 1) * (n + 2) / 2 % 64;
      var r = (2 * e + 3 * t) % 5;
      e = t % 5;
      t = r;
    }
    for (e = 0; e < 5; e++) for (t = 0; t < 5; t++) l[e + 5 * t] = t + (2 * e + 3 * t) % 5 * 5;
    for (i = 1, o = 0, void 0; o < 24; o++) {
      var i;
      var o;
      for (a = 0, p = 0, d = 0, void 0; d < 7; d++) {
        var a;
        var p;
        var d;
        if (1 & i) {
          var h = (1 << d) - 1;
          if (h < 32) {
            p ^= 1 << h;
          } else {
            a ^= 1 << h - 32;
          }
        }
        if (128 & i) {
          i = i << 1 ^ 113;
        } else {
          i <<= 1;
        }
      }
      u[o] = s.create(a, p);
    }
  }();
  var p = [];
  !function () {
    for (var e = 0; e < 25; e++) p[e] = s.create();
  }();
  var d = a.SHA3 = o.extend({
    cfg: o.cfg.extend({
      outputLength: 512
    }),
    _doReset: function () {
      for (e = this._state = [], t = 0, void 0; t < 25; t++) {
        var e;
        var t;
        e[t] = new s.init();
      }
      this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
    },
    _doProcessBlock: function (e, t) {
      for (n = this._state, r = this.blockSize / 2, i = 0, void 0; i < r; i++) {
        var n;
        var r;
        var i;
        var o = e[t + 2 * i];
        var s = e[t + 2 * i + 1];
        o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8);
        s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
        (A = n[i]).high ^= s;
        A.low ^= o;
      }
      for (var a = 0; a < 24; a++) {
        for (var d = 0; d < 5; d++) {
          for (h = 0, f = 0, m = 0, void 0; m < 5; m++) {
            var h;
            var f;
            var m;
            h ^= (A = n[d + 5 * m]).high;
            f ^= A.low;
          }
          var g = p[d];
          g.high = h;
          g.low = f;
        }
        for (d = 0; d < 5; d++) {
          var y = p[(d + 4) % 5];
          var _ = p[(d + 1) % 5];
          var v = _.high;
          var b = _.low;
          for (h = y.high ^ (v << 1 | b >>> 31), f = y.low ^ (b << 1 | v >>> 31), m = 0; m < 5; m++) {
            (A = n[d + 5 * m]).high ^= h;
            A.low ^= f;
          }
        }
        for (var E = 1; E < 25; E++) {
          var w = (A = n[E]).high;
          var T = A.low;
          var S = c[E];
          if (S < 32) {
            h = w << S | T >>> 32 - S;
            f = T << S | w >>> 32 - S;
          } else {
            h = T << S - 32 | w >>> 64 - S;
            f = w << S - 32 | T >>> 64 - S;
          }
          var x = p[l[E]];
          x.high = h;
          x.low = f;
        }
        var C = p[0];
        var I = n[0];
        for (C.high = I.high, C.low = I.low, d = 0; d < 5; d++) for (m = 0; m < 5; m++) {
          var A = n[E = d + 5 * m];
          var k = p[E];
          var P = p[(d + 1) % 5 + 5 * m];
          var N = p[(d + 2) % 5 + 5 * m];
          A.high = k.high ^ ~P.high & N.high;
          A.low = k.low ^ ~P.low & N.low;
        }
        A = n[0];
        var O = u[a];
        A.high ^= O.high;
        A.low ^= O.low;
      }
    },
    _doFinalize: function () {
      var t = this._data;
      var n = t.words;
      var r = (this._nDataBytes, 8 * t.sigBytes);
      var o = 32 * this.blockSize;
      n[r >>> 5] |= 1 << 24 - r % 32;
      n[(e.ceil((r + 1) / o) * o >>> 5) - 1] |= 128;
      t.sigBytes = 4 * n.length;
      this._process();
      for (s = this._state, a = this.cfg.outputLength / 8, c = a / 8, l = [], u = 0, void 0; u < c; u++) {
        var s;
        var a;
        var c;
        var l;
        var u;
        var p = s[u];
        var d = p.high;
        var h = p.low;
        d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8);
        h = 16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 | h >>> 8);
        l.push(h);
        l.push(d);
      }
      return new i.init(l, a);
    },
    clone: function () {
      for (e = o.clone.call(this), t = e._state = this._state.slice(0), n = 0, void 0; n < 25; n++) {
        var e;
        var t;
        var n;
        t[n] = t[n].clone();
      }
      return e;
    }
  });
  t.SHA3 = o._createHelper(d);
  t.HmacSHA3 = o._createHmacHelper(d);
})(Math);
module.exports = r.SHA3;