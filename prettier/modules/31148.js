var r;
var i;
i = require(78249);
require(75109);
(r = i.lib.BlockCipherMode.extend()).Encryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.encryptBlock(e, t);
  }
});
r.Decryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.decryptBlock(e, t);
  }
});
i.mode.ECB = r;
module.exports = i.mode.ECB;