var r;
r = require(78249);
require(75109);
r.pad.AnsiX923 = {
  pad: function (e, t) {
    var n = e.sigBytes;
    var r = 4 * t;
    var i = r - n % r;
    var o = n + i - 1;
    e.clamp();
    e.words[o >>> 2] |= i << 24 - o % 4 * 8;
    e.sigBytes += i;
  },
  unpad: function (e) {
    var t = 255 & e.words[e.sigBytes - 1 >>> 2];
    e.sigBytes -= t;
  }
};
module.exports = r.pad.Ansix923;