Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.console = void 0;
var r = require(84953);
var i = require(12781);
exports.console = {
  versionSpecifier: ">= 4.0.0",
  patch: function (e) {
    var t = new i.Writable();
    var n = new i.Writable();
    t.write = function (e) {
      if (!e) return !0;
      var t = e.toString();
      r.channel.publish("console", {
        message: t
      });
      return !0;
    };
    n.write = function (e) {
      if (!e) return !0;
      var t = e.toString();
      r.channel.publish("console", {
        message: t,
        stderr: !0
      });
      return !0;
    };
    for (o = new e.Console(t, n), s = function (t) {
      var n = e[t];
      if (n) {
        e[t] = function () {
          if (o[t]) try {
            o[t].apply(o, arguments);
          } catch (e) {}
          return n.apply(e, arguments);
        };
      }
    }, a = 0, c = ["log", "info", "warn", "error", "dir", "time", "timeEnd", "trace", "assert"], void 0; a < c.length; a++) {
      var o;
      var s;
      var a;
      var c;
      s(c[a]);
    }
    return e;
  }
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("console", exports.console);
  require(96206);
};