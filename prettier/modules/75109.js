var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u;
var p;
var d;
var h;
var f;
var m;
var g;
var y;
var _;
var v;
var b;
var E;
r = require(78249);
require(90888);
module.exports = void (r.lib.Cipher || (i = r, o = i.lib, s = o.Base, a = o.WordArray, c = o.BufferedBlockAlgorithm, l = i.enc, l.Utf8, u = l.Base64, p = i.algo.EvpKDF, d = o.Cipher = c.extend({
  cfg: s.extend(),
  createEncryptor: function (e, t) {
    return this.create(this._ENC_XFORM_MODE, e, t);
  },
  createDecryptor: function (e, t) {
    return this.create(this._DEC_XFORM_MODE, e, t);
  },
  init: function (e, t, n) {
    this.cfg = this.cfg.extend(n), this._xformMode = e, this._key = t, this.reset();
  },
  reset: function () {
    c.reset.call(this), this._doReset();
  },
  process: function (e) {
    return this._append(e), this._process();
  },
  finalize: function (e) {
    return e && this._append(e), this._doFinalize();
  },
  keySize: 4,
  ivSize: 4,
  _ENC_XFORM_MODE: 1,
  _DEC_XFORM_MODE: 2,
  _createHelper: function () {
    function e(e) {
      return "string" == typeof e ? E : v;
    }
    return function (t) {
      return {
        encrypt: function (n, r, i) {
          return e(r).encrypt(t, n, r, i);
        },
        decrypt: function (n, r, i) {
          return e(r).decrypt(t, n, r, i);
        }
      };
    };
  }()
}), o.StreamCipher = d.extend({
  _doFinalize: function () {
    return this._process(!0);
  },
  blockSize: 1
}), h = i.mode = {}, f = o.BlockCipherMode = s.extend({
  createEncryptor: function (e, t) {
    return this.Encryptor.create(e, t);
  },
  createDecryptor: function (e, t) {
    return this.Decryptor.create(e, t);
  },
  init: function (e, t) {
    this._cipher = e, this._iv = t;
  }
}), m = h.CBC = function () {
  var e = f.extend();
  function t(e, t, n) {
    var r,
      i = this._iv;
    i ? (r = i, this._iv = void 0) : r = this._prevBlock;
    for (var o = 0; o < n; o++) e[t + o] ^= r[o];
  }
  return e.Encryptor = e.extend({
    processBlock: function (e, n) {
      var r = this._cipher,
        i = r.blockSize;
      t.call(this, e, n, i), r.encryptBlock(e, n), this._prevBlock = e.slice(n, n + i);
    }
  }), e.Decryptor = e.extend({
    processBlock: function (e, n) {
      var r = this._cipher,
        i = r.blockSize,
        o = e.slice(n, n + i);
      r.decryptBlock(e, n), t.call(this, e, n, i), this._prevBlock = o;
    }
  }), e;
}(), g = (i.pad = {}).Pkcs7 = {
  pad: function (e, t) {
    for (var n = 4 * t, r = n - e.sigBytes % n, i = r << 24 | r << 16 | r << 8 | r, o = [], s = 0; s < r; s += 4) o.push(i);
    var c = a.create(o, r);
    e.concat(c);
  },
  unpad: function (e) {
    var t = 255 & e.words[e.sigBytes - 1 >>> 2];
    e.sigBytes -= t;
  }
}, o.BlockCipher = d.extend({
  cfg: d.cfg.extend({
    mode: m,
    padding: g
  }),
  reset: function () {
    var e;
    d.reset.call(this);
    var t = this.cfg,
      n = t.iv,
      r = t.mode;
    this._xformMode == this._ENC_XFORM_MODE ? e = r.createEncryptor : (e = r.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == e ? this._mode.init(this, n && n.words) : (this._mode = e.call(r, this, n && n.words), this._mode.__creator = e);
  },
  _doProcessBlock: function (e, t) {
    this._mode.processBlock(e, t);
  },
  _doFinalize: function () {
    var e,
      t = this.cfg.padding;
    return this._xformMode == this._ENC_XFORM_MODE ? (t.pad(this._data, this.blockSize), e = this._process(!0)) : (e = this._process(!0), t.unpad(e)), e;
  },
  blockSize: 4
}), y = o.CipherParams = s.extend({
  init: function (e) {
    this.mixIn(e);
  },
  toString: function (e) {
    return (e || this.formatter).stringify(this);
  }
}), _ = (i.format = {}).OpenSSL = {
  stringify: function (e) {
    var t = e.ciphertext,
      n = e.salt;
    return (n ? a.create([1398893684, 1701076831]).concat(n).concat(t) : t).toString(u);
  },
  parse: function (e) {
    var t,
      n = u.parse(e),
      r = n.words;
    return 1398893684 == r[0] && 1701076831 == r[1] && (t = a.create(r.slice(2, 4)), r.splice(0, 4), n.sigBytes -= 16), y.create({
      ciphertext: n,
      salt: t
    });
  }
}, v = o.SerializableCipher = s.extend({
  cfg: s.extend({
    format: _
  }),
  encrypt: function (e, t, n, r) {
    r = this.cfg.extend(r);
    var i = e.createEncryptor(n, r),
      o = i.finalize(t),
      s = i.cfg;
    return y.create({
      ciphertext: o,
      key: n,
      iv: s.iv,
      algorithm: e,
      mode: s.mode,
      padding: s.padding,
      blockSize: e.blockSize,
      formatter: r.format
    });
  },
  decrypt: function (e, t, n, r) {
    return r = this.cfg.extend(r), t = this._parse(t, r.format), e.createDecryptor(n, r).finalize(t.ciphertext);
  },
  _parse: function (e, t) {
    return "string" == typeof e ? t.parse(e, this) : e;
  }
}), b = (i.kdf = {}).OpenSSL = {
  execute: function (e, t, n, r) {
    r || (r = a.random(8));
    var i = p.create({
        keySize: t + n
      }).compute(e, r),
      o = a.create(i.words.slice(t), 4 * n);
    return i.sigBytes = 4 * t, y.create({
      key: i,
      iv: o,
      salt: r
    });
  }
}, E = o.PasswordBasedCipher = v.extend({
  cfg: v.cfg.extend({
    kdf: b
  }),
  encrypt: function (e, t, n, r) {
    var i = (r = this.cfg.extend(r)).kdf.execute(n, e.keySize, e.ivSize);
    r.iv = i.iv;
    var o = v.encrypt.call(this, e, t, i.key, r);
    return o.mixIn(i), o;
  },
  decrypt: function (e, t, n, r) {
    r = this.cfg.extend(r), t = this._parse(t, r.format);
    var i = r.kdf.execute(n, e.keySize, e.ivSize, t.salt);
    return r.iv = i.iv, v.decrypt.call(this, e, t, i.key, r);
  }
})));