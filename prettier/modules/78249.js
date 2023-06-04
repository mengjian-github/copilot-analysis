var r;
r = r || function (e, t) {
  var r;
  if ("undefined" != typeof window && window.crypto) {
    r = window.crypto;
  }
  if ("undefined" != typeof self && self.crypto) {
    r = self.crypto;
  }
  if ("undefined" != typeof globalThis && globalThis.crypto) {
    r = globalThis.crypto;
  }
  if (!r && "undefined" != typeof window && window.msCrypto) {
    r = window.msCrypto;
  }
  if (!r && "undefined" != typeof global && global.crypto) {
    r = global.crypto;
  }
  if (!r) try {
    r = require(6113);
  } catch (e) {}
  var i = function () {
    if (r) {
      if ("function" == typeof r.getRandomValues) try {
        return r.getRandomValues(new Uint32Array(1))[0];
      } catch (e) {}
      if ("function" == typeof r.randomBytes) try {
        return r.randomBytes(4).readInt32LE();
      } catch (e) {}
    }
    throw new Error("Native crypto module could not be used to get secure random number.");
  };
  var o = Object.create || function () {
    function e() {}
    return function (t) {
      var n;
      e.prototype = t;
      n = new e();
      e.prototype = null;
      return n;
    };
  }();
  var s = {};
  var a = s.lib = {};
  var c = a.Base = {
    extend: function (e) {
      var t = o(this);
      if (e) {
        t.mixIn(e);
      }
      if (t.hasOwnProperty("init") && this.init !== t.init) {
        t.init = function () {
          t.$super.init.apply(this, arguments);
        };
      }
      t.init.prototype = t;
      t.$super = this;
      return t;
    },
    create: function () {
      var e = this.extend();
      e.init.apply(e, arguments);
      return e;
    },
    init: function () {},
    mixIn: function (e) {
      for (var t in e) if (e.hasOwnProperty(t)) {
        this[t] = e[t];
      }
      if (e.hasOwnProperty("toString")) {
        this.toString = e.toString;
      }
    },
    clone: function () {
      return this.init.prototype.extend(this);
    }
  };
  var l = a.WordArray = c.extend({
    init: function (e, t) {
      e = this.words = e || [];
      this.sigBytes = null != t ? t : 4 * e.length;
    },
    toString: function (e) {
      return (e || p).stringify(this);
    },
    concat: function (e) {
      var t = this.words;
      var n = e.words;
      var r = this.sigBytes;
      var i = e.sigBytes;
      this.clamp();
      if (r % 4) for (var o = 0; o < i; o++) {
        var s = n[o >>> 2] >>> 24 - o % 4 * 8 & 255;
        t[r + o >>> 2] |= s << 24 - (r + o) % 4 * 8;
      } else for (var a = 0; a < i; a += 4) t[r + a >>> 2] = n[a >>> 2];
      this.sigBytes += i;
      return this;
    },
    clamp: function () {
      var t = this.words;
      var n = this.sigBytes;
      t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8;
      t.length = e.ceil(n / 4);
    },
    clone: function () {
      var e = c.clone.call(this);
      e.words = this.words.slice(0);
      return e;
    },
    random: function (e) {
      for (t = [], n = 0, void 0; n < e; n += 4) {
        var t;
        var n;
        t.push(i());
      }
      return new l.init(t, e);
    }
  });
  var u = s.enc = {};
  var p = u.Hex = {
    stringify: function (e) {
      for (t = e.words, n = e.sigBytes, r = [], i = 0, void 0; i < n; i++) {
        var t;
        var n;
        var r;
        var i;
        var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        r.push((o >>> 4).toString(16));
        r.push((15 & o).toString(16));
      }
      return r.join("");
    },
    parse: function (e) {
      for (t = e.length, n = [], r = 0, void 0; r < t; r += 2) {
        var t;
        var n;
        var r;
        n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - r % 8 * 4;
      }
      return new l.init(n, t / 2);
    }
  };
  var d = u.Latin1 = {
    stringify: function (e) {
      for (t = e.words, n = e.sigBytes, r = [], i = 0, void 0; i < n; i++) {
        var t;
        var n;
        var r;
        var i;
        var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        r.push(String.fromCharCode(o));
      }
      return r.join("");
    },
    parse: function (e) {
      for (t = e.length, n = [], r = 0, void 0; r < t; r++) {
        var t;
        var n;
        var r;
        n[r >>> 2] |= (255 & e.charCodeAt(r)) << 24 - r % 4 * 8;
      }
      return new l.init(n, t);
    }
  };
  var h = u.Utf8 = {
    stringify: function (e) {
      try {
        return decodeURIComponent(escape(d.stringify(e)));
      } catch (e) {
        throw new Error("Malformed UTF-8 data");
      }
    },
    parse: function (e) {
      return d.parse(unescape(encodeURIComponent(e)));
    }
  };
  var f = a.BufferedBlockAlgorithm = c.extend({
    reset: function () {
      this._data = new l.init();
      this._nDataBytes = 0;
    },
    _append: function (e) {
      if ("string" == typeof e) {
        e = h.parse(e);
      }
      this._data.concat(e);
      this._nDataBytes += e.sigBytes;
    },
    _process: function (t) {
      var n;
      var r = this._data;
      var i = r.words;
      var o = r.sigBytes;
      var s = this.blockSize;
      var a = o / (4 * s);
      var c = (a = t ? e.ceil(a) : e.max((0 | a) - this._minBufferSize, 0)) * s;
      var u = e.min(4 * c, o);
      if (c) {
        for (var p = 0; p < c; p += s) this._doProcessBlock(i, p);
        n = i.splice(0, c);
        r.sigBytes -= u;
      }
      return new l.init(n, u);
    },
    clone: function () {
      var e = c.clone.call(this);
      e._data = this._data.clone();
      return e;
    },
    _minBufferSize: 0
  });
  var m = (a.Hasher = f.extend({
    cfg: c.extend(),
    init: function (e) {
      this.cfg = this.cfg.extend(e);
      this.reset();
    },
    reset: function () {
      f.reset.call(this);
      this._doReset();
    },
    update: function (e) {
      this._append(e);
      this._process();
      return this;
    },
    finalize: function (e) {
      if (e) {
        this._append(e);
      }
      return this._doFinalize();
    },
    blockSize: 16,
    _createHelper: function (e) {
      return function (t, n) {
        return new e.init(n).finalize(t);
      };
    },
    _createHmacHelper: function (e) {
      return function (t, n) {
        return new m.HMAC.init(e, n).finalize(t);
      };
    }
  }), s.algo = {});
  return s;
}(Math);
module.exports = r;