var r;
r = require(78249);
require(75109);
r.pad.Iso97971 = {
  pad: function (e, t) {
    e.concat(r.lib.WordArray.create([2147483648], 1));
    r.pad.ZeroPadding.pad(e, t);
  },
  unpad: function (e) {
    r.pad.ZeroPadding.unpad(e);
    e.sigBytes--;
  }
};
module.exports = r.pad.Iso97971;