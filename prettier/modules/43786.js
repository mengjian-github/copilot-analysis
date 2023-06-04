var r;
var i;
var o;
r = require(78249);
o = (i = r).lib.WordArray;
i.enc.Base64url = {
  stringify: function (e, t = !0) {
    var n = e.words;
    var r = e.sigBytes;
    var i = t ? this._safe_map : this._map;
    e.clamp();
    for (o = [], s = 0, void 0; s < r; s += 3) {
      var o;
      var s;
      for (a = (n[s >>> 2] >>> 24 - s % 4 * 8 & 255) << 16 | (n[s + 1 >>> 2] >>> 24 - (s + 1) % 4 * 8 & 255) << 8 | n[s + 2 >>> 2] >>> 24 - (s + 2) % 4 * 8 & 255, c = 0, void 0; c < 4 && s + .75 * c < r; c++) {
        var a;
        var c;
        o.push(i.charAt(a >>> 6 * (3 - c) & 63));
      }
    }
    var l = i.charAt(64);
    if (l) for (; o.length % 4;) o.push(l);
    return o.join("");
  },
  parse: function (e, t = !0) {
    var n = e.length;
    var r = t ? this._safe_map : this._map;
    var i = this._reverseMap;
    if (!i) {
      i = this._reverseMap = [];
      for (var s = 0; s < r.length; s++) i[r.charCodeAt(s)] = s;
    }
    var a = r.charAt(64);
    if (a) {
      var c = e.indexOf(a);
      if (-1 !== c) {
        n = c;
      }
    }
    return function (e, t, n) {
      for (r = [], i = 0, s = 0, void 0; s < t; s++) {
        var r;
        var i;
        var s;
        if (s % 4) {
          var a = n[e.charCodeAt(s - 1)] << s % 4 * 2 | n[e.charCodeAt(s)] >>> 6 - s % 4 * 2;
          r[i >>> 2] |= a << 24 - i % 4 * 8;
          i++;
        }
      }
      return o.create(r, i);
    }(e, n, i);
  },
  _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
};
module.exports = r.enc.Base64url;