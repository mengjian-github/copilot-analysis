var r;
var i;
var o;
i = (r = require(78249)).lib.Base;
o = r.enc.Utf8;
module.exports = void (r.algo.HMAC = i.extend({
  init: function (e, t) {
    e = this._hasher = new e.init(), "string" == typeof t && (t = o.parse(t));
    var n = e.blockSize,
      r = 4 * n;
    t.sigBytes > r && (t = e.finalize(t)), t.clamp();
    for (var i = this._oKey = t.clone(), s = this._iKey = t.clone(), a = i.words, c = s.words, l = 0; l < n; l++) a[l] ^= 1549556828, c[l] ^= 909522486;
    i.sigBytes = s.sigBytes = r, this.reset();
  },
  reset: function () {
    var e = this._hasher;
    e.reset(), e.update(this._iKey);
  },
  update: function (e) {
    return this._hasher.update(e), this;
  },
  finalize: function (e) {
    var t = this._hasher,
      n = t.finalize(e);
    return t.reset(), t.finalize(this._oKey.clone().concat(n));
  }
}));