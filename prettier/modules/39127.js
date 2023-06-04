require.d(exports, {
  E: () => c
});
var r = require(7150);
var i = require(73557);
var o = require(97817);
var s = require(97228);
var a = r.c.getInstance();
var c = function () {
  function e() {}
  e.prototype.startSpan = function (e, t, n) {
    if (void 0 === n) {
      n = a.active();
    }
    if (Boolean(null == t ? void 0 : t.root)) return new o.s();
    var r;
    var c = n && i.A3(n);
    return "object" == typeof (r = c) && "string" == typeof r.spanId && "string" == typeof r.traceId && "number" == typeof r.traceFlags && s.BM(c) ? new o.s(c) : new o.s();
  };
  e.prototype.startActiveSpan = function (e, t, n, r) {
    var o;
    var s;
    var c;
    if (!(arguments.length < 2)) {
      if (2 === arguments.length) {
        c = t;
      } else {
        if (3 === arguments.length) {
          o = t;
          c = n;
        } else {
          o = t;
          s = n;
          c = r;
        }
      }
      var l = null != s ? s : a.active();
      var u = this.startSpan(e, o, l);
      var p = i.WZ(l, u);
      return a.with(p, c, void 0, u);
    }
  };
  return e;
}();