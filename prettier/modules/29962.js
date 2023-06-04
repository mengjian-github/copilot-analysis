var r = require(25740);
var i = function () {
  function e() {}
  e.queryCorrelationId = function (e, t) {};
  e.cancelCorrelationIdQuery = function (e, t) {};
  e.generateRequestId = function (t) {
    if (t) {
      if ("." !== (t = "|" == t[0] ? t : "|" + t)[t.length - 1]) {
        t += ".";
      }
      var n = (e.currentRootId++).toString(16);
      return e.appendSuffix(t, n, "_");
    }
    return e.generateRootId();
  };
  e.getRootId = function (e) {
    var t = e.indexOf(".");
    if (t < 0) {
      t = e.length;
    }
    var n = "|" === e[0] ? 1 : 0;
    return e.substring(n, t);
  };
  e.generateRootId = function () {
    return "|" + r.w3cTraceId() + ".";
  };
  e.appendSuffix = function (t, n, i) {
    if (t.length + n.length < e.requestIdMaxLength) return t + n + i;
    var o = e.requestIdMaxLength - 9;
    if (t.length > o) for (; o > 1; --o) {
      var s = t[o - 1];
      if ("." === s || "_" === s) break;
    }
    if (o <= 1) return e.generateRootId();
    for (n = r.randomu32().toString(16); n.length < 8;) n = "0" + n;
    return t.substring(0, o) + n + "#";
  };
  e.correlationIdPrefix = "cid-v1:";
  e.w3cEnabled = !0;
  e.HTTP_TIMEOUT = 2500;
  e.requestIdMaxLength = 1024;
  e.currentRootId = r.randomu32();
  return e;
}();
module.exports = i;