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
exports.enable = exports.mongo330 = exports.mongo3 = exports.mongo2 = void 0;
var i = require(84953);
exports.mongo2 = {
  versionSpecifier: ">= 2.0.0 <= 3.0.5",
  patch: function (e) {
    var t = e.instrument({
      operationIdGenerator: {
        next: function () {
          return i.channel.bindToContext(function (e) {
            return e();
          });
        }
      }
    });
    var n = {};
    t.on("started", function (e) {
      if (n[e.requestId]) {
        n[e.requestId] = r(r({}, e), {
          time: new Date()
        });
      }
    });
    t.on("succeeded", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("function" == typeof e.operationId) {
        e.operationId(function () {
          return i.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !0
          });
        });
      } else {
        i.channel.publish("mongodb", {
          startedData: t,
          event: e,
          succeeded: !0
        });
      }
    });
    t.on("failed", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("function" == typeof e.operationId) {
        e.operationId(function () {
          return i.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !1
          });
        });
      } else {
        i.channel.publish("mongodb", {
          startedData: t,
          event: e,
          succeeded: !1
        });
      }
    });
    return e;
  }
};
exports.mongo3 = {
  versionSpecifier: "> 3.0.5 < 3.3.0",
  patch: function (e) {
    var t = e.instrument();
    var n = {};
    var o = {};
    t.on("started", function (e) {
      if (n[e.requestId]) {
        o[e.requestId] = i.channel.bindToContext(function (e) {
          return e();
        });
        n[e.requestId] = r(r({}, e), {
          time: new Date()
        });
      }
    });
    t.on("succeeded", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("object" == typeof e && "function" == typeof o[e.requestId]) {
        o[e.requestId](function () {
          return i.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !0
          });
        });
        delete o[e.requestId];
      }
    });
    t.on("failed", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("object" == typeof e && "function" == typeof o[e.requestId]) {
        o[e.requestId](function () {
          return i.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !1
          });
        });
        delete o[e.requestId];
      }
    });
    return e;
  }
};
exports.mongo330 = {
  versionSpecifier: ">= 3.3.0 < 4.0.0",
  patch: function (e) {
    !function (e) {
      var t = e.Server.prototype.connect;
      e.Server.prototype.connect = function () {
        var e = t.apply(this, arguments);
        var n = this.s.coreTopology.s.pool.write;
        this.s.coreTopology.s.pool.write = function () {
          var e = "function" == typeof arguments[1] ? 1 : 2;
          if ("function" == typeof arguments[e]) {
            arguments[e] = i.channel.bindToContext(arguments[e]);
          }
          return n.apply(this, arguments);
        };
        var r = this.s.coreTopology.s.pool.logout;
        this.s.coreTopology.s.pool.logout = function () {
          if ("function" == typeof arguments[1]) {
            arguments[1] = i.channel.bindToContext(arguments[1]);
          }
          return r.apply(this, arguments);
        };
        return e;
      };
    }(e);
    var t = e.instrument();
    var n = {};
    var r = {};
    t.on("started", function (e) {
      if (n[e.requestId]) {
        r[e.requestId] = i.channel.bindToContext(function (e) {
          return e();
        });
        n[e.requestId] = e;
      }
    });
    t.on("succeeded", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("object" == typeof e && "function" == typeof r[e.requestId]) {
        r[e.requestId](function () {
          return i.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !0
          });
        });
        delete r[e.requestId];
      }
    });
    t.on("failed", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("object" == typeof e && "function" == typeof r[e.requestId]) {
        r[e.requestId](function () {
          return i.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !1
          });
        });
        delete r[e.requestId];
      }
    });
    return e;
  }
};
exports.enable = function () {
  i.channel.registerMonkeyPatch("mongodb", exports.mongo2);
  i.channel.registerMonkeyPatch("mongodb", exports.mongo3);
  i.channel.registerMonkeyPatch("mongodb", exports.mongo330);
};