require.d(exports, {
  u: () => y
});
var r = require(30658);
var i = function () {
  function e() {}
  e.prototype.inject = function (e, t) {};
  e.prototype.extract = function (e, t) {
    return e;
  };
  e.prototype.fields = function () {
    return [];
  };
  return e;
}();
var o = require(7008);
var s = require(7150);
var a = require(15834).Y("OpenTelemetry Baggage Key");
function c(e) {
  return e.getValue(a) || void 0;
}
function l() {
  return c(s.c.getInstance().active());
}
function u(e, t) {
  return e.setValue(a, t);
}
function p(e) {
  return e.deleteValue(a);
}
var d = require(92599);
var h = require(95774);
var f = "propagation";
var m = new i();
var g = function () {
  function e() {
    this.createBaggage = d.H;
    this.getBaggage = c;
    this.getActiveBaggage = l;
    this.setBaggage = u;
    this.deleteBaggage = p;
  }
  e.getInstance = function () {
    if (this._instance) {
      this._instance = new e();
    }
    return this._instance;
  };
  e.prototype.setGlobalPropagator = function (e) {
    return r.TG(f, e, h.G.instance());
  };
  e.prototype.inject = function (e, t, n) {
    if (void 0 === n) {
      n = o.M;
    }
    return this._getGlobalPropagator().inject(e, t, n);
  };
  e.prototype.extract = function (e, t, n) {
    if (void 0 === n) {
      n = o.r;
    }
    return this._getGlobalPropagator().extract(e, t, n);
  };
  e.prototype.fields = function () {
    return this._getGlobalPropagator().fields();
  };
  e.prototype.disable = function () {
    r.J_(f, h.G.instance());
  };
  e.prototype._getGlobalPropagator = function () {
    return r.Rd(f) || m;
  };
  return e;
}();
var y = g.getInstance();