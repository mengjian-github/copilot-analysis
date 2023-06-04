var r;
r = require(78249);
require(75109);
r.pad.Iso10126 = {
  pad: function (e, t) {
    var n = 4 * t;
    var i = n - e.sigBytes % n;
    e.concat(r.lib.WordArray.random(i - 1)).concat(r.lib.WordArray.create([i << 24], 1));
  },
  unpad: function (e) {
    var t = 255 & e.words[e.sigBytes - 1 >>> 2];
    e.sigBytes -= t;
  }
};
module.exports = r.pad.Iso10126;