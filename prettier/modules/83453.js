var r = require(3832);
require(97116);
r.mgf = r.mgf || {};
(module.exports = r.mgf.mgf1 = r.mgf1 = r.mgf1 || {}).create = function (e) {
  return {
    generate: function (t, n) {
      for (i = new r.util.ByteBuffer(), o = Math.ceil(n / e.digestLength), s = 0, void 0; s < o; s++) {
        var i;
        var o;
        var s;
        var a = new r.util.ByteBuffer();
        a.putInt32(s);
        e.start();
        e.update(t + a.getBytes());
        i.putBuffer(e.digest());
      }
      i.truncate(i.length() - n);
      return i.getBytes();
    }
  };
};