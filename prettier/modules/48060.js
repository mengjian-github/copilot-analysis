Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.postgres = exports.postgres6 = void 0;
var r = require(84953);
var i = require(82361);
var o = "postgres";
exports.postgres6 = {
  versionSpecifier: "6.*",
  patch: function (e, t) {
    var n = e.Client.prototype.query;
    var s = "__diagnosticOriginalFunc";
    e.Client.prototype.query = function (e, t, a) {
      var c;
      var l = {
        query: {},
        database: {
          host: this.connectionParameters.host,
          port: this.connectionParameters.port
        },
        result: null,
        error: null,
        duration: 0,
        time: new Date()
      };
      var u = process.hrtime();
      function p(e) {
        if (e && e[s]) {
          e = e[s];
        }
        var t = r.channel.bindToContext(function (t, n) {
          var s = process.hrtime(u);
          l.result = n && {
            rowCount: n.rowCount,
            command: n.command
          };
          l.error = t;
          l.duration = Math.ceil(1e3 * s[0] + s[1] / 1e6);
          r.channel.publish(o, l);
          if (t) {
            if (e) return e.apply(this, arguments);
            c && c instanceof i.EventEmitter && c.emit("error", t);
          } else e && e.apply(this, arguments);
        });
        try {
          Object.defineProperty(t, s, {
            value: e
          });
          return t;
        } catch (t) {
          return e;
        }
      }
      try {
        if ("string" == typeof e) {
          if (t instanceof Array) {
            l.query.preparable = {
              text: e,
              args: t
            };
            a = p(a);
          } else {
            l.query.text = e;
            if (a) {
              a = p(a);
            } else {
              t = p(t);
            }
          }
        } else {
          if ("string" == typeof e.name) {
            l.query.plan = e.name;
          } else {
            if (e.values instanceof Array) {
              l.query.preparable = {
                text: e.text,
                args: e.values
              };
            } else {
              l.query.text = e.text;
            }
          }
          if (a) {
            a = p(a);
          } else {
            if (t) {
              t = p(t);
            } else {
              e.callback = p(e.callback);
            }
          }
        }
      } catch (e) {
        return n.apply(this, arguments);
      }
      arguments[0] = e;
      arguments[1] = t;
      arguments[2] = a;
      arguments.length = arguments.length > 3 ? arguments.length : 3;
      return c = n.apply(this, arguments);
    };
    return e;
  }
};
exports.postgres = {
  versionSpecifier: ">=7.* <=8.*",
  patch: function (e, t) {
    var n = e.Client.prototype.query;
    var s = "__diagnosticOriginalFunc";
    e.Client.prototype.query = function (e, t, a) {
      var c;
      var l;
      var u;
      var p = this;
      var d = !!a;
      var h = {
        query: {},
        database: {
          host: this.connectionParameters.host,
          port: this.connectionParameters.port
        },
        result: null,
        error: null,
        duration: 0,
        time: new Date()
      };
      var f = process.hrtime();
      function m(e) {
        if (e && e[s]) {
          e = e[s];
        }
        var t = r.channel.bindToContext(function (t, n) {
          var s = process.hrtime(f);
          h.result = n && {
            rowCount: n.rowCount,
            command: n.command
          };
          h.error = t;
          h.duration = Math.ceil(1e3 * s[0] + s[1] / 1e6);
          r.channel.publish(o, h);
          if (t) {
            if (e) return e.apply(this, arguments);
            u && u instanceof i.EventEmitter && u.emit("error", t);
          } else e && e.apply(this, arguments);
        });
        try {
          Object.defineProperty(t, s, {
            value: e
          });
          return t;
        } catch (t) {
          return e;
        }
      }
      try {
        if ("string" == typeof e) {
          if (t instanceof Array) {
            h.query.preparable = {
              text: e,
              args: t
            };
            a = (d = "function" == typeof a) ? m(a) : a;
          } else {
            h.query.text = e;
            if (a) {
              a = (d = "function" == typeof a) ? m(a) : a;
            } else {
              t = (d = "function" == typeof t) ? m(t) : t;
            }
          }
        } else {
          if ("string" == typeof e.name) {
            h.query.plan = e.name;
          } else {
            if (e.values instanceof Array) {
              h.query.preparable = {
                text: e.text,
                args: e.values
              };
            } else {
              if (e.cursor) {
                h.query.text = null === (c = e.cursor) || void 0 === c ? void 0 : c.text;
              } else {
                h.query.text = e.text;
              }
            }
          }
          if (a) {
            d = "function" == typeof a;
            a = m(a);
          } else {
            if (t) {
              t = (d = "function" == typeof t) ? m(t) : t;
            } else {
              d = "function" == typeof e.callback;
              e.callback = d ? m(e.callback) : e.callback;
            }
          }
        }
      } catch (e) {
        return n.apply(this, arguments);
      }
      arguments[0] = e;
      arguments[1] = t;
      arguments[2] = a;
      arguments.length = arguments.length > 3 ? arguments.length : 3;
      try {
        u = n.apply(this, arguments);
      } catch (e) {
        throw m()(e, void 0), e;
      }
      if (!d) {
        if (u instanceof Promise) return u.then(function (e) {
          m()(void 0, e);
          return new p._Promise(function (t, n) {
            t(e);
          });
        }).catch(function (e) {
          m()(e, void 0);
          return new p._Promise(function (t, n) {
            n(e);
          });
        });
        var g = u.text ? u.text : "";
        if (u.cursor) {
          g = null === (l = u.cursor) || void 0 === l ? void 0 : l.text;
        }
        if (g) {
          var y = {
            command: g,
            rowCount: 0
          };
          m()(void 0, y);
        }
      }
      return u;
    };
    return e;
  },
  publisherName: o
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("pg", exports.postgres6);
  r.channel.registerMonkeyPatch("pg", exports.postgres);
};