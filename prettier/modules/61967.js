var r = require(3832);
require(97116);
r.cipher = r.cipher || {};
var i = module.exports = r.cipher.modes = r.cipher.modes || {};
function o(e, t) {
  if ("string" == typeof e) {
    e = r.util.createBuffer(e);
  }
  if (r.util.isArray(e) && e.length > 4) {
    var n = e;
    e = r.util.createBuffer();
    for (var i = 0; i < n.length; ++i) e.putByte(n[i]);
  }
  if (e.length() < t) throw new Error("Invalid IV length; got " + e.length() + " bytes and expected " + t + " bytes.");
  if (!r.util.isArray(e)) {
    var o = [];
    var s = t / 4;
    for (i = 0; i < s; ++i) o.push(e.getInt32());
    e = o;
  }
  return e;
}
function s(e) {
  e[e.length - 1] = e[e.length - 1] + 1 & 4294967295;
}
function a(e) {
  return [e / 4294967296 | 0, 4294967295 & e];
}
i.ecb = function (e) {
  e = e || {};
  this.name = "ECB";
  this.cipher = e.cipher;
  this.blockSize = e.blockSize || 16;
  this._ints = this.blockSize / 4;
  this._inBlock = new Array(this._ints);
  this._outBlock = new Array(this._ints);
};
i.ecb.prototype.start = function (e) {};
i.ecb.prototype.encrypt = function (e, t, n) {
  if (e.length() < this.blockSize && !(n && e.length() > 0)) return !0;
  for (var r = 0; r < this._ints; ++r) this._inBlock[r] = e.getInt32();
  for (this.cipher.encrypt(this._inBlock, this._outBlock), r = 0; r < this._ints; ++r) t.putInt32(this._outBlock[r]);
};
i.ecb.prototype.decrypt = function (e, t, n) {
  if (e.length() < this.blockSize && !(n && e.length() > 0)) return !0;
  for (var r = 0; r < this._ints; ++r) this._inBlock[r] = e.getInt32();
  for (this.cipher.decrypt(this._inBlock, this._outBlock), r = 0; r < this._ints; ++r) t.putInt32(this._outBlock[r]);
};
i.ecb.prototype.pad = function (e, t) {
  var n = e.length() === this.blockSize ? this.blockSize : this.blockSize - e.length();
  e.fillWithByte(n, n);
  return !0;
};
i.ecb.prototype.unpad = function (e, t) {
  if (t.overflow > 0) return !1;
  var n = e.length();
  var r = e.at(n - 1);
  return !(r > this.blockSize << 2 || (e.truncate(r), 0));
};
i.cbc = function (e) {
  e = e || {};
  this.name = "CBC";
  this.cipher = e.cipher;
  this.blockSize = e.blockSize || 16;
  this._ints = this.blockSize / 4;
  this._inBlock = new Array(this._ints);
  this._outBlock = new Array(this._ints);
};
i.cbc.prototype.start = function (e) {
  if (null === e.iv) {
    if (!this._prev) throw new Error("Invalid IV parameter.");
    this._iv = this._prev.slice(0);
  } else {
    if (!("iv" in e)) throw new Error("Invalid IV parameter.");
    this._iv = o(e.iv, this.blockSize);
    this._prev = this._iv.slice(0);
  }
};
i.cbc.prototype.encrypt = function (e, t, n) {
  if (e.length() < this.blockSize && !(n && e.length() > 0)) return !0;
  for (var r = 0; r < this._ints; ++r) this._inBlock[r] = this._prev[r] ^ e.getInt32();
  for (this.cipher.encrypt(this._inBlock, this._outBlock), r = 0; r < this._ints; ++r) t.putInt32(this._outBlock[r]);
  this._prev = this._outBlock;
};
i.cbc.prototype.decrypt = function (e, t, n) {
  if (e.length() < this.blockSize && !(n && e.length() > 0)) return !0;
  for (var r = 0; r < this._ints; ++r) this._inBlock[r] = e.getInt32();
  for (this.cipher.decrypt(this._inBlock, this._outBlock), r = 0; r < this._ints; ++r) t.putInt32(this._prev[r] ^ this._outBlock[r]);
  this._prev = this._inBlock.slice(0);
};
i.cbc.prototype.pad = function (e, t) {
  var n = e.length() === this.blockSize ? this.blockSize : this.blockSize - e.length();
  e.fillWithByte(n, n);
  return !0;
};
i.cbc.prototype.unpad = function (e, t) {
  if (t.overflow > 0) return !1;
  var n = e.length();
  var r = e.at(n - 1);
  return !(r > this.blockSize << 2 || (e.truncate(r), 0));
};
i.cfb = function (e) {
  e = e || {};
  this.name = "CFB";
  this.cipher = e.cipher;
  this.blockSize = e.blockSize || 16;
  this._ints = this.blockSize / 4;
  this._inBlock = null;
  this._outBlock = new Array(this._ints);
  this._partialBlock = new Array(this._ints);
  this._partialOutput = r.util.createBuffer();
  this._partialBytes = 0;
};
i.cfb.prototype.start = function (e) {
  if (!("iv" in e)) throw new Error("Invalid IV parameter.");
  this._iv = o(e.iv, this.blockSize);
  this._inBlock = this._iv.slice(0);
  this._partialBytes = 0;
};
i.cfb.prototype.encrypt = function (e, t, n) {
  var r = e.length();
  if (0 === r) return !0;
  this.cipher.encrypt(this._inBlock, this._outBlock);
  if (0 === this._partialBytes && r >= this.blockSize) for (var i = 0; i < this._ints; ++i) this._inBlock[i] = e.getInt32() ^ this._outBlock[i], t.putInt32(this._inBlock[i]);else {
    var o = (this.blockSize - r) % this.blockSize;
    for (o > 0 && (o = this.blockSize - o), this._partialOutput.clear(), i = 0; i < this._ints; ++i) this._partialBlock[i] = e.getInt32() ^ this._outBlock[i], this._partialOutput.putInt32(this._partialBlock[i]);
    if (o > 0) e.read -= this.blockSize;else for (i = 0; i < this._ints; ++i) this._inBlock[i] = this._partialBlock[i];
    if (this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), o > 0 && !n) return t.putBytes(this._partialOutput.getBytes(o - this._partialBytes)), this._partialBytes = o, !0;
    t.putBytes(this._partialOutput.getBytes(r - this._partialBytes)), this._partialBytes = 0;
  }
};
i.cfb.prototype.decrypt = function (e, t, n) {
  var r = e.length();
  if (0 === r) return !0;
  this.cipher.encrypt(this._inBlock, this._outBlock);
  if (0 === this._partialBytes && r >= this.blockSize) for (var i = 0; i < this._ints; ++i) this._inBlock[i] = e.getInt32(), t.putInt32(this._inBlock[i] ^ this._outBlock[i]);else {
    var o = (this.blockSize - r) % this.blockSize;
    for (o > 0 && (o = this.blockSize - o), this._partialOutput.clear(), i = 0; i < this._ints; ++i) this._partialBlock[i] = e.getInt32(), this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]);
    if (o > 0) e.read -= this.blockSize;else for (i = 0; i < this._ints; ++i) this._inBlock[i] = this._partialBlock[i];
    if (this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), o > 0 && !n) return t.putBytes(this._partialOutput.getBytes(o - this._partialBytes)), this._partialBytes = o, !0;
    t.putBytes(this._partialOutput.getBytes(r - this._partialBytes)), this._partialBytes = 0;
  }
};
i.ofb = function (e) {
  e = e || {};
  this.name = "OFB";
  this.cipher = e.cipher;
  this.blockSize = e.blockSize || 16;
  this._ints = this.blockSize / 4;
  this._inBlock = null;
  this._outBlock = new Array(this._ints);
  this._partialOutput = r.util.createBuffer();
  this._partialBytes = 0;
};
i.ofb.prototype.start = function (e) {
  if (!("iv" in e)) throw new Error("Invalid IV parameter.");
  this._iv = o(e.iv, this.blockSize);
  this._inBlock = this._iv.slice(0);
  this._partialBytes = 0;
};
i.ofb.prototype.encrypt = function (e, t, n) {
  var r = e.length();
  if (0 === e.length()) return !0;
  this.cipher.encrypt(this._inBlock, this._outBlock);
  if (0 === this._partialBytes && r >= this.blockSize) for (var i = 0; i < this._ints; ++i) t.putInt32(e.getInt32() ^ this._outBlock[i]), this._inBlock[i] = this._outBlock[i];else {
    var o = (this.blockSize - r) % this.blockSize;
    for (o > 0 && (o = this.blockSize - o), this._partialOutput.clear(), i = 0; i < this._ints; ++i) this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[i]);
    if (o > 0) e.read -= this.blockSize;else for (i = 0; i < this._ints; ++i) this._inBlock[i] = this._outBlock[i];
    if (this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), o > 0 && !n) return t.putBytes(this._partialOutput.getBytes(o - this._partialBytes)), this._partialBytes = o, !0;
    t.putBytes(this._partialOutput.getBytes(r - this._partialBytes)), this._partialBytes = 0;
  }
};
i.ofb.prototype.decrypt = i.ofb.prototype.encrypt;
i.ctr = function (e) {
  e = e || {};
  this.name = "CTR";
  this.cipher = e.cipher;
  this.blockSize = e.blockSize || 16;
  this._ints = this.blockSize / 4;
  this._inBlock = null;
  this._outBlock = new Array(this._ints);
  this._partialOutput = r.util.createBuffer();
  this._partialBytes = 0;
};
i.ctr.prototype.start = function (e) {
  if (!("iv" in e)) throw new Error("Invalid IV parameter.");
  this._iv = o(e.iv, this.blockSize);
  this._inBlock = this._iv.slice(0);
  this._partialBytes = 0;
};
i.ctr.prototype.encrypt = function (e, t, n) {
  var r = e.length();
  if (0 === r) return !0;
  this.cipher.encrypt(this._inBlock, this._outBlock);
  if (0 === this._partialBytes && r >= this.blockSize) for (var i = 0; i < this._ints; ++i) t.putInt32(e.getInt32() ^ this._outBlock[i]);else {
    var o = (this.blockSize - r) % this.blockSize;
    for (o > 0 && (o = this.blockSize - o), this._partialOutput.clear(), i = 0; i < this._ints; ++i) this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[i]);
    if (o > 0 && (e.read -= this.blockSize), this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), o > 0 && !n) return t.putBytes(this._partialOutput.getBytes(o - this._partialBytes)), this._partialBytes = o, !0;
    t.putBytes(this._partialOutput.getBytes(r - this._partialBytes)), this._partialBytes = 0;
  }
  s(this._inBlock);
};
i.ctr.prototype.decrypt = i.ctr.prototype.encrypt;
i.gcm = function (e) {
  e = e || {};
  this.name = "GCM";
  this.cipher = e.cipher;
  this.blockSize = e.blockSize || 16;
  this._ints = this.blockSize / 4;
  this._inBlock = new Array(this._ints);
  this._outBlock = new Array(this._ints);
  this._partialOutput = r.util.createBuffer();
  this._partialBytes = 0;
  this._R = 3774873600;
};
i.gcm.prototype.start = function (e) {
  if (!("iv" in e)) throw new Error("Invalid IV parameter.");
  var t;
  var n = r.util.createBuffer(e.iv);
  this._cipherLength = 0;
  t = "additionalData" in e ? r.util.createBuffer(e.additionalData) : r.util.createBuffer();
  this._tagLength = "tagLength" in e ? e.tagLength : 128;
  this._tag = null;
  if (e.decrypt && (this._tag = r.util.createBuffer(e.tag).getBytes(), this._tag.length !== this._tagLength / 8)) throw new Error("Authentication tag does not match tag length.");
  this._hashBlock = new Array(this._ints);
  this.tag = null;
  this._hashSubkey = new Array(this._ints);
  this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey);
  this.componentBits = 4;
  this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
  var i = n.length();
  if (12 === i) this._j0 = [n.getInt32(), n.getInt32(), n.getInt32(), 1];else {
    for (this._j0 = [0, 0, 0, 0]; n.length() > 0;) this._j0 = this.ghash(this._hashSubkey, this._j0, [n.getInt32(), n.getInt32(), n.getInt32(), n.getInt32()]);
    this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(a(8 * i)));
  }
  this._inBlock = this._j0.slice(0);
  s(this._inBlock);
  this._partialBytes = 0;
  t = r.util.createBuffer(t);
  this._aDataLength = a(8 * t.length());
  var o = t.length() % this.blockSize;
  for (o && t.fillWithByte(0, this.blockSize - o), this._s = [0, 0, 0, 0]; t.length() > 0;) this._s = this.ghash(this._hashSubkey, this._s, [t.getInt32(), t.getInt32(), t.getInt32(), t.getInt32()]);
};
i.gcm.prototype.encrypt = function (e, t, n) {
  var r = e.length();
  if (0 === r) return !0;
  this.cipher.encrypt(this._inBlock, this._outBlock);
  if (0 === this._partialBytes && r >= this.blockSize) {
    for (var i = 0; i < this._ints; ++i) t.putInt32(this._outBlock[i] ^= e.getInt32());
    this._cipherLength += this.blockSize;
  } else {
    var o = (this.blockSize - r) % this.blockSize;
    for (o > 0 && (o = this.blockSize - o), this._partialOutput.clear(), i = 0; i < this._ints; ++i) this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[i]);
    if (o <= 0 || n) {
      if (n) {
        var a = r % this.blockSize;
        this._cipherLength += a, this._partialOutput.truncate(this.blockSize - a);
      } else this._cipherLength += this.blockSize;
      for (i = 0; i < this._ints; ++i) this._outBlock[i] = this._partialOutput.getInt32();
      this._partialOutput.read -= this.blockSize;
    }
    if (this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), o > 0 && !n) return e.read -= this.blockSize, t.putBytes(this._partialOutput.getBytes(o - this._partialBytes)), this._partialBytes = o, !0;
    t.putBytes(this._partialOutput.getBytes(r - this._partialBytes)), this._partialBytes = 0;
  }
  this._s = this.ghash(this._hashSubkey, this._s, this._outBlock);
  s(this._inBlock);
};
i.gcm.prototype.decrypt = function (e, t, n) {
  var r = e.length();
  if (r < this.blockSize && !(n && r > 0)) return !0;
  this.cipher.encrypt(this._inBlock, this._outBlock);
  s(this._inBlock);
  this._hashBlock[0] = e.getInt32();
  this._hashBlock[1] = e.getInt32();
  this._hashBlock[2] = e.getInt32();
  this._hashBlock[3] = e.getInt32();
  this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
  for (var i = 0; i < this._ints; ++i) t.putInt32(this._outBlock[i] ^ this._hashBlock[i]);
  if (r < this.blockSize) {
    this._cipherLength += r % this.blockSize;
  } else {
    this._cipherLength += this.blockSize;
  }
};
i.gcm.prototype.afterFinish = function (e, t) {
  var n = !0;
  if (t.decrypt && t.overflow) {
    e.truncate(this.blockSize - t.overflow);
  }
  this.tag = r.util.createBuffer();
  var i = this._aDataLength.concat(a(8 * this._cipherLength));
  this._s = this.ghash(this._hashSubkey, this._s, i);
  var o = [];
  this.cipher.encrypt(this._j0, o);
  for (var s = 0; s < this._ints; ++s) this.tag.putInt32(this._s[s] ^ o[s]);
  this.tag.truncate(this.tag.length() % (this._tagLength / 8));
  if (t.decrypt && this.tag.bytes() !== this._tag) {
    n = !1;
  }
  return n;
};
i.gcm.prototype.multiply = function (e, t) {
  for (n = [0, 0, 0, 0], r = t.slice(0), i = 0, void 0; i < 128; ++i) {
    var n;
    var r;
    var i;
    if (e[i / 32 | 0] & 1 << 31 - i % 32) {
      n[0] ^= r[0];
      n[1] ^= r[1];
      n[2] ^= r[2];
      n[3] ^= r[3];
    }
    this.pow(r, r);
  }
  return n;
};
i.gcm.prototype.pow = function (e, t) {
  for (n = 1 & e[3], r = 3, void 0; r > 0; --r) {
    var n;
    var r;
    t[r] = e[r] >>> 1 | (1 & e[r - 1]) << 31;
  }
  t[0] = e[0] >>> 1;
  if (n) {
    t[0] ^= this._R;
  }
};
i.gcm.prototype.tableMultiply = function (e) {
  for (t = [0, 0, 0, 0], n = 0, void 0; n < 32; ++n) {
    var t;
    var n;
    var r = e[n / 8 | 0] >>> 4 * (7 - n % 8) & 15;
    var i = this._m[n][r];
    t[0] ^= i[0];
    t[1] ^= i[1];
    t[2] ^= i[2];
    t[3] ^= i[3];
  }
  return t;
};
i.gcm.prototype.ghash = function (e, t, n) {
  t[0] ^= n[0];
  t[1] ^= n[1];
  t[2] ^= n[2];
  t[3] ^= n[3];
  return this.tableMultiply(t);
};
i.gcm.prototype.generateHashTable = function (e, t) {
  for (n = 8 / t, r = 4 * n, i = 16 * n, o = new Array(i), s = 0, void 0; s < i; ++s) {
    var n;
    var r;
    var i;
    var o;
    var s;
    var a = [0, 0, 0, 0];
    var c = (r - 1 - s % r) * t;
    a[s / r | 0] = 1 << t - 1 << c;
    o[s] = this.generateSubHashTable(this.multiply(a, e), t);
  }
  return o;
};
i.gcm.prototype.generateSubHashTable = function (e, t) {
  var n = 1 << t;
  var r = n >>> 1;
  var i = new Array(n);
  i[r] = e.slice(0);
  for (var o = r >>> 1; o > 0;) {
    this.pow(i[2 * o], i[o] = []);
    o >>= 1;
  }
  for (o = 2; o < r;) {
    for (var s = 1; s < o; ++s) {
      var a = i[o];
      var c = i[s];
      i[o + s] = [a[0] ^ c[0], a[1] ^ c[1], a[2] ^ c[2], a[3] ^ c[3]];
    }
    o *= 2;
  }
  for (i[0] = [0, 0, 0, 0], o = r + 1; o < n; ++o) {
    var l = i[o ^ r];
    i[o] = [e[0] ^ l[0], e[1] ^ l[1], e[2] ^ l[2], e[3] ^ l[3]];
  }
  return i;
};