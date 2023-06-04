var r;
r = require(78249);
require(75109);
r.mode.CFB = function () {
  var e = r.lib.BlockCipherMode.extend();
  function t(e, t, n, r) {
    var i;
    var o = this._iv;
    if (o) {
      i = o.slice(0);
      this._iv = void 0;
    } else {
      i = this._prevBlock;
    }
    r.encryptBlock(i, 0);
    for (var s = 0; s < n; s++) e[t + s] ^= i[s];
  }
  e.Encryptor = e.extend({
    processBlock: function (e, n) {
      var r = this._cipher;
      var i = r.blockSize;
      t.call(this, e, n, i, r);
      this._prevBlock = e.slice(n, n + i);
    }
  });
  e.Decryptor = e.extend({
    processBlock: function (e, n) {
      var r = this._cipher;
      var i = r.blockSize;
      var o = e.slice(n, n + i);
      t.call(this, e, n, i, r);
      this._prevBlock = o;
    }
  });
  return e;
}();
module.exports = r.mode.CFB;