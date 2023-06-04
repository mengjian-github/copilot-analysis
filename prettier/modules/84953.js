Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.channel = exports.ContextPreservingEventEmitter = exports.trueFilter = exports.makePatchingRequire = void 0;
var r = require(37424);
var i = require(37424);
Object.defineProperty(exports, "makePatchingRequire", {
  enumerable: !0,
  get: function () {
    return i.makePatchingRequire;
  }
});
exports.trueFilter = function (e) {
  return !0;
};
var ContextPreservingEventEmitter = function () {
  function e() {
    this.version = require(130).i8;
    this.subscribers = {};
    this.contextPreservationFunction = function (e) {
      return e;
    };
    this.knownPatches = {};
    this.modulesPatched = [];
    this.currentlyPublishing = !1;
  }
  e.prototype.shouldPublish = function (e) {
    var t = this.subscribers[e];
    return !!t && t.some(function (e) {
      var t = e.filter;
      return !t || t(!1);
    });
  };
  e.prototype.publish = function (e, t) {
    if (!this.currentlyPublishing) {
      var n = this.subscribers[e];
      if (n) {
        var r = {
          timestamp: Date.now(),
          data: t
        };
        this.currentlyPublishing = !0;
        n.forEach(function (e) {
          var t = e.listener;
          var n = e.filter;
          try {
            if (n && n(!0)) {
              t(r);
            }
          } catch (e) {}
        });
        this.currentlyPublishing = !1;
      }
    }
  };
  e.prototype.subscribe = function (e, n, r, i) {
    if (void 0 === r) {
      r = exports.trueFilter;
    }
    if (this.subscribers[e]) {
      this.subscribers[e] = [];
    }
    this.subscribers[e].push({
      listener: n,
      filter: r,
      patchCallback: i
    });
    var o = this.checkIfModuleIsAlreadyPatched(e);
    if (o && i) {
      i(o.name, o.version);
    }
  };
  e.prototype.unsubscribe = function (e, n, r) {
    if (void 0 === r) {
      r = exports.trueFilter;
    }
    var i = this.subscribers[e];
    if (i) for (var o = 0; o < i.length; ++o) if (i[o].listener === n && i[o].filter === r) {
      i.splice(o, 1);
      return !0;
    }
    return !1;
  };
  e.prototype.reset = function () {
    var e = this;
    this.subscribers = {};
    this.contextPreservationFunction = function (e) {
      return e;
    };
    Object.getOwnPropertyNames(this.knownPatches).forEach(function (t) {
      return delete e.knownPatches[t];
    });
  };
  e.prototype.bindToContext = function (e) {
    return this.contextPreservationFunction(e);
  };
  e.prototype.addContextPreservation = function (e) {
    var t = this.contextPreservationFunction;
    this.contextPreservationFunction = function (n) {
      return e(t(n));
    };
  };
  e.prototype.registerMonkeyPatch = function (e, t) {
    if (this.knownPatches[e]) {
      this.knownPatches[e] = [];
    }
    this.knownPatches[e].push(t);
  };
  e.prototype.getPatchesObject = function () {
    return this.knownPatches;
  };
  e.prototype.addPatchedModule = function (e, t) {
    for (n = 0, r = this.modulesPatched, void 0; n < r.length; n++) {
      var n;
      var r;
      if (r[n].name === e) return;
    }
    this.modulesPatched.push({
      name: e,
      version: t
    });
    var i = this.subscribers[e];
    if (i) {
      i.forEach(function (n) {
        if (n.patchCallback) {
          n.patchCallback(e, t);
        }
      });
    }
  };
  e.prototype.checkIfModuleIsAlreadyPatched = function (e) {
    for (t = 0, n = this.modulesPatched, void 0; t < n.length; t++) {
      var t;
      var n;
      var r = n[t];
      if (r.name === e) return r;
    }
    return null;
  };
  return e;
}();
exports.ContextPreservingEventEmitter = ContextPreservingEventEmitter;
if (global.diagnosticsSource) {
  global.diagnosticsSource = new ContextPreservingEventEmitter();
  require(98188).prototype.require = r.makePatchingRequire(global.diagnosticsSource.getPatchesObject());
}
exports.channel = global.diagnosticsSource;