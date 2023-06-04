var r = this && this.__assign || function () {
  r = Object.assign || function (e) {
    for (n = 1, r = arguments.length, void 0; n < r; n++) {
      var t;
      var n;
      var r;
      for (var i in t = arguments[n]) if (Object.prototype.hasOwnProperty.call(t, i)) {
        e[i] = t[i];
      }
    }
    return e;
  };
  return r.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.tedious = void 0;
var i = require(84953);
exports.tedious = {
  versionSpecifier: ">= 6.0.0 < 9.0.0",
  patch: function (e) {
    var t = e.Connection.prototype.makeRequest;
    e.Connection.prototype.makeRequest = function () {
      function e(e) {
        var t = process.hrtime();
        var n = {
          query: {},
          database: {
            host: null,
            port: null
          },
          result: null,
          error: null,
          duration: 0
        };
        return i.channel.bindToContext(function (o, s, a) {
          var c = process.hrtime(t);
          n = r(r({}, n), {
            database: {
              host: this.connection.config.server,
              port: this.connection.config.options.port
            },
            result: !o && {
              rowCount: s,
              rows: a
            },
            query: {
              text: this.parametersByName.statement.value
            },
            error: o,
            duration: Math.ceil(1e3 * c[0] + c[1] / 1e6)
          });
          i.channel.publish("tedious", n);
          e.call(this, o, s, a);
        });
      }
      var n = arguments[0];
      arguments[0].callback = e(n.callback);
      t.apply(this, arguments);
    };
    return e;
  }
};
exports.enable = function () {
  i.channel.registerMonkeyPatch("tedious", exports.tedious);
};