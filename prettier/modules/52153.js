var r;
r = require(78249);
(function (e) {
  var t = r;
  var n = t.lib;
  var i = n.WordArray;
  var o = n.Hasher;
  var s = t.algo;
  var a = [];
  var c = [];
  !function () {
    function t(t) {
      for (n = e.sqrt(t), r = 2, void 0; r <= n; r++) {
        var n;
        var r;
        if (!(t % r)) return !1;
      }
      return !0;
    }
    function n(e) {
      return 4294967296 * (e - (0 | e)) | 0;
    }
    for (r = 2, i = 0, void 0; i < 64;) {
      var r;
      var i;
      if (t(r)) {
        if (i < 8) {
          a[i] = n(e.pow(r, .5));
        }
        c[i] = n(e.pow(r, 1 / 3));
        i++;
      }
      r++;
    }
  }();
  var l = [];
  var u = s.SHA256 = o.extend({
    _doReset: function () {
      this._hash = new i.init(a.slice(0));
    },
    _doProcessBlock: function (e, t) {
      for (n = this._hash.words, r = n[0], i = n[1], o = n[2], s = n[3], a = n[4], u = n[5], p = n[6], d = n[7], h = 0, void 0; h < 64; h++) {
        var n;
        var r;
        var i;
        var o;
        var s;
        var a;
        var u;
        var p;
        var d;
        var h;
        if (h < 16) l[h] = 0 | e[t + h];else {
          var f = l[h - 15];
          var m = (f << 25 | f >>> 7) ^ (f << 14 | f >>> 18) ^ f >>> 3;
          var g = l[h - 2];
          var y = (g << 15 | g >>> 17) ^ (g << 13 | g >>> 19) ^ g >>> 10;
          l[h] = m + l[h - 7] + y + l[h - 16];
        }
        var _ = r & i ^ r & o ^ i & o;
        var v = (r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22);
        var b = d + ((a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 | a >>> 25)) + (a & u ^ ~a & p) + c[h] + l[h];
        d = p;
        p = u;
        u = a;
        a = s + b | 0;
        s = o;
        o = i;
        i = r;
        r = b + (v + _) | 0;
      }
      n[0] = n[0] + r | 0;
      n[1] = n[1] + i | 0;
      n[2] = n[2] + o | 0;
      n[3] = n[3] + s | 0;
      n[4] = n[4] + a | 0;
      n[5] = n[5] + u | 0;
      n[6] = n[6] + p | 0;
      n[7] = n[7] + d | 0;
    },
    _doFinalize: function () {
      var t = this._data;
      var n = t.words;
      var r = 8 * this._nDataBytes;
      var i = 8 * t.sigBytes;
      n[i >>> 5] |= 128 << 24 - i % 32;
      n[14 + (i + 64 >>> 9 << 4)] = e.floor(r / 4294967296);
      n[15 + (i + 64 >>> 9 << 4)] = r;
      t.sigBytes = 4 * n.length;
      this._process();
      return this._hash;
    },
    clone: function () {
      var e = o.clone.call(this);
      e._hash = this._hash.clone();
      return e;
    }
  });
  t.SHA256 = o._createHelper(u);
  t.HmacSHA256 = o._createHmacHelper(u);
})(Math);
module.exports = r.SHA256;