var r;
var i = require(3832);
function o(e, t, n) {
  this.data = [];
  if (null != e) {
    if ("number" == typeof e) {
      this.fromNumber(e, t, n);
    } else {
      if (null == t && "string" != typeof e) {
        this.fromString(e, 256);
      } else {
        this.fromString(e, t);
      }
    }
  }
}
function s() {
  return new o(null);
}
function a(e, t, n, r, i, o) {
  for (s = 16383 & t, a = t >> 14, void 0; --o >= 0;) {
    var s;
    var a;
    var c = 16383 & this.data[e];
    var l = this.data[e++] >> 14;
    var u = a * c + l * s;
    i = ((c = s * c + ((16383 & u) << 14) + n.data[r] + i) >> 28) + (u >> 14) + a * l;
    n.data[r++] = 268435455 & c;
  }
  return i;
}
module.exports = i.jsbn = i.jsbn || {};
i.jsbn.BigInteger = o;
if ("undefined" == typeof navigator) {
  o.prototype.am = a;
  r = 28;
} else {
  if ("Microsoft Internet Explorer" == navigator.appName) {
    o.prototype.am = function (e, t, n, r, i, o) {
      for (s = 32767 & t, a = t >> 15, void 0; --o >= 0;) {
        var s;
        var a;
        var c = 32767 & this.data[e];
        var l = this.data[e++] >> 15;
        var u = a * c + l * s;
        i = ((c = s * c + ((32767 & u) << 15) + n.data[r] + (1073741823 & i)) >>> 30) + (u >>> 15) + a * l + (i >>> 30);
        n.data[r++] = 1073741823 & c;
      }
      return i;
    };
    r = 30;
  } else {
    if ("Netscape" != navigator.appName) {
      o.prototype.am = function (e, t, n, r, i, o) {
        for (; --o >= 0;) {
          var s = t * this.data[e++] + n.data[r] + i;
          i = Math.floor(s / 67108864);
          n.data[r++] = 67108863 & s;
        }
        return i;
      };
      r = 26;
    } else {
      o.prototype.am = a;
      r = 28;
    }
  }
}
o.prototype.DB = r;
o.prototype.DM = (1 << r) - 1;
o.prototype.DV = 1 << r;
o.prototype.FV = Math.pow(2, 52);
o.prototype.F1 = 52 - r;
o.prototype.F2 = 2 * r - 52;
var c;
var l;
var u = new Array();
for (c = "0".charCodeAt(0), l = 0; l <= 9; ++l) u[c++] = l;
for (c = "a".charCodeAt(0), l = 10; l < 36; ++l) u[c++] = l;
for (c = "A".charCodeAt(0), l = 10; l < 36; ++l) u[c++] = l;
function p(e) {
  return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(e);
}
function d(e, t) {
  var n = u[e.charCodeAt(t)];
  return null == n ? -1 : n;
}
function h(e) {
  var t = s();
  t.fromInt(e);
  return t;
}
function f(e) {
  var t;
  var n = 1;
  if (0 != (t = e >>> 16)) {
    e = t;
    n += 16;
  }
  if (0 != (t = e >> 8)) {
    e = t;
    n += 8;
  }
  if (0 != (t = e >> 4)) {
    e = t;
    n += 4;
  }
  if (0 != (t = e >> 2)) {
    e = t;
    n += 2;
  }
  if (0 != (t = e >> 1)) {
    e = t;
    n += 1;
  }
  return n;
}
function m(e) {
  this.m = e;
}
function g(e) {
  this.m = e;
  this.mp = e.invDigit();
  this.mpl = 32767 & this.mp;
  this.mph = this.mp >> 15;
  this.um = (1 << e.DB - 15) - 1;
  this.mt2 = 2 * e.t;
}
function y(e, t) {
  return e & t;
}
function _(e, t) {
  return e | t;
}
function v(e, t) {
  return e ^ t;
}
function b(e, t) {
  return e & ~t;
}
function E(e) {
  if (0 == e) return -1;
  var t = 0;
  if (0 == (65535 & e)) {
    e >>= 16;
    t += 16;
  }
  if (0 == (255 & e)) {
    e >>= 8;
    t += 8;
  }
  if (0 == (15 & e)) {
    e >>= 4;
    t += 4;
  }
  if (0 == (3 & e)) {
    e >>= 2;
    t += 2;
  }
  if (0 == (1 & e)) {
    ++t;
  }
  return t;
}
function w(e) {
  for (var t = 0; 0 != e;) {
    e &= e - 1;
    ++t;
  }
  return t;
}
function T() {}
function S(e) {
  return e;
}
function x(e) {
  this.r2 = s();
  this.q3 = s();
  o.ONE.dlShiftTo(2 * e.t, this.r2);
  this.mu = this.r2.divide(e);
  this.m = e;
}
m.prototype.convert = function (e) {
  return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e;
};
m.prototype.revert = function (e) {
  return e;
};
m.prototype.reduce = function (e) {
  e.divRemTo(this.m, null, e);
};
m.prototype.mulTo = function (e, t, n) {
  e.multiplyTo(t, n);
  this.reduce(n);
};
m.prototype.sqrTo = function (e, t) {
  e.squareTo(t);
  this.reduce(t);
};
g.prototype.convert = function (e) {
  var t = s();
  e.abs().dlShiftTo(this.m.t, t);
  t.divRemTo(this.m, null, t);
  if (e.s < 0 && t.compareTo(o.ZERO) > 0) {
    this.m.subTo(t, t);
  }
  return t;
};
g.prototype.revert = function (e) {
  var t = s();
  e.copyTo(t);
  this.reduce(t);
  return t;
};
g.prototype.reduce = function (e) {
  for (; e.t <= this.mt2;) e.data[e.t++] = 0;
  for (var t = 0; t < this.m.t; ++t) {
    var n = 32767 & e.data[t];
    var r = n * this.mpl + ((n * this.mph + (e.data[t] >> 15) * this.mpl & this.um) << 15) & e.DM;
    for (n = t + this.m.t, e.data[n] += this.m.am(0, r, e, t, 0, this.m.t); e.data[n] >= e.DV;) {
      e.data[n] -= e.DV;
      e.data[++n]++;
    }
  }
  e.clamp();
  e.drShiftTo(this.m.t, e);
  if (e.compareTo(this.m) >= 0) {
    e.subTo(this.m, e);
  }
};
g.prototype.mulTo = function (e, t, n) {
  e.multiplyTo(t, n);
  this.reduce(n);
};
g.prototype.sqrTo = function (e, t) {
  e.squareTo(t);
  this.reduce(t);
};
o.prototype.copyTo = function (e) {
  for (var t = this.t - 1; t >= 0; --t) e.data[t] = this.data[t];
  e.t = this.t;
  e.s = this.s;
};
o.prototype.fromInt = function (e) {
  this.t = 1;
  this.s = e < 0 ? -1 : 0;
  if (e > 0) {
    this.data[0] = e;
  } else {
    if (e < -1) {
      this.data[0] = e + this.DV;
    } else {
      this.t = 0;
    }
  }
};
o.prototype.fromString = function (e, t) {
  var n;
  if (16 == t) n = 4;else if (8 == t) n = 3;else if (256 == t) n = 8;else if (2 == t) n = 1;else if (32 == t) n = 5;else {
    if (4 != t) return void this.fromRadix(e, t);
    n = 2;
  }
  this.t = 0;
  this.s = 0;
  for (r = e.length, i = !1, s = 0, void 0; --r >= 0;) {
    var r;
    var i;
    var s;
    var a = 8 == n ? 255 & e[r] : d(e, r);
    if (a < 0) {
      if ("-" == e.charAt(r)) {
        i = !0;
      }
    } else {
      i = !1;
      if (0 == s) {
        this.data[this.t++] = a;
      } else {
        if (s + n > this.DB) {
          this.data[this.t - 1] |= (a & (1 << this.DB - s) - 1) << s;
          this.data[this.t++] = a >> this.DB - s;
        } else {
          this.data[this.t - 1] |= a << s;
        }
      }
      if ((s += n) >= this.DB) {
        s -= this.DB;
      }
    }
  }
  if (8 == n && 0 != (128 & e[0])) {
    this.s = -1;
    if (s > 0) {
      this.data[this.t - 1] |= (1 << this.DB - s) - 1 << s;
    }
  }
  this.clamp();
  if (i) {
    o.ZERO.subTo(this, this);
  }
};
o.prototype.clamp = function () {
  for (var e = this.s & this.DM; this.t > 0 && this.data[this.t - 1] == e;) --this.t;
};
o.prototype.dlShiftTo = function (e, t) {
  var n;
  for (n = this.t - 1; n >= 0; --n) t.data[n + e] = this.data[n];
  for (n = e - 1; n >= 0; --n) t.data[n] = 0;
  t.t = this.t + e;
  t.s = this.s;
};
o.prototype.drShiftTo = function (e, t) {
  for (var n = e; n < this.t; ++n) t.data[n - e] = this.data[n];
  t.t = Math.max(this.t - e, 0);
  t.s = this.s;
};
o.prototype.lShiftTo = function (e, t) {
  var n;
  var r = e % this.DB;
  var i = this.DB - r;
  var o = (1 << i) - 1;
  var s = Math.floor(e / this.DB);
  var a = this.s << r & this.DM;
  for (n = this.t - 1; n >= 0; --n) {
    t.data[n + s + 1] = this.data[n] >> i | a;
    a = (this.data[n] & o) << r;
  }
  for (n = s - 1; n >= 0; --n) t.data[n] = 0;
  t.data[s] = a;
  t.t = this.t + s + 1;
  t.s = this.s;
  t.clamp();
};
o.prototype.rShiftTo = function (e, t) {
  t.s = this.s;
  var n = Math.floor(e / this.DB);
  if (n >= this.t) t.t = 0;else {
    var r = e % this.DB;
    var i = this.DB - r;
    var o = (1 << r) - 1;
    t.data[0] = this.data[n] >> r;
    for (var s = n + 1; s < this.t; ++s) {
      t.data[s - n - 1] |= (this.data[s] & o) << i;
      t.data[s - n] = this.data[s] >> r;
    }
    if (r > 0) {
      t.data[this.t - n - 1] |= (this.s & o) << i;
    }
    t.t = this.t - n;
    t.clamp();
  }
};
o.prototype.subTo = function (e, t) {
  for (n = 0, r = 0, i = Math.min(e.t, this.t), void 0; n < i;) {
    var n;
    var r;
    var i;
    r += this.data[n] - e.data[n];
    t.data[n++] = r & this.DM;
    r >>= this.DB;
  }
  if (e.t < this.t) {
    for (r -= e.s; n < this.t;) {
      r += this.data[n];
      t.data[n++] = r & this.DM;
      r >>= this.DB;
    }
    r += this.s;
  } else {
    for (r += this.s; n < e.t;) {
      r -= e.data[n];
      t.data[n++] = r & this.DM;
      r >>= this.DB;
    }
    r -= e.s;
  }
  t.s = r < 0 ? -1 : 0;
  if (r < -1) {
    t.data[n++] = this.DV + r;
  } else {
    if (r > 0) {
      t.data[n++] = r;
    }
  }
  t.t = n;
  t.clamp();
};
o.prototype.multiplyTo = function (e, t) {
  var n = this.abs();
  var r = e.abs();
  var i = n.t;
  for (t.t = i + r.t; --i >= 0;) t.data[i] = 0;
  for (i = 0; i < r.t; ++i) t.data[i + n.t] = n.am(0, r.data[i], t, i, 0, n.t);
  t.s = 0;
  t.clamp();
  if (this.s != e.s) {
    o.ZERO.subTo(t, t);
  }
};
o.prototype.squareTo = function (e) {
  for (t = this.abs(), n = e.t = 2 * t.t, void 0; --n >= 0;) {
    var t;
    var n;
    e.data[n] = 0;
  }
  for (n = 0; n < t.t - 1; ++n) {
    var r = t.am(n, t.data[n], e, 2 * n, 0, 1);
    if ((e.data[n + t.t] += t.am(n + 1, 2 * t.data[n], e, 2 * n + 1, r, t.t - n - 1)) >= t.DV) {
      e.data[n + t.t] -= t.DV;
      e.data[n + t.t + 1] = 1;
    }
  }
  if (e.t > 0) {
    e.data[e.t - 1] += t.am(n, t.data[n], e, 2 * n, 0, 1);
  }
  e.s = 0;
  e.clamp();
};
o.prototype.divRemTo = function (e, t, n) {
  var r = e.abs();
  if (!(r.t <= 0)) {
    var i = this.abs();
    if (i.t < r.t) {
      if (null != t) {
        t.fromInt(0);
      }
      return void (null != n && this.copyTo(n));
    }
    if (null == n) {
      n = s();
    }
    var a = s();
    var c = this.s;
    var l = e.s;
    var u = this.DB - f(r.data[r.t - 1]);
    if (u > 0) {
      r.lShiftTo(u, a);
      i.lShiftTo(u, n);
    } else {
      r.copyTo(a);
      i.copyTo(n);
    }
    var p = a.t;
    var d = a.data[p - 1];
    if (0 != d) {
      var h = d * (1 << this.F1) + (p > 1 ? a.data[p - 2] >> this.F2 : 0);
      var m = this.FV / h;
      var g = (1 << this.F1) / h;
      var y = 1 << this.F2;
      var _ = n.t;
      var v = _ - p;
      var b = null == t ? s() : t;
      for (a.dlShiftTo(v, b), n.compareTo(b) >= 0 && (n.data[n.t++] = 1, n.subTo(b, n)), o.ONE.dlShiftTo(p, b), b.subTo(a, a); a.t < p;) a.data[a.t++] = 0;
      for (; --v >= 0;) {
        var E = n.data[--_] == d ? this.DM : Math.floor(n.data[_] * m + (n.data[_ - 1] + y) * g);
        if ((n.data[_] += a.am(0, E, n, v, 0, p)) < E) for (a.dlShiftTo(v, b), n.subTo(b, n); n.data[_] < --E;) n.subTo(b, n);
      }
      if (null != t) {
        n.drShiftTo(p, t);
        if (c != l) {
          o.ZERO.subTo(t, t);
        }
      }
      n.t = p;
      n.clamp();
      if (u > 0) {
        n.rShiftTo(u, n);
      }
      if (c < 0) {
        o.ZERO.subTo(n, n);
      }
    }
  }
};
o.prototype.invDigit = function () {
  if (this.t < 1) return 0;
  var e = this.data[0];
  if (0 == (1 & e)) return 0;
  var t = 3 & e;
  return (t = (t = (t = (t = t * (2 - (15 & e) * t) & 15) * (2 - (255 & e) * t) & 255) * (2 - ((65535 & e) * t & 65535)) & 65535) * (2 - e * t % this.DV) % this.DV) > 0 ? this.DV - t : -t;
};
o.prototype.isEven = function () {
  return 0 == (this.t > 0 ? 1 & this.data[0] : this.s);
};
o.prototype.exp = function (e, t) {
  if (e > 4294967295 || e < 1) return o.ONE;
  var n = s();
  var r = s();
  var i = t.convert(this);
  var a = f(e) - 1;
  for (i.copyTo(n); --a >= 0;) {
    t.sqrTo(n, r);
    if ((e & 1 << a) > 0) t.mulTo(r, i, n);else {
      var c = n;
      n = r;
      r = c;
    }
  }
  return t.revert(n);
};
o.prototype.toString = function (e) {
  if (this.s < 0) return "-" + this.negate().toString(e);
  var t;
  if (16 == e) t = 4;else if (8 == e) t = 3;else if (2 == e) t = 1;else if (32 == e) t = 5;else {
    if (4 != e) return this.toRadix(e);
    t = 2;
  }
  var n;
  var r = (1 << t) - 1;
  var i = !1;
  var o = "";
  var s = this.t;
  var a = this.DB - s * this.DB % t;
  if (s-- > 0) for (a < this.DB && (n = this.data[s] >> a) > 0 && (i = !0, o = p(n)); s >= 0;) {
    if (a < t) {
      n = (this.data[s] & (1 << a) - 1) << t - a;
      n |= this.data[--s] >> (a += this.DB - t);
    } else {
      n = this.data[s] >> (a -= t) & r;
      if (a <= 0) {
        a += this.DB;
        --s;
      }
    }
    if (n > 0) {
      i = !0;
    }
    if (i) {
      o += p(n);
    }
  }
  return i ? o : "0";
};
o.prototype.negate = function () {
  var e = s();
  o.ZERO.subTo(this, e);
  return e;
};
o.prototype.abs = function () {
  return this.s < 0 ? this.negate() : this;
};
o.prototype.compareTo = function (e) {
  var t = this.s - e.s;
  if (0 != t) return t;
  var n = this.t;
  if (0 != (t = n - e.t)) return this.s < 0 ? -t : t;
  for (; --n >= 0;) if (0 != (t = this.data[n] - e.data[n])) return t;
  return 0;
};
o.prototype.bitLength = function () {
  return this.t <= 0 ? 0 : this.DB * (this.t - 1) + f(this.data[this.t - 1] ^ this.s & this.DM);
};
o.prototype.mod = function (e) {
  var t = s();
  this.abs().divRemTo(e, null, t);
  if (this.s < 0 && t.compareTo(o.ZERO) > 0) {
    e.subTo(t, t);
  }
  return t;
};
o.prototype.modPowInt = function (e, t) {
  var n;
  n = e < 256 || t.isEven() ? new m(t) : new g(t);
  return this.exp(e, n);
};
o.ZERO = h(0);
o.ONE = h(1);
T.prototype.convert = S;
T.prototype.revert = S;
T.prototype.mulTo = function (e, t, n) {
  e.multiplyTo(t, n);
};
T.prototype.sqrTo = function (e, t) {
  e.squareTo(t);
};
x.prototype.convert = function (e) {
  if (e.s < 0 || e.t > 2 * this.m.t) return e.mod(this.m);
  if (e.compareTo(this.m) < 0) return e;
  var t = s();
  e.copyTo(t);
  this.reduce(t);
  return t;
};
x.prototype.revert = function (e) {
  return e;
};
x.prototype.reduce = function (e) {
  for (e.drShiftTo(this.m.t - 1, this.r2), e.t > this.m.t + 1 && (e.t = this.m.t + 1, e.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); e.compareTo(this.r2) < 0;) e.dAddOffset(1, this.m.t + 1);
  for (e.subTo(this.r2, e); e.compareTo(this.m) >= 0;) e.subTo(this.m, e);
};
x.prototype.mulTo = function (e, t, n) {
  e.multiplyTo(t, n);
  this.reduce(n);
};
x.prototype.sqrTo = function (e, t) {
  e.squareTo(t);
  this.reduce(t);
};
var C = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
var I = (1 << 26) / C[C.length - 1];
o.prototype.chunkSize = function (e) {
  return Math.floor(Math.LN2 * this.DB / Math.log(e));
};
o.prototype.toRadix = function (e) {
  if (null == e) {
    e = 10;
  }
  if (0 == this.signum() || e < 2 || e > 36) return "0";
  var t = this.chunkSize(e);
  var n = Math.pow(e, t);
  var r = h(n);
  var i = s();
  var o = s();
  var a = "";
  for (this.divRemTo(r, i, o); i.signum() > 0;) {
    a = (n + o.intValue()).toString(e).substr(1) + a;
    i.divRemTo(r, i, o);
  }
  return o.intValue().toString(e) + a;
};
o.prototype.fromRadix = function (e, t) {
  this.fromInt(0);
  if (null == t) {
    t = 10;
  }
  for (n = this.chunkSize(t), r = Math.pow(t, n), i = !1, s = 0, a = 0, c = 0, void 0; c < e.length; ++c) {
    var n;
    var r;
    var i;
    var s;
    var a;
    var c;
    var l = d(e, c);
    if (l < 0) {
      if ("-" == e.charAt(c) && 0 == this.signum()) {
        i = !0;
      }
    } else {
      a = t * a + l;
      if (++s >= n) {
        this.dMultiply(r);
        this.dAddOffset(a, 0);
        s = 0;
        a = 0;
      }
    }
  }
  if (s > 0) {
    this.dMultiply(Math.pow(t, s));
    this.dAddOffset(a, 0);
  }
  if (i) {
    o.ZERO.subTo(this, this);
  }
};
o.prototype.fromNumber = function (e, t, n) {
  if ("number" == typeof t) {
    if (e < 2) this.fromInt(1);else for (this.fromNumber(e, n), this.testBit(e - 1) || this.bitwiseTo(o.ONE.shiftLeft(e - 1), _, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(t);) {
      this.dAddOffset(2, 0);
      if (this.bitLength() > e) {
        this.subTo(o.ONE.shiftLeft(e - 1), this);
      }
    }
  } else {
    var r = new Array();
    var i = 7 & e;
    r.length = 1 + (e >> 3);
    t.nextBytes(r);
    if (i > 0) {
      r[0] &= (1 << i) - 1;
    } else {
      r[0] = 0;
    }
    this.fromString(r, 256);
  }
};
o.prototype.bitwiseTo = function (e, t, n) {
  var r;
  var i;
  var o = Math.min(e.t, this.t);
  for (r = 0; r < o; ++r) n.data[r] = t(this.data[r], e.data[r]);
  if (e.t < this.t) {
    for (i = e.s & this.DM, r = o; r < this.t; ++r) n.data[r] = t(this.data[r], i);
    n.t = this.t;
  } else {
    for (i = this.s & this.DM, r = o; r < e.t; ++r) n.data[r] = t(i, e.data[r]);
    n.t = e.t;
  }
  n.s = t(this.s, e.s);
  n.clamp();
};
o.prototype.changeBit = function (e, t) {
  var n = o.ONE.shiftLeft(e);
  this.bitwiseTo(n, t, n);
  return n;
};
o.prototype.addTo = function (e, t) {
  for (n = 0, r = 0, i = Math.min(e.t, this.t), void 0; n < i;) {
    var n;
    var r;
    var i;
    r += this.data[n] + e.data[n];
    t.data[n++] = r & this.DM;
    r >>= this.DB;
  }
  if (e.t < this.t) {
    for (r += e.s; n < this.t;) {
      r += this.data[n];
      t.data[n++] = r & this.DM;
      r >>= this.DB;
    }
    r += this.s;
  } else {
    for (r += this.s; n < e.t;) {
      r += e.data[n];
      t.data[n++] = r & this.DM;
      r >>= this.DB;
    }
    r += e.s;
  }
  t.s = r < 0 ? -1 : 0;
  if (r > 0) {
    t.data[n++] = r;
  } else {
    if (r < -1) {
      t.data[n++] = this.DV + r;
    }
  }
  t.t = n;
  t.clamp();
};
o.prototype.dMultiply = function (e) {
  this.data[this.t] = this.am(0, e - 1, this, 0, 0, this.t);
  ++this.t;
  this.clamp();
};
o.prototype.dAddOffset = function (e, t) {
  if (0 != e) {
    for (; this.t <= t;) this.data[this.t++] = 0;
    for (this.data[t] += e; this.data[t] >= this.DV;) {
      this.data[t] -= this.DV;
      if (++t >= this.t) {
        this.data[this.t++] = 0;
      }
      ++this.data[t];
    }
  }
};
o.prototype.multiplyLowerTo = function (e, t, n) {
  var r;
  var i = Math.min(this.t + e.t, t);
  for (n.s = 0, n.t = i; i > 0;) n.data[--i] = 0;
  for (r = n.t - this.t; i < r; ++i) n.data[i + this.t] = this.am(0, e.data[i], n, i, 0, this.t);
  for (r = Math.min(e.t, t); i < r; ++i) this.am(0, e.data[i], n, i, 0, t - i);
  n.clamp();
};
o.prototype.multiplyUpperTo = function (e, t, n) {
  --t;
  var r = n.t = this.t + e.t - t;
  for (n.s = 0; --r >= 0;) n.data[r] = 0;
  for (r = Math.max(t - this.t, 0); r < e.t; ++r) n.data[this.t + r - t] = this.am(t - r, e.data[r], n, 0, 0, this.t + r - t);
  n.clamp();
  n.drShiftTo(1, n);
};
o.prototype.modInt = function (e) {
  if (e <= 0) return 0;
  var t = this.DV % e;
  var n = this.s < 0 ? e - 1 : 0;
  if (this.t > 0) if (0 == t) n = this.data[0] % e;else for (var r = this.t - 1; r >= 0; --r) n = (t * n + this.data[r]) % e;
  return n;
};
o.prototype.millerRabin = function (e) {
  var t = this.subtract(o.ONE);
  var n = t.getLowestSetBit();
  if (n <= 0) return !1;
  for (i = t.shiftRight(n), s = {
    nextBytes: function (e) {
      for (var t = 0; t < e.length; ++t) e[t] = Math.floor(256 * Math.random());
    }
  }, a = 0, void 0; a < e; ++a) {
    var r;
    var i;
    var s;
    var a;
    do {
      r = new o(this.bitLength(), s);
    } while (r.compareTo(o.ONE) <= 0 || r.compareTo(t) >= 0);
    var c = r.modPow(i, this);
    if (0 != c.compareTo(o.ONE) && 0 != c.compareTo(t)) {
      for (var l = 1; l++ < n && 0 != c.compareTo(t);) if (0 == (c = c.modPowInt(2, this)).compareTo(o.ONE)) return !1;
      if (0 != c.compareTo(t)) return !1;
    }
  }
  return !0;
};
o.prototype.clone = function () {
  var e = s();
  this.copyTo(e);
  return e;
};
o.prototype.intValue = function () {
  if (this.s < 0) {
    if (1 == this.t) return this.data[0] - this.DV;
    if (0 == this.t) return -1;
  } else {
    if (1 == this.t) return this.data[0];
    if (0 == this.t) return 0;
  }
  return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0];
};
o.prototype.byteValue = function () {
  return 0 == this.t ? this.s : this.data[0] << 24 >> 24;
};
o.prototype.shortValue = function () {
  return 0 == this.t ? this.s : this.data[0] << 16 >> 16;
};
o.prototype.signum = function () {
  return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this.data[0] <= 0 ? 0 : 1;
};
o.prototype.toByteArray = function () {
  var e = this.t;
  var t = new Array();
  t[0] = this.s;
  var n;
  var r = this.DB - e * this.DB % 8;
  var i = 0;
  if (e-- > 0) for (r < this.DB && (n = this.data[e] >> r) != (this.s & this.DM) >> r && (t[i++] = n | this.s << this.DB - r); e >= 0;) {
    if (r < 8) {
      n = (this.data[e] & (1 << r) - 1) << 8 - r;
      n |= this.data[--e] >> (r += this.DB - 8);
    } else {
      n = this.data[e] >> (r -= 8) & 255;
      if (r <= 0) {
        r += this.DB;
        --e;
      }
    }
    if (0 != (128 & n)) {
      n |= -256;
    }
    if (0 == i && (128 & this.s) != (128 & n)) {
      ++i;
    }
    if (i > 0 || n != this.s) {
      t[i++] = n;
    }
  }
  return t;
};
o.prototype.equals = function (e) {
  return 0 == this.compareTo(e);
};
o.prototype.min = function (e) {
  return this.compareTo(e) < 0 ? this : e;
};
o.prototype.max = function (e) {
  return this.compareTo(e) > 0 ? this : e;
};
o.prototype.and = function (e) {
  var t = s();
  this.bitwiseTo(e, y, t);
  return t;
};
o.prototype.or = function (e) {
  var t = s();
  this.bitwiseTo(e, _, t);
  return t;
};
o.prototype.xor = function (e) {
  var t = s();
  this.bitwiseTo(e, v, t);
  return t;
};
o.prototype.andNot = function (e) {
  var t = s();
  this.bitwiseTo(e, b, t);
  return t;
};
o.prototype.not = function () {
  for (e = s(), t = 0, void 0; t < this.t; ++t) {
    var e;
    var t;
    e.data[t] = this.DM & ~this.data[t];
  }
  e.t = this.t;
  e.s = ~this.s;
  return e;
};
o.prototype.shiftLeft = function (e) {
  var t = s();
  if (e < 0) {
    this.rShiftTo(-e, t);
  } else {
    this.lShiftTo(e, t);
  }
  return t;
};
o.prototype.shiftRight = function (e) {
  var t = s();
  if (e < 0) {
    this.lShiftTo(-e, t);
  } else {
    this.rShiftTo(e, t);
  }
  return t;
};
o.prototype.getLowestSetBit = function () {
  for (var e = 0; e < this.t; ++e) if (0 != this.data[e]) return e * this.DB + E(this.data[e]);
  return this.s < 0 ? this.t * this.DB : -1;
};
o.prototype.bitCount = function () {
  for (e = 0, t = this.s & this.DM, n = 0, void 0; n < this.t; ++n) {
    var e;
    var t;
    var n;
    e += w(this.data[n] ^ t);
  }
  return e;
};
o.prototype.testBit = function (e) {
  var t = Math.floor(e / this.DB);
  return t >= this.t ? 0 != this.s : 0 != (this.data[t] & 1 << e % this.DB);
};
o.prototype.setBit = function (e) {
  return this.changeBit(e, _);
};
o.prototype.clearBit = function (e) {
  return this.changeBit(e, b);
};
o.prototype.flipBit = function (e) {
  return this.changeBit(e, v);
};
o.prototype.add = function (e) {
  var t = s();
  this.addTo(e, t);
  return t;
};
o.prototype.subtract = function (e) {
  var t = s();
  this.subTo(e, t);
  return t;
};
o.prototype.multiply = function (e) {
  var t = s();
  this.multiplyTo(e, t);
  return t;
};
o.prototype.divide = function (e) {
  var t = s();
  this.divRemTo(e, t, null);
  return t;
};
o.prototype.remainder = function (e) {
  var t = s();
  this.divRemTo(e, null, t);
  return t;
};
o.prototype.divideAndRemainder = function (e) {
  var t = s();
  var n = s();
  this.divRemTo(e, t, n);
  return new Array(t, n);
};
o.prototype.modPow = function (e, t) {
  var n;
  var r;
  var i = e.bitLength();
  var o = h(1);
  if (i <= 0) return o;
  n = i < 18 ? 1 : i < 48 ? 3 : i < 144 ? 4 : i < 768 ? 5 : 6;
  r = i < 8 ? new m(t) : t.isEven() ? new x(t) : new g(t);
  var a = new Array();
  var c = 3;
  var l = n - 1;
  var u = (1 << n) - 1;
  a[1] = r.convert(this);
  if (n > 1) {
    var p = s();
    for (r.sqrTo(a[1], p); c <= u;) a[c] = s(), r.mulTo(p, a[c - 2], a[c]), c += 2;
  }
  var d;
  var y;
  var _ = e.t - 1;
  var v = !0;
  var b = s();
  for (i = f(e.data[_]) - 1; _ >= 0;) {
    for (i >= l ? d = e.data[_] >> i - l & u : (d = (e.data[_] & (1 << i + 1) - 1) << l - i, _ > 0 && (d |= e.data[_ - 1] >> this.DB + i - l)), c = n; 0 == (1 & d);) {
      d >>= 1;
      --c;
    }
    if ((i -= c) < 0) {
      i += this.DB;
      --_;
    }
    if (v) a[d].copyTo(o), v = !1;else {
      for (; c > 1;) r.sqrTo(o, b), r.sqrTo(b, o), c -= 2;
      c > 0 ? r.sqrTo(o, b) : (y = o, o = b, b = y), r.mulTo(b, a[d], o);
    }
    for (; _ >= 0 && 0 == (e.data[_] & 1 << i);) {
      r.sqrTo(o, b);
      y = o;
      o = b;
      b = y;
      if (--i < 0) {
        i = this.DB - 1;
        --_;
      }
    }
  }
  return r.revert(o);
};
o.prototype.modInverse = function (e) {
  var t = e.isEven();
  if (this.isEven() && t || 0 == e.signum()) return o.ZERO;
  for (n = e.clone(), r = this.clone(), i = h(1), s = h(0), a = h(0), c = h(1), void 0; 0 != n.signum();) {
    var n;
    var r;
    var i;
    var s;
    var a;
    var c;
    for (; n.isEven();) {
      n.rShiftTo(1, n);
      if (t) {
        if (i.isEven() && s.isEven()) {
          i.addTo(this, i);
          s.subTo(e, s);
        }
        i.rShiftTo(1, i);
      } else {
        if (s.isEven()) {
          s.subTo(e, s);
        }
      }
      s.rShiftTo(1, s);
    }
    for (; r.isEven();) {
      r.rShiftTo(1, r);
      if (t) {
        if (a.isEven() && c.isEven()) {
          a.addTo(this, a);
          c.subTo(e, c);
        }
        a.rShiftTo(1, a);
      } else {
        if (c.isEven()) {
          c.subTo(e, c);
        }
      }
      c.rShiftTo(1, c);
    }
    if (n.compareTo(r) >= 0) {
      n.subTo(r, n);
      if (t) {
        i.subTo(a, i);
      }
      s.subTo(c, s);
    } else {
      r.subTo(n, r);
      if (t) {
        a.subTo(i, a);
      }
      c.subTo(s, c);
    }
  }
  return 0 != r.compareTo(o.ONE) ? o.ZERO : c.compareTo(e) >= 0 ? c.subtract(e) : c.signum() < 0 ? (c.addTo(e, c), c.signum() < 0 ? c.add(e) : c) : c;
};
o.prototype.pow = function (e) {
  return this.exp(e, new T());
};
o.prototype.gcd = function (e) {
  var t = this.s < 0 ? this.negate() : this.clone();
  var n = e.s < 0 ? e.negate() : e.clone();
  if (t.compareTo(n) < 0) {
    var r = t;
    t = n;
    n = r;
  }
  var i = t.getLowestSetBit();
  var o = n.getLowestSetBit();
  if (o < 0) return t;
  for (i < o && (o = i), o > 0 && (t.rShiftTo(o, t), n.rShiftTo(o, n)); t.signum() > 0;) {
    if ((i = t.getLowestSetBit()) > 0) {
      t.rShiftTo(i, t);
    }
    if ((i = n.getLowestSetBit()) > 0) {
      n.rShiftTo(i, n);
    }
    if (t.compareTo(n) >= 0) {
      t.subTo(n, t);
      t.rShiftTo(1, t);
    } else {
      n.subTo(t, n);
      n.rShiftTo(1, n);
    }
  }
  if (o > 0) {
    n.lShiftTo(o, n);
  }
  return n;
};
o.prototype.isProbablePrime = function (e) {
  var t;
  var n = this.abs();
  if (1 == n.t && n.data[0] <= C[C.length - 1]) {
    for (t = 0; t < C.length; ++t) if (n.data[0] == C[t]) return !0;
    return !1;
  }
  if (n.isEven()) return !1;
  for (t = 1; t < C.length;) {
    for (r = C[t], i = t + 1, void 0; i < C.length && r < I;) {
      var r;
      var i;
      r *= C[i++];
    }
    for (r = n.modInt(r); t < i;) if (r % C[t++] == 0) return !1;
  }
  return n.millerRabin(e);
};