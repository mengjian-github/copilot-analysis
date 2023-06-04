var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u;
u = require(78249);
require(62783);
require(89824);
o = (i = (r = u).lib).Base;
s = i.WordArray;
c = (a = r.algo).MD5;
l = a.EvpKDF = o.extend({
  cfg: o.extend({
    keySize: 4,
    hasher: c,
    iterations: 1
  }),
  init: function (e) {
    this.cfg = this.cfg.extend(e);
  },
  compute: function (e, t) {
    for (r = this.cfg, i = r.hasher.create(), o = s.create(), a = o.words, c = r.keySize, l = r.iterations, void 0; a.length < c;) {
      var n;
      var r;
      var i;
      var o;
      var a;
      var c;
      var l;
      if (n) {
        i.update(n);
      }
      n = i.update(e).finalize(t);
      i.reset();
      for (var u = 1; u < l; u++) {
        n = i.finalize(n);
        i.reset();
      }
      o.concat(n);
    }
    o.sigBytes = 4 * c;
    return o;
  }
});
r.EvpKDF = function (e, t, n) {
  return l.create(n).compute(e, t);
};
module.exports = u.EvpKDF;