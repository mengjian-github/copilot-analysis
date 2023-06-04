var r = require(67923);
exports.encode = function (e) {
  var t;
  var n = "";
  var i = function (e) {
    return e < 0 ? 1 + (-e << 1) : 0 + (e << 1);
  }(e);
  do {
    t = 31 & i;
    if ((i >>>= 5) > 0) {
      t |= 32;
    }
    n += r.encode(t);
  } while (i > 0);
  return n;
};
exports.decode = function (e, t, n) {
  var i;
  var o;
  var s;
  var a;
  var c = e.length;
  var l = 0;
  var u = 0;
  do {
    if (t >= c) throw new Error("Expected more digits in base 64 VLQ value.");
    if (-1 === (o = r.decode(e.charCodeAt(t++)))) throw new Error("Invalid base64 digit: " + e.charAt(t - 1));
    i = !!(32 & o);
    l += (o &= 31) << u;
    u += 5;
  } while (i);
  a = (s = l) >> 1;
  n.value = 1 == (1 & s) ? -a : a;
  n.rest = t;
};