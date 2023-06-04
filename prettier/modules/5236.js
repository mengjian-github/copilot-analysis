require.d(exports, {
  K: () => s
});
var r = require(69953);
var i = require(39127);
var o = new (function () {
  function e() {}
  e.prototype.getTracer = function (e, t, n) {
    return new i.E();
  };
  return e;
}())();
var s = function () {
  function e() {}
  e.prototype.getTracer = function (e, t, n) {
    var i;
    return null !== (i = this.getDelegateTracer(e, t, n)) && void 0 !== i ? i : new r.T(this, e, t, n);
  };
  e.prototype.getDelegate = function () {
    var e;
    return null !== (e = this._delegate) && void 0 !== e ? e : o;
  };
  e.prototype.setDelegate = function (e) {
    this._delegate = e;
  };
  e.prototype.getDelegateTracer = function (e, t, n) {
    var r;
    return null === (r = this._delegate) || void 0 === r ? void 0 : r.getTracer(e, t, n);
  };
  return e;
}();