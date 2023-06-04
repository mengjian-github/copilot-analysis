var r;
r = require(78249);
require(75109);
r.pad.ZeroPadding = {
  pad: function (e, t) {
    var n = 4 * t;
    e.clamp();
    e.sigBytes += n - (e.sigBytes % n || n);
  },
  unpad: function (e) {
    var t = e.words;
    var n = e.sigBytes - 1;
    for (n = e.sigBytes - 1; n >= 0; n--) if (t[n >>> 2] >>> 24 - n % 4 * 8 & 255) {
      e.sigBytes = n + 1;
      break;
    }
  }
};
module.exports = r.pad.ZeroPadding;