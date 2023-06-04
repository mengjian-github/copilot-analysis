require.r(exports);
require.d(exports, {
  DiagConsoleLogger: () => c,
  DiagLogLevel: () => l.n,
  INVALID_SPANID: () => V.fQ,
  INVALID_SPAN_CONTEXT: () => V.Rr,
  INVALID_TRACEID: () => V.AE,
  ProxyTracer: () => k.T,
  ProxyTracerProvider: () => P.K,
  ROOT_CONTEXT: () => s.I,
  SamplingDecision: () => N.U,
  SpanKind: () => O.M,
  SpanStatusCode: () => R.Q,
  TraceFlags: () => M.r,
  ValueType: () => i,
  baggageEntryMetadataFromString: () => o.u,
  context: () => H.D,
  createContextKey: () => s.Y,
  createNoopMeter: () => I,
  createTraceState: () => U,
  default: () => Y,
  defaultTextMapGetter: () => A.r,
  defaultTextMapSetter: () => A.M,
  diag: () => q.K,
  isSpanContextValid: () => $.BM,
  isValidSpanId: () => $.Lc,
  isValidTraceId: () => $.jN,
  metrics: () => Q,
  propagation: () => Z.u,
  trace: () => X.g
});
var r;
var i;
var o = require(92599);
var s = require(15834);
var a = [{
  n: "error",
  c: "error"
}, {
  n: "warn",
  c: "warn"
}, {
  n: "info",
  c: "info"
}, {
  n: "debug",
  c: "debug"
}, {
  n: "verbose",
  c: "trace"
}];
var c = function () {
  function e(e) {
    return function () {
      for (t = [], n = 0, void 0; n < arguments.length; n++) {
        var t;
        var n;
        t[n] = arguments[n];
      }
      if (console) {
        var r = console[e];
        if ("function" != typeof r) {
          r = console.log;
        }
        if ("function" == typeof r) return r.apply(console, t);
      }
    };
  }
  for (var t = 0; t < a.length; t++) this[a[t].n] = e(a[t].c);
};
var l = require(16740);
var u = (r = function (e, t) {
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
  if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  function n() {
    this.constructor = e;
  }
  r(e, t);
  e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
var p = function () {
  function e() {}
  e.prototype.createHistogram = function (e, t) {
    return w;
  };
  e.prototype.createCounter = function (e, t) {
    return E;
  };
  e.prototype.createUpDownCounter = function (e, t) {
    return T;
  };
  e.prototype.createObservableGauge = function (e, t) {
    return x;
  };
  e.prototype.createObservableCounter = function (e, t) {
    return S;
  };
  e.prototype.createObservableUpDownCounter = function (e, t) {
    return C;
  };
  e.prototype.addBatchObservableCallback = function (e, t) {};
  e.prototype.removeBatchObservableCallback = function (e) {};
  return e;
}();
var d = function () {};
var h = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }
  u(t, e);
  t.prototype.add = function (e, t) {};
  return t;
}(d);
var f = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }
  u(t, e);
  t.prototype.add = function (e, t) {};
  return t;
}(d);
var m = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }
  u(t, e);
  t.prototype.record = function (e, t) {};
  return t;
}(d);
var g = function () {
  function e() {}
  e.prototype.addCallback = function (e) {};
  e.prototype.removeCallback = function (e) {};
  return e;
}();
var y = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }
  u(t, e);
  return t;
}(g);
var _ = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }
  u(t, e);
  return t;
}(g);
var v = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }
  u(t, e);
  return t;
}(g);
var b = new p();
var E = new h();
var w = new m();
var T = new f();
var S = new y();
var x = new _();
var C = new v();
function I() {
  return b;
}
!function (e) {
  e[e.INT = 0] = "INT";
  e[e.DOUBLE = 1] = "DOUBLE";
}(i || (i = {}));
var A = require(7008);
var k = require(69953);
var P = require(5236);
var N = require(51227);
var O = require(70087);
var R = require(1820);
var M = require(68726);
var L = "[_0-9a-z-*/]";
var D = new RegExp("^(?:[a-z]" + L + "{0,255}|[a-z0-9]" + L + "{0,240}@[a-z]" + L + "{0,13})$");
var B = /^[ -~]{0,255}[!-~]$/;
var F = /,|=/;
var j = function () {
  function e(e) {
    this._internalState = new Map();
    if (e) {
      this._parse(e);
    }
  }
  e.prototype.set = function (e, t) {
    var n = this._clone();
    if (n._internalState.has(e)) {
      n._internalState.delete(e);
    }
    n._internalState.set(e, t);
    return n;
  };
  e.prototype.unset = function (e) {
    var t = this._clone();
    t._internalState.delete(e);
    return t;
  };
  e.prototype.get = function (e) {
    return this._internalState.get(e);
  };
  e.prototype.serialize = function () {
    var e = this;
    return this._keys().reduce(function (t, n) {
      t.push(n + "=" + e.get(n));
      return t;
    }, []).join(",");
  };
  e.prototype._parse = function (e) {
    if (e.length > 512) {
      this._internalState = e.split(",").reverse().reduce(function (e, t) {
        var n = t.trim();
        var r = n.indexOf("=");
        if (-1 !== r) {
          var i = n.slice(0, r);
          var o = n.slice(r + 1, t.length);
          if (function (e) {
            return D.test(e);
          }(i) && function (e) {
            return B.test(e) && !F.test(e);
          }(o)) {
            e.set(i, o);
          }
        }
        return e;
      }, new Map());
      if (this._internalState.size > 32) {
        this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32));
      }
    }
  };
  e.prototype._keys = function () {
    return Array.from(this._internalState.keys()).reverse();
  };
  e.prototype._clone = function () {
    var t = new e();
    t._internalState = new Map(this._internalState);
    return t;
  };
  return e;
}();
function U(e) {
  return new j(e);
}
var $ = require(97228);
var V = require(27007);
var H = require(66339);
var q = require(90928);
var z = new (function () {
  function e() {}
  e.prototype.getMeter = function (e, t, n) {
    return b;
  };
  return e;
}())();
var K = require(30658);
var G = require(95774);
var W = "metrics";
var Q = function () {
  function e() {}
  e.getInstance = function () {
    if (this._instance) {
      this._instance = new e();
    }
    return this._instance;
  };
  e.prototype.setGlobalMeterProvider = function (e) {
    return K.TG(W, e, G.G.instance());
  };
  e.prototype.getMeterProvider = function () {
    return K.Rd(W) || z;
  };
  e.prototype.getMeter = function (e, t, n) {
    return this.getMeterProvider().getMeter(e, t, n);
  };
  e.prototype.disable = function () {
    K.J_(W, G.G.instance());
  };
  return e;
}().getInstance();
var Z = require(68303);
var X = require(52210);
const Y = {
  context: H.D,
  diag: q.K,
  metrics: Q,
  propagation: Z.u,
  trace: X.g
};