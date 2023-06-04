var r = require(3832);
require(49563);
require(97116);
(module.exports = r.pss = r.pss || {}).create = function (e) {
  if (3 === arguments.length) {
    e = {
      md: arguments[0],
      mgf: arguments[1],
      saltLength: arguments[2]
    };
  }
  var t;
  var n = e.md;
  var i = e.mgf;
  var o = n.digestLength;
  var s = e.salt || null;
  if ("string" == typeof s) {
    s = r.util.createBuffer(s);
  }
  if ("saltLength" in e) t = e.saltLength;else {
    if (null === s) throw new Error("Salt length not specified or specific salt not given.");
    t = s.length();
  }
  if (null !== s && s.length() !== t) throw new Error("Given salt length does not match length of given salt.");
  var a = e.prng || r.random;
  var c = {
    encode: function (e, c) {
      var l;
      var u;
      var p = c - 1;
      var d = Math.ceil(p / 8);
      var h = e.digest().getBytes();
      if (d < o + t + 2) throw new Error("Message is too long to encrypt.");
      u = null === s ? a.getBytesSync(t) : s.bytes();
      var f = new r.util.ByteBuffer();
      f.fillWithByte(0, 8);
      f.putBytes(h);
      f.putBytes(u);
      n.start();
      n.update(f.getBytes());
      var m = n.digest().getBytes();
      var g = new r.util.ByteBuffer();
      g.fillWithByte(0, d - t - o - 2);
      g.putByte(1);
      g.putBytes(u);
      var y = g.getBytes();
      var _ = d - o - 1;
      var v = i.generate(m, _);
      var b = "";
      for (l = 0; l < _; l++) b += String.fromCharCode(y.charCodeAt(l) ^ v.charCodeAt(l));
      var E = 65280 >> 8 * d - p & 255;
      return (b = String.fromCharCode(b.charCodeAt(0) & ~E) + b.substr(1)) + m + String.fromCharCode(188);
    },
    verify: function (e, s, a) {
      var c;
      var l = a - 1;
      var u = Math.ceil(l / 8);
      s = s.substr(-u);
      if (u < o + t + 2) throw new Error("Inconsistent parameters to PSS signature verification.");
      if (188 !== s.charCodeAt(u - 1)) throw new Error("Encoded message does not end in 0xBC.");
      var p = u - o - 1;
      var d = s.substr(0, p);
      var h = s.substr(p, o);
      var f = 65280 >> 8 * u - l & 255;
      if (0 != (d.charCodeAt(0) & f)) throw new Error("Bits beyond keysize not zero as expected.");
      var m = i.generate(h, p);
      var g = "";
      for (c = 0; c < p; c++) g += String.fromCharCode(d.charCodeAt(c) ^ m.charCodeAt(c));
      g = String.fromCharCode(g.charCodeAt(0) & ~f) + g.substr(1);
      var y = u - o - t - 2;
      for (c = 0; c < y; c++) if (0 !== g.charCodeAt(c)) throw new Error("Leftmost octets not zero as expected");
      if (1 !== g.charCodeAt(y)) throw new Error("Inconsistent PSS signature, 0x01 marker not found");
      var _ = g.substr(-t);
      var v = new r.util.ByteBuffer();
      v.fillWithByte(0, 8);
      v.putBytes(e);
      v.putBytes(_);
      n.start();
      n.update(v.getBytes());
      return h === n.digest().getBytes();
    }
  };
  return c;
};