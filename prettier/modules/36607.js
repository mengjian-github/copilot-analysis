var r = require(3832);
require(28991);
require(97116);
(module.exports = r.hmac = r.hmac || {}).create = function () {
  var e = null;
  var t = null;
  var n = null;
  var i = null;
  var o = {
    start: function (o, s) {
      if (null !== o) if ("string" == typeof o) {
        if (!((o = o.toLowerCase()) in r.md.algorithms)) throw new Error('Unknown hash algorithm "' + o + '"');
        t = r.md.algorithms[o].create();
      } else t = o;
      if (null === s) s = e;else {
        if ("string" == typeof s) s = r.util.createBuffer(s);else if (r.util.isArray(s)) {
          var a = s;
          s = r.util.createBuffer();
          for (var c = 0; c < a.length; ++c) s.putByte(a[c]);
        }
        var l = s.length();
        for (l > t.blockLength && (t.start(), t.update(s.bytes()), s = t.digest()), n = r.util.createBuffer(), i = r.util.createBuffer(), l = s.length(), c = 0; c < l; ++c) {
          a = s.at(c);
          n.putByte(54 ^ a);
          i.putByte(92 ^ a);
        }
        if (l < t.blockLength) for (a = t.blockLength - l, c = 0; c < a; ++c) {
          n.putByte(54);
          i.putByte(92);
        }
        e = s;
        n = n.bytes();
        i = i.bytes();
      }
      t.start();
      t.update(n);
    },
    update: function (e) {
      t.update(e);
    },
    getMac: function () {
      var e = t.digest().bytes();
      t.start();
      t.update(i);
      t.update(e);
      return t.digest();
    }
  };
  o.digest = o.getMac;
  return o;
};