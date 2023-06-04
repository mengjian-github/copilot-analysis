var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u;
i = (r = u = require(78249)).lib;
o = i.WordArray;
s = i.Hasher;
a = r.algo;
c = [];
l = a.SHA1 = s.extend({
  _doReset: function () {
    this._hash = new o.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
  },
  _doProcessBlock: function (e, t) {
    for (n = this._hash.words, r = n[0], i = n[1], o = n[2], s = n[3], a = n[4], l = 0, void 0; l < 80; l++) {
      var n;
      var r;
      var i;
      var o;
      var s;
      var a;
      var l;
      if (l < 16) c[l] = 0 | e[t + l];else {
        var u = c[l - 3] ^ c[l - 8] ^ c[l - 14] ^ c[l - 16];
        c[l] = u << 1 | u >>> 31;
      }
      var p = (r << 5 | r >>> 27) + a + c[l];
      p += l < 20 ? 1518500249 + (i & o | ~i & s) : l < 40 ? 1859775393 + (i ^ o ^ s) : l < 60 ? (i & o | i & s | o & s) - 1894007588 : (i ^ o ^ s) - 899497514;
      a = s;
      s = o;
      o = i << 30 | i >>> 2;
      i = r;
      r = p;
    }
    n[0] = n[0] + r | 0;
    n[1] = n[1] + i | 0;
    n[2] = n[2] + o | 0;
    n[3] = n[3] + s | 0;
    n[4] = n[4] + a | 0;
  },
  _doFinalize: function () {
    var e = this._data;
    var t = e.words;
    var n = 8 * this._nDataBytes;
    var r = 8 * e.sigBytes;
    t[r >>> 5] |= 128 << 24 - r % 32;
    t[14 + (r + 64 >>> 9 << 4)] = Math.floor(n / 4294967296);
    t[15 + (r + 64 >>> 9 << 4)] = n;
    e.sigBytes = 4 * t.length;
    this._process();
    return this._hash;
  },
  clone: function () {
    var e = s.clone.call(this);
    e._hash = this._hash.clone();
    return e;
  }
});
r.SHA1 = s._createHelper(l);
r.HmacSHA1 = s._createHmacHelper(l);
module.exports = u.SHA1;