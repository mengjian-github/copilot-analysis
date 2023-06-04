var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u;
var p;
p = require(78249);
require(62783);
require(89824);
o = (i = (r = p).lib).Base;
s = i.WordArray;
c = (a = r.algo).SHA1;
l = a.HMAC;
u = a.PBKDF2 = o.extend({
  cfg: o.extend({
    keySize: 4,
    hasher: c,
    iterations: 1
  }),
  init: function (e) {
    this.cfg = this.cfg.extend(e);
  },
  compute: function (e, t) {
    for (n = this.cfg, r = l.create(n.hasher, e), i = s.create(), o = s.create([1]), a = i.words, c = o.words, u = n.keySize, p = n.iterations, void 0; a.length < u;) {
      var n;
      var r;
      var i;
      var o;
      var a;
      var c;
      var u;
      var p;
      var d = r.update(t).finalize(o);
      r.reset();
      for (h = d.words, f = h.length, m = d, g = 1, void 0; g < p; g++) {
        var h;
        var f;
        var m;
        var g;
        m = r.finalize(m);
        r.reset();
        for (y = m.words, _ = 0, void 0; _ < f; _++) {
          var y;
          var _;
          h[_] ^= y[_];
        }
      }
      i.concat(d);
      c[0]++;
    }
    i.sigBytes = 4 * u;
    return i;
  }
});
r.PBKDF2 = function (e, t, n) {
  return u.create(n).compute(e, t);
};
module.exports = p.PBKDF2;