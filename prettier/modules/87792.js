var r;
var i;
var o;
var s;
var a;
var c;
c = require(78249);
require(52153);
i = (r = c).lib.WordArray;
o = r.algo;
s = o.SHA256;
a = o.SHA224 = s.extend({
  _doReset: function () {
    this._hash = new i.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
  },
  _doFinalize: function () {
    var e = s._doFinalize.call(this);
    e.sigBytes -= 4;
    return e;
  }
});
r.SHA224 = s._createHelper(a);
r.HmacSHA224 = s._createHmacHelper(a);
module.exports = c.SHA224;