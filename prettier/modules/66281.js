var r = require(87396);
var i = function () {
  function e(t) {
    if (e.INSTANCE) throw new Error("Console logging adapter tracking should be configured from the applicationInsights object");
    this._client = t;
    e.INSTANCE = this;
  }
  e.prototype.enable = function (e, t) {
    if (r.IsInitialized) {
      require(14309).wp(e && t, this._client);
      require(35823).wp(e, this._client);
      require(30454).wp(e, this._client);
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(!1, !1);
  };
  e._methodNames = ["debug", "info", "log", "warn", "error"];
  return e;
}();
module.exports = i;