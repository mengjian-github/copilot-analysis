var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u;
u = require(78249);
require(64938);
require(70034);
i = (r = u).x64;
o = i.Word;
s = i.WordArray;
a = r.algo;
c = a.SHA512;
l = a.SHA384 = c.extend({
  _doReset: function () {
    this._hash = new s.init([new o.init(3418070365, 3238371032), new o.init(1654270250, 914150663), new o.init(2438529370, 812702999), new o.init(355462360, 4144912697), new o.init(1731405415, 4290775857), new o.init(2394180231, 1750603025), new o.init(3675008525, 1694076839), new o.init(1203062813, 3204075428)]);
  },
  _doFinalize: function () {
    var e = c._doFinalize.call(this);
    e.sigBytes -= 16;
    return e;
  }
});
r.SHA384 = c._createHelper(l);
r.HmacSHA384 = c._createHmacHelper(l);
module.exports = u.SHA384;