var r = require(3832);
require(97116);
module.exports = r.cipher = r.cipher || {};
r.cipher.algorithms = r.cipher.algorithms || {};
r.cipher.createCipher = function (e, t) {
  var n = e;
  if ("string" == typeof n && (n = r.cipher.getAlgorithm(n))) {
    n = n();
  }
  if (!n) throw new Error("Unsupported algorithm: " + e);
  return new r.cipher.BlockCipher({
    algorithm: n,
    key: t,
    decrypt: !1
  });
};
r.cipher.createDecipher = function (e, t) {
  var n = e;
  if ("string" == typeof n && (n = r.cipher.getAlgorithm(n))) {
    n = n();
  }
  if (!n) throw new Error("Unsupported algorithm: " + e);
  return new r.cipher.BlockCipher({
    algorithm: n,
    key: t,
    decrypt: !0
  });
};
r.cipher.registerAlgorithm = function (e, t) {
  e = e.toUpperCase();
  r.cipher.algorithms[e] = t;
};
r.cipher.getAlgorithm = function (e) {
  return (e = e.toUpperCase()) in r.cipher.algorithms ? r.cipher.algorithms[e] : null;
};
var i = r.cipher.BlockCipher = function (e) {
  this.algorithm = e.algorithm;
  this.mode = this.algorithm.mode;
  this.blockSize = this.mode.blockSize;
  this._finish = !1;
  this._input = null;
  this.output = null;
  this._op = e.decrypt ? this.mode.decrypt : this.mode.encrypt;
  this._decrypt = e.decrypt;
  this.algorithm.initialize(e);
};
i.prototype.start = function (e) {
  e = e || {};
  var t = {};
  for (var n in e) t[n] = e[n];
  t.decrypt = this._decrypt;
  this._finish = !1;
  this._input = r.util.createBuffer();
  this.output = e.output || r.util.createBuffer();
  this.mode.start(t);
};
i.prototype.update = function (e) {
  for (e && this._input.putBuffer(e); !this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish;);
  this._input.compact();
};
i.prototype.finish = function (e) {
  if (!e || "ECB" !== this.mode.name && "CBC" !== this.mode.name) {
    this.mode.pad = function (t) {
      return e(this.blockSize, t, !1);
    };
    this.mode.unpad = function (t) {
      return e(this.blockSize, t, !0);
    };
  }
  var t = {};
  t.decrypt = this._decrypt;
  t.overflow = this._input.length() % this.blockSize;
  return !(!this._decrypt && this.mode.pad && !this.mode.pad(this._input, t) || (this._finish = !0, this.update(), this._decrypt && this.mode.unpad && !this.mode.unpad(this.output, t) || this.mode.afterFinish && !this.mode.afterFinish(this.output, t)));
};