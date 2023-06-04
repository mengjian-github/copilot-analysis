var r = require(3832);
require(8925);
require(41668);
require(74933);
require(97116);
if (r.random && r.random.getBytes) {
  module.exports = r.random;
} else {
  (function (t) {
    var n = {};
    var i = new Array(4);
    var o = r.util.createBuffer();
    function s() {
      var e = r.prng.create(n);
      e.getBytes = function (t, n) {
        return e.generate(t, n);
      };
      e.getBytesSync = function (t) {
        return e.generate(t);
      };
      return e;
    }
    n.formatKey = function (e) {
      var t = r.util.createBuffer(e);
      (e = new Array(4))[0] = t.getInt32();
      e[1] = t.getInt32();
      e[2] = t.getInt32();
      e[3] = t.getInt32();
      return r.aes._expandKey(e, !1);
    };
    n.formatSeed = function (e) {
      var t = r.util.createBuffer(e);
      (e = new Array(4))[0] = t.getInt32();
      e[1] = t.getInt32();
      e[2] = t.getInt32();
      e[3] = t.getInt32();
      return e;
    };
    n.cipher = function (e, t) {
      r.aes._updateBlock(e, t, i, !1);
      o.putInt32(i[0]);
      o.putInt32(i[1]);
      o.putInt32(i[2]);
      o.putInt32(i[3]);
      return o.getBytes();
    };
    n.increment = function (e) {
      ++e[3];
      return e;
    };
    n.md = r.md.sha256;
    var a = s();
    var c = null;
    var l = r.util.globalScope;
    var u = l.crypto || l.msCrypto;
    if (u && u.getRandomValues) {
      c = function (e) {
        return u.getRandomValues(e);
      };
    }
    if (r.options.usePureJavaScript || !r.util.isNodejs && !c) {
      if ("undefined" == typeof window || window.document, a.collectInt(+new Date(), 32), "undefined" != typeof navigator) {
        var p = "";
        for (var d in navigator) try {
          "string" == typeof navigator[d] && (p += navigator[d]);
        } catch (e) {}
        a.collect(p), p = null;
      }
      t && (t().mousemove(function (e) {
        a.collectInt(e.clientX, 16), a.collectInt(e.clientY, 16);
      }), t().keypress(function (e) {
        a.collectInt(e.charCode, 8);
      }));
    }
    if (r.random) for (var d in a) r.random[d] = a[d];else r.random = a;
    r.random.createInstance = s;
    module.exports = r.random;
  })("undefined" != typeof jQuery ? jQuery : null);
}