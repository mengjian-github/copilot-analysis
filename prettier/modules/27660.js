var r;
var i;
var o;
o = require(78249);
require(75109);
i = (r = o.lib.BlockCipherMode.extend()).Encryptor = r.extend({
  processBlock: function (e, t) {
    var n = this._cipher;
    var r = n.blockSize;
    var i = this._iv;
    var o = this._keystream;
    if (i) {
      o = this._keystream = i.slice(0);
      this._iv = void 0;
    }
    n.encryptBlock(o, 0);
    for (var s = 0; s < r; s++) e[t + s] ^= o[s];
  }
});
r.Decryptor = i;
o.mode.OFB = r;
module.exports = o.mode.OFB;