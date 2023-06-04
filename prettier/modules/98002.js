Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.mysql = void 0;
var r = require(84953);
var i = require(71017);
exports.mysql = {
  versionSpecifier: ">= 2.0.0 < 3.0.0",
  patch: function (e, t) {
    var o = function (e, t) {
      return function (t, n) {
        var i = e[t];
        if (i) {
          e[t] = function () {
            for (e = arguments.length - 1, t = arguments.length - 1, void 0; t >= 0; --t) {
              var e;
              var t;
              if ("function" == typeof arguments[t]) {
                e = t;
                break;
              }
              if (void 0 !== arguments[t]) break;
            }
            var o = arguments[e];
            var s = {
              result: null,
              startTime: null,
              startDate: null
            };
            if ("function" == typeof o) {
              if (n) {
                s.startTime = process.hrtime();
                s.startDate = new Date();
                arguments[e] = r.channel.bindToContext(n(s, o));
              } else {
                arguments[e] = r.channel.bindToContext(o);
              }
            }
            var a = i.apply(this, arguments);
            s.result = a;
            return a;
          };
        }
      };
    };
    var s = function (e, t) {
      return o(e.prototype);
    };
    var a = require(54694)(i.dirname(t) + "/lib/Connection");
    ["connect", "changeUser", "ping", "statistics", "end"].forEach(function (e) {
      return s(a)(e);
    });
    o(a)("createQuery", function (e, t) {
      return function (n) {
        var i = process.hrtime(e.startTime);
        var o = 1e3 * i[0] + i[1] / 1e6 | 0;
        r.channel.publish("mysql", {
          query: e.result,
          callbackArgs: arguments,
          err: n,
          duration: o,
          time: e.startDate
        });
        t.apply(this, arguments);
      };
    });
    var c = require(80420)(i.dirname(t) + "/lib/Pool");
    ["_enqueueCallback"].forEach(function (e) {
      return s(c)(e);
    });
    return e;
  }
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("mysql", exports.mysql);
};