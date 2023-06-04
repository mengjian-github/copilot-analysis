var r = require(3832);
require(97116);
require(49563);
require(15764);
module.exports = r.kem = r.kem || {};
var i = r.jsbn.BigInteger;
function o(e, t, n, i) {
  e.generate = function (e, o) {
    for (s = new r.util.ByteBuffer(), a = Math.ceil(o / i) + n, c = new r.util.ByteBuffer(), l = n, void 0; l < a; ++l) {
      var s;
      var a;
      var c;
      var l;
      c.putInt32(l);
      t.start();
      t.update(e + c.getBytes());
      var u = t.digest();
      s.putBytes(u.getBytes(i));
    }
    s.truncate(s.length() - o);
    return s.getBytes();
  };
}
r.kem.rsa = {};
r.kem.rsa.create = function (e, t) {
  var n = (t = t || {}).prng || r.random;
  return {
    encrypt: function (t, o) {
      var s;
      var a = Math.ceil(t.n.bitLength() / 8);
      do {
        s = new i(r.util.bytesToHex(n.getBytesSync(a)), 16).mod(t.n);
      } while (s.compareTo(i.ONE) <= 0);
      var c = a - (s = r.util.hexToBytes(s.toString(16))).length;
      if (c > 0) {
        s = r.util.fillString(String.fromCharCode(0), c) + s;
      }
      return {
        encapsulation: t.encrypt(s, "NONE"),
        key: e.generate(s, o)
      };
    },
    decrypt: function (t, n, r) {
      var i = t.decrypt(n, "NONE");
      return e.generate(i, r);
    }
  };
};
r.kem.kdf1 = function (e, t) {
  o(this, e, 0, t || e.digestLength);
};
r.kem.kdf2 = function (e, t) {
  o(this, e, 1, t || e.digestLength);
};