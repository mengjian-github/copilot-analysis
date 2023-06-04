var r = require(23370);
var i = function () {
  function e() {}
  e.info = function (e) {
    for (t = [], n = 1, void 0; n < arguments.length; n++) {
      var t;
      var n;
      t[n - 1] = arguments[n];
    }
    if (this.enableDebug) {
      r.getInstance().info(this.TAG + e, t);
    }
  };
  e.warn = function (e) {
    for (t = [], n = 1, void 0; n < arguments.length; n++) {
      var t;
      var n;
      t[n - 1] = arguments[n];
    }
    if (this.disableWarnings) {
      r.getInstance().warning(this.TAG + e, t);
    }
  };
  e.enableDebug = !1;
  e.disableWarnings = !1;
  e.TAG = "ApplicationInsights:";
  return e;
}();
module.exports = i;