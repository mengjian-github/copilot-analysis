require.d(exports, {
  s: () => i
});
var r = require(27007);
var i = function () {
  function e(e) {
    if (void 0 === e) {
      e = r.Rr;
    }
    this._spanContext = e;
  }
  e.prototype.spanContext = function () {
    return this._spanContext;
  };
  e.prototype.setAttribute = function (e, t) {
    return this;
  };
  e.prototype.setAttributes = function (e) {
    return this;
  };
  e.prototype.addEvent = function (e, t) {
    return this;
  };
  e.prototype.setStatus = function (e) {
    return this;
  };
  e.prototype.updateName = function (e) {
    return this;
  };
  e.prototype.end = function (e) {};
  e.prototype.isRecording = function () {
    return !1;
  };
  e.prototype.recordException = function (e, t) {};
  return e;
}();