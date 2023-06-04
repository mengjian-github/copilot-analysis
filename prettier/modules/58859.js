Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.bunyan = void 0;
var r = require(84953);
exports.bunyan = {
  versionSpecifier: ">= 1.0.0 < 2.0.0",
  patch: function (e) {
    var t = e.prototype._emit;
    e.prototype._emit = function (e, n) {
      var i = t.apply(this, arguments);
      if (!n) {
        var o = i;
        if (o) {
          o = t.call(this, e, !0);
        }
        r.channel.publish("bunyan", {
          level: e.level,
          result: o
        });
      }
      return i;
    };
    return e;
  }
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("bunyan", exports.bunyan);
};