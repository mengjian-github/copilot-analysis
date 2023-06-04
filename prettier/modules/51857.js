var r;
r = require(78249);
require(98269);
require(68214);
require(90888);
require(75109);
(function () {
  var e = r;
  var t = e.lib.StreamCipher;
  var n = e.algo;
  var i = n.RC4 = t.extend({
    _doReset: function () {
      for (e = this._key, t = e.words, n = e.sigBytes, r = this._S = [], i = 0, void 0; i < 256; i++) {
        var e;
        var t;
        var n;
        var r;
        var i;
        r[i] = i;
      }
      i = 0;
      for (var o = 0; i < 256; i++) {
        var s = i % n;
        var a = t[s >>> 2] >>> 24 - s % 4 * 8 & 255;
        o = (o + r[i] + a) % 256;
        var c = r[i];
        r[i] = r[o];
        r[o] = c;
      }
      this._i = this._j = 0;
    },
    _doProcessBlock: function (e, t) {
      e[t] ^= o.call(this);
    },
    keySize: 8,
    ivSize: 0
  });
  function o() {
    for (e = this._S, t = this._i, n = this._j, r = 0, i = 0, void 0; i < 4; i++) {
      var e;
      var t;
      var n;
      var r;
      var i;
      n = (n + e[t = (t + 1) % 256]) % 256;
      var o = e[t];
      e[t] = e[n];
      e[n] = o;
      r |= e[(e[t] + e[n]) % 256] << 24 - 8 * i;
    }
    this._i = t;
    this._j = n;
    return r;
  }
  e.RC4 = t._createHelper(i);
  var s = n.RC4Drop = i.extend({
    cfg: i.cfg.extend({
      drop: 192
    }),
    _doReset: function () {
      i._doReset.call(this);
      for (var e = this.cfg.drop; e > 0; e--) o.call(this);
    }
  });
  e.RC4Drop = t._createHelper(s);
})();
module.exports = r.RC4;