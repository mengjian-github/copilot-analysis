require.d(exports, {
  C3: () => l,
  FX: () => c,
  j_: () => p,
  jf: () => d
});
var r = require(52210);
var i = require(97228);
var o = require(68726);
var s = require(98397);
var a = require(59598);
var c = "traceparent";
var l = "tracestate";
var u = new RegExp("^\\s?((?!ff)[\\da-f]{2})-((?![0]{32})[\\da-f]{32})-((?![0]{16})[\\da-f]{16})-([\\da-f]{2})(-.*)?\\s?$");
function p(e) {
  var t = u.exec(e);
  return t ? "00" === t[1] && t[5] ? null : {
    traceId: t[2],
    spanId: t[3],
    traceFlags: parseInt(t[4], 16)
  } : null;
}
var d = function () {
  function e() {}
  e.prototype.inject = function (e, t, n) {
    var a = r.g.getSpanContext(e);
    if (a && !s.Ll(e) && i.BM(a)) {
      var u = "00-" + a.traceId + "-" + a.spanId + "-0" + Number(a.traceFlags || o.r.NONE).toString(16);
      n.set(t, c, u);
      if (a.traceState) {
        n.set(t, l, a.traceState.serialize());
      }
    }
  };
  e.prototype.extract = function (e, t, n) {
    var i = n.get(t, c);
    if (!i) return e;
    var o = Array.isArray(i) ? i[0] : i;
    if ("string" != typeof o) return e;
    var s = p(o);
    if (!s) return e;
    s.isRemote = !0;
    var u = n.get(t, l);
    if (u) {
      var d = Array.isArray(u) ? u.join(",") : u;
      s.traceState = new a.n("string" == typeof d ? d : void 0);
    }
    return r.g.setSpanContext(e, s);
  };
  e.prototype.fields = function () {
    return [c, l];
  };
  return e;
}();