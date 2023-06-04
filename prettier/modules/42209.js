var r;
var i;
var o;
var s;
s = require(78249);
require(75109);
i = (r = s).lib.CipherParams;
o = r.enc.Hex;
r.format.Hex = {
  stringify: function (e) {
    return e.ciphertext.toString(o);
  },
  parse: function (e) {
    var t = o.parse(e);
    return i.create({
      ciphertext: t
    });
  }
};
module.exports = s.format.Hex;