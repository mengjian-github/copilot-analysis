require.d(exports, {
  T: () => i
});
var r = new (require(39127).E)();
var i = function () {
  function e(e, t, n, r) {
    this._provider = e;
    this.name = t;
    this.version = n;
    this.options = r;
  }
  e.prototype.startSpan = function (e, t, n) {
    return this._getTracer().startSpan(e, t, n);
  };
  e.prototype.startActiveSpan = function (e, t, n, r) {
    var i = this._getTracer();
    return Reflect.apply(i.startActiveSpan, i, arguments);
  };
  e.prototype._getTracer = function () {
    if (this._delegate) return this._delegate;
    var e = this._provider.getDelegateTracer(this.name, this.version, this.options);
    return e ? (this._delegate = e, this._delegate) : r;
  };
  return e;
}();