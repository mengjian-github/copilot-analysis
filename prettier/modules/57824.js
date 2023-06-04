var t = 1e3;
var n = 60 * t;
var r = 60 * n;
var i = 24 * r;
function o(e, t, n, r) {
  var i = t >= 1.5 * n;
  return Math.round(e / n) + " " + r + (i ? "s" : "");
}
module.exports = function (e, s) {
  s = s || {};
  var a;
  var c;
  var l = typeof e;
  if ("string" === l && e.length > 0) return function (e) {
    if (!((e = String(e)).length > 100)) {
      var o = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
      if (o) {
        var s = parseFloat(o[1]);
        switch ((o[2] || "ms").toLowerCase()) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return 315576e5 * s;
          case "weeks":
          case "week":
          case "w":
            return 6048e5 * s;
          case "days":
          case "day":
          case "d":
            return s * i;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return s * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return s * n;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return s * t;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return s;
          default:
            return;
        }
      }
    }
  }(e);
  if ("number" === l && isFinite(e)) return s.long ? (a = e, (c = Math.abs(a)) >= i ? o(a, c, i, "day") : c >= r ? o(a, c, r, "hour") : c >= n ? o(a, c, n, "minute") : c >= t ? o(a, c, t, "second") : a + " ms") : function (e) {
    var o = Math.abs(e);
    return o >= i ? Math.round(e / i) + "d" : o >= r ? Math.round(e / r) + "h" : o >= n ? Math.round(e / n) + "m" : o >= t ? Math.round(e / t) + "s" : e + "ms";
  }(e);
  throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
};