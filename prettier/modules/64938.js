var r;
var i;
var o;
var s;
var a;
var c;
r = require(78249);
o = (i = r).lib;
s = o.Base;
a = o.WordArray;
(c = i.x64 = {}).Word = s.extend({
  init: function (e, t) {
    this.high = e;
    this.low = t;
  }
});
c.WordArray = s.extend({
  init: function (e, t) {
    e = this.words = e || [];
    this.sigBytes = null != t ? t : 8 * e.length;
  },
  toX32: function () {
    for (e = this.words, t = e.length, n = [], r = 0, void 0; r < t; r++) {
      var e;
      var t;
      var n;
      var r;
      var i = e[r];
      n.push(i.high);
      n.push(i.low);
    }
    return a.create(n, this.sigBytes);
  },
  clone: function () {
    for (e = s.clone.call(this), t = e.words = this.words.slice(0), n = t.length, r = 0, void 0; r < n; r++) {
      var e;
      var t;
      var n;
      var r;
      t[r] = t[r].clone();
    }
    return e;
  }
});
module.exports = r;