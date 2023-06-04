Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.mongoCore = void 0;
var r = require(84953);
exports.mongoCore = {
  versionSpecifier: ">= 2.0.0 < 4.0.0",
  patch: function (e) {
    var t = e.Server.prototype.connect;
    e.Server.prototype.connect = function () {
      var e = t.apply(this, arguments);
      var n = this.s.pool.write;
      this.s.pool.write = function () {
        var e = "function" == typeof arguments[1] ? 1 : 2;
        if ("function" == typeof arguments[e]) {
          arguments[e] = r.channel.bindToContext(arguments[e]);
        }
        return n.apply(this, arguments);
      };
      var i = this.s.pool.logout;
      this.s.pool.logout = function () {
        if ("function" == typeof arguments[1]) {
          arguments[1] = r.channel.bindToContext(arguments[1]);
        }
        return i.apply(this, arguments);
      };
      return e;
    };
    return e;
  }
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("mongodb-core", exports.mongoCore);
};