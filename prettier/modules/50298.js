var r;
r = require(78249);
(function () {
  var e = r;
  var t = e.lib.WordArray;
  var n = e.enc;
  function i(e) {
    return e << 8 & 4278255360 | e >>> 8 & 16711935;
  }
  n.Utf16 = n.Utf16BE = {
    stringify: function (e) {
      for (t = e.words, n = e.sigBytes, r = [], i = 0, void 0; i < n; i += 2) {
        var t;
        var n;
        var r;
        var i;
        var o = t[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
        r.push(String.fromCharCode(o));
      }
      return r.join("");
    },
    parse: function (e) {
      for (n = e.length, r = [], i = 0, void 0; i < n; i++) {
        var n;
        var r;
        var i;
        r[i >>> 1] |= e.charCodeAt(i) << 16 - i % 2 * 16;
      }
      return t.create(r, 2 * n);
    }
  };
  n.Utf16LE = {
    stringify: function (e) {
      for (t = e.words, n = e.sigBytes, r = [], o = 0, void 0; o < n; o += 2) {
        var t;
        var n;
        var r;
        var o;
        var s = i(t[o >>> 2] >>> 16 - o % 4 * 8 & 65535);
        r.push(String.fromCharCode(s));
      }
      return r.join("");
    },
    parse: function (e) {
      for (n = e.length, r = [], o = 0, void 0; o < n; o++) {
        var n;
        var r;
        var o;
        r[o >>> 1] |= i(e.charCodeAt(o) << 16 - o % 2 * 16);
      }
      return t.create(r, 2 * n);
    }
  };
})();
module.exports = r.enc.Utf16;