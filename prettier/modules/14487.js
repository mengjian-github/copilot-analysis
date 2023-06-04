Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.redis = void 0;
var r = require(84953);
exports.redis = {
  versionSpecifier: ">= 2.0.0 < 4.0.0",
  patch: function (e) {
    var t = e.RedisClient.prototype.internal_send_command;
    e.RedisClient.prototype.internal_send_command = function (e) {
      if (e) {
        var n = e.callback;
        if (!n || !n.pubsubBound) {
          var i = this.address;
          var o = process.hrtime();
          var s = new Date();
          e.callback = r.channel.bindToContext(function (t, a) {
            var c = process.hrtime(o);
            var l = 1e3 * c[0] + c[1] / 1e6 | 0;
            r.channel.publish("redis", {
              duration: l,
              address: i,
              commandObj: e,
              err: t,
              result: a,
              time: s
            });
            if ("function" == typeof n) {
              n.apply(this, arguments);
            }
          });
          e.callback.pubsubBound = !0;
        }
      }
      return t.call(this, e);
    };
    return e;
  }
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("redis", exports.redis);
};