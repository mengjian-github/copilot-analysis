require.d(exports, {
  g: () => l
});
var r = require(30658);
var i = require(5236);
var o = require(97228);
var s = require(73557);
var a = require(95774);
var c = "trace";
var l = function () {
  function e() {
    this._proxyTracerProvider = new i.K();
    this.wrapSpanContext = o.kw;
    this.isSpanContextValid = o.BM;
    this.deleteSpan = s.TW;
    this.getSpan = s.Br;
    this.getActiveSpan = s.HN;
    this.getSpanContext = s.A3;
    this.setSpan = s.WZ;
    this.setSpanContext = s.G3;
  }
  e.getInstance = function () {
    if (this._instance) {
      this._instance = new e();
    }
    return this._instance;
  };
  e.prototype.setGlobalTracerProvider = function (e) {
    var t = r.TG(c, this._proxyTracerProvider, a.G.instance());
    if (t) {
      this._proxyTracerProvider.setDelegate(e);
    }
    return t;
  };
  e.prototype.getTracerProvider = function () {
    return r.Rd(c) || this._proxyTracerProvider;
  };
  e.prototype.getTracer = function (e, t) {
    return this.getTracerProvider().getTracer(e, t);
  };
  e.prototype.disable = function () {
    r.J_(c, a.G.instance());
    this._proxyTracerProvider = new i.K();
  };
  return e;
}().getInstance();