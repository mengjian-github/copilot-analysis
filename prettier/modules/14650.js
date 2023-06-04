var r;
var i = this && this.__extends || (r = function (e, t) {
  r = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
      e[n] = t[n];
    }
  };
  return r(e, t);
}, function (e, t) {
  function n() {
    this.constructor = e;
  }
  r(e, t);
  e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
var o = this && this.__rest || function (e, t) {
  var n = {};
  for (var r in e) if (Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0) {
    n[r] = e[r];
  }
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var i = 0;
    for (r = Object.getOwnPropertySymbols(e); i < r.length; i++) if (t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i])) {
      n[r[i]] = e[r[i]];
    }
  }
  return n;
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.winston2 = exports.winston3 = void 0;
var s = require(84953);
exports.winston3 = {
  versionSpecifier: "3.x",
  patch: function (e) {
    var t = function (e) {
      function t(t, n) {
        var r = e.call(this, n) || this;
        r.winston = t;
        return r;
      }
      i(t, e);
      t.prototype.log = function (e, t) {
        var n = e.message;
        var r = e.level;
        var i = e.meta;
        var a = o(e, ["message", "level", "meta"]);
        r = "function" == typeof Symbol.for ? e[Symbol.for("level")] : r;
        n = e instanceof Error ? e : n;
        var c = function (e, t) {
          return null != e.config.npm.levels[t] ? "npm" : null != e.config.syslog.levels[t] ? "syslog" : "unknown";
        }(this.winston, r);
        for (var l in i = i || {}, a) if (a.hasOwnProperty(l)) {
          i[l] = a[l];
        }
        s.channel.publish("winston", {
          message: n,
          level: r,
          levelKind: c,
          meta: i
        });
        t();
      };
      return t;
    }(e.Transport);
    function n() {
      var n;
      var r = e.config.npm.levels;
      for (var i in arguments && arguments[0] && arguments[0].levels && (r = arguments[0].levels), r) if (r.hasOwnProperty(i)) {
        n = void 0 === n || r[i] > r[n] ? i : n;
      }
      this.add(new t(e, {
        level: n
      }));
    }
    var r = e.createLogger;
    e.createLogger = function () {
      var i;
      var o = e.config.npm.levels;
      for (var s in arguments && arguments[0] && arguments[0].levels && (o = arguments[0].levels), o) if (o.hasOwnProperty(s)) {
        i = void 0 === i || o[s] > o[i] ? s : i;
      }
      var a = r.apply(this, arguments);
      a.add(new t(e, {
        level: i
      }));
      var c = a.configure;
      a.configure = function () {
        c.apply(this, arguments);
        n.apply(this, arguments);
      };
      return a;
    };
    var a = e.configure;
    e.configure = function () {
      a.apply(this, arguments);
      n.apply(this, arguments);
    };
    e.add(new t(e));
    return e;
  }
};
exports.winston2 = {
  versionSpecifier: "2.x",
  patch: function (e) {
    var t;
    var n = e.Logger.prototype.log;
    var r = function (n, r, i) {
      var o;
      o = t === e.config.npm.levels ? "npm" : t === e.config.syslog.levels ? "syslog" : "unknown";
      s.channel.publish("winston", {
        level: n,
        message: r,
        meta: i,
        levelKind: o
      });
      return r;
    };
    e.Logger.prototype.log = function () {
      t = this.levels;
      if (this.filters && 0 !== this.filters.length) {
        if (this.filters[this.filters.length - 1] !== r) {
          this.filters = this.filters.filter(function (e) {
            return e !== r;
          });
          this.filters.push(r);
        }
      } else {
        this.filters = [r];
      }
      return n.apply(this, arguments);
    };
    return e;
  }
};
exports.enable = function () {
  s.channel.registerMonkeyPatch("winston", exports.winston2);
  s.channel.registerMonkeyPatch("winston", exports.winston3);
};