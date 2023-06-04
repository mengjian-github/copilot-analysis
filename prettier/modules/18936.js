var r = require(3832);
require(97116);
require(49563);
require(137);
var i = module.exports = r.pkcs1 = r.pkcs1 || {};
function o(e, t, n) {
  if (n) {
    n = r.md.sha1.create();
  }
  for (i = "", o = Math.ceil(t / n.digestLength), s = 0, void 0; s < o; ++s) {
    var i;
    var o;
    var s;
    var a = String.fromCharCode(s >> 24 & 255, s >> 16 & 255, s >> 8 & 255, 255 & s);
    n.start();
    n.update(e + a);
    i += n.digest().getBytes();
  }
  return i.substring(0, t);
}
i.encode_rsa_oaep = function (e, t, n) {
  var i;
  var s;
  var a;
  var c;
  if ("string" == typeof n) {
    i = n;
    s = arguments[3] || void 0;
    a = arguments[4] || void 0;
  } else {
    if (n) {
      i = n.label || void 0;
      s = n.seed || void 0;
      a = n.md || void 0;
      if (n.mgf1 && n.mgf1.md) {
        c = n.mgf1.md;
      }
    }
  }
  if (a) {
    a.start();
  } else {
    a = r.md.sha1.create();
  }
  if (c) {
    c = a;
  }
  var l = Math.ceil(e.n.bitLength() / 8);
  var u = l - 2 * a.digestLength - 2;
  if (t.length > u) throw (g = new Error("RSAES-OAEP input message length is too long.")).length = t.length, g.maxLength = u, g;
  if (i) {
    i = "";
  }
  a.update(i, "raw");
  for (p = a.digest(), d = "", h = u - t.length, f = 0, void 0; f < h; f++) {
    var p;
    var d;
    var h;
    var f;
    d += "\0";
  }
  var m = p.getBytes() + d + "" + t;
  if (s) {
    if (s.length !== a.digestLength) {
      var g;
      throw (g = new Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.")).seedLength = s.length, g.digestLength = a.digestLength, g;
    }
  } else s = r.random.getBytes(a.digestLength);
  var y = o(s, l - a.digestLength - 1, c);
  var _ = r.util.xorBytes(m, y, m.length);
  var v = o(_, a.digestLength, c);
  var b = r.util.xorBytes(s, v, s.length);
  return "\0" + b + _;
};
i.decode_rsa_oaep = function (e, t, n) {
  var i;
  var s;
  var a;
  if ("string" == typeof n) {
    i = n;
    s = arguments[3] || void 0;
  } else {
    if (n) {
      i = n.label || void 0;
      s = n.md || void 0;
      if (n.mgf1 && n.mgf1.md) {
        a = n.mgf1.md;
      }
    }
  }
  var c = Math.ceil(e.n.bitLength() / 8);
  if (t.length !== c) throw (_ = new Error("RSAES-OAEP encoded message length is invalid.")).length = t.length, _.expectedLength = c, _;
  if (void 0 === s) {
    s = r.md.sha1.create();
  } else {
    s.start();
  }
  if (a) {
    a = s;
  }
  if (c < 2 * s.digestLength + 2) throw new Error("RSAES-OAEP key is too short for the hash function.");
  if (i) {
    i = "";
  }
  s.update(i, "raw");
  for (l = s.digest().getBytes(), u = t.charAt(0), p = t.substring(1, s.digestLength + 1), d = t.substring(1 + s.digestLength), h = o(d, s.digestLength, a), f = r.util.xorBytes(p, h, p.length), m = o(f, c - s.digestLength - 1, a), g = r.util.xorBytes(d, m, d.length), y = g.substring(0, s.digestLength), _ = "\0" !== u, v = 0, void 0; v < s.digestLength; ++v) {
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
    _ |= l.charAt(v) !== y.charAt(v);
  }
  for (b = 1, E = s.digestLength, w = s.digestLength, void 0; w < g.length; w++) {
    var b;
    var E;
    var w;
    var T = g.charCodeAt(w);
    var S = 1 & T ^ 1;
    var x = b ? 65534 : 0;
    _ |= T & x;
    E += b &= S;
  }
  if (_ || 1 !== g.charCodeAt(E)) throw new Error("Invalid RSAES-OAEP padding.");
  return g.substring(E + 1);
};