require.r(exports);
require.d(exports, {
  AlwaysOffSampler: () => R,
  AlwaysOnSampler: () => M,
  AnchoredClock: () => i,
  BindOnceFuture: () => X.q,
  CompositePropagator: () => x.Y,
  DEFAULT_ATTRIBUTE_COUNT_LIMIT: () => V.qG,
  DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT: () => V.KR,
  DEFAULT_ENVIRONMENT: () => V.J9,
  DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT: () => V.Ys,
  DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT: () => V.VH,
  ExportResultCode: () => l.I,
  ParentBasedSampler: () => F,
  RPCType: () => E,
  RandomIdGenerator: () => _,
  SDK_INFO: () => T.m,
  TRACE_PARENT_HEADER: () => C.FX,
  TRACE_STATE_HEADER: () => C.C3,
  TimeoutError: () => K,
  TraceIdRatioBasedSampler: () => j,
  TraceState: () => $.n,
  TracesSamplerValues: () => q.J,
  VERSION: () => u.q,
  W3CBaggagePropagator: () => r.a,
  W3CTraceContextPropagator: () => C.jf,
  _globalThis: () => h,
  addHrTimes: () => c.vF,
  baggageUtils: () => p,
  callWithTimeout: () => G,
  deleteRPCMetadata: () => k,
  getEnv: () => d.d,
  getEnvWithoutDefaults: () => V.vU,
  getRPCMetadata: () => P,
  getTimeOrigin: () => c.U,
  globalErrorHandler: () => s.L,
  hexToBase64: () => y,
  hrTime: () => c.Jt,
  hrTimeDuration: () => c.J3,
  hrTimeToMicroseconds: () => c.ji,
  hrTimeToMilliseconds: () => c.KO,
  hrTimeToNanoseconds: () => c.PW,
  hrTimeToTimeStamp: () => c.Us,
  internal: () => J,
  isAttributeKey: () => o.sy,
  isAttributeValue: () => o.Do,
  isTimeInput: () => c.X_,
  isTimeInputHrTime: () => c.Dt,
  isTracingSuppressed: () => U.Ll,
  isUrlIgnored: () => Q,
  isWrapped: () => Z,
  loggingErrorHandler: () => a.x,
  merge: () => H.T,
  millisToHrTime: () => c.i5,
  otperformance: () => w.t,
  parseEnvironment: () => V.Ds,
  parseTraceParent: () => C.j_,
  sanitizeAttributes: () => o.FT,
  setGlobalErrorHandler: () => s.c,
  setRPCMetadata: () => A,
  suppressTracing: () => U.hE,
  timeInputToHrTime: () => c.aE,
  unrefTimer: () => S.g,
  unsuppressTracing: () => U.yy,
  urlMatches: () => W
});
var r = require(80926);
var i = function () {
  function e(e, t) {
    this._monotonicClock = t;
    this._epochMillis = e.now();
    this._performanceMillis = t.now();
  }
  e.prototype.now = function () {
    var e = this._monotonicClock.now() - this._performanceMillis;
    return this._epochMillis + e;
  };
  return e;
}();
var o = require(60551);
var s = require(36220);
var a = require(26470);
var c = require(97664);
var l = require(63420);
var u = require(18923);
var p = require(60315);
var d = require(54241);
var h = "object" == typeof globalThis ? globalThis : global;
function f(e) {
  return e >= 48 && e <= 57 ? e - 48 : e >= 97 && e <= 102 ? e - 87 : e - 55;
}
var m = Buffer.alloc(8);
var g = Buffer.alloc(16);
function y(e) {
  var t;
  t = 16 === e.length ? m : 32 === e.length ? g : Buffer.alloc(e.length / 2);
  for (n = 0, r = 0, void 0; r < e.length; r += 2) {
    var n;
    var r;
    var i = f(e.charCodeAt(r));
    var o = f(e.charCodeAt(r + 1));
    t.writeUInt8(i << 4 | o, n++);
  }
  return t.toString("base64");
}
var _ = function () {
  this.generateTraceId = b(16);
  this.generateSpanId = b(8);
};
var v = Buffer.allocUnsafe(16);
function b(e) {
  return function () {
    for (var t = 0; t < e / 4; t++) v.writeUInt32BE(Math.random() * Math.pow(2, 32) >>> 0, 4 * t);
    for (t = 0; t < e && !(v[t] > 0); t++) if (t === e - 1) {
      v[e - 1] = 1;
    }
    return v.toString("hex", 0, e);
  };
}
var E;
var w = require(90471);
var T = require(93290);
var S = require(52140);
var x = require(63135);
var C = require(49588);
var I = require(15834).Y("OpenTelemetry SDK Context Key RPC_METADATA");
function A(e, t) {
  return e.setValue(I, t);
}
function k(e) {
  return e.deleteValue(I);
}
function P(e) {
  return e.getValue(I);
}
!function (e) {
  e.HTTP = "http";
}(E || (E = {}));
var N;
var O = require(51227);
var R = function () {
  function e() {}
  e.prototype.shouldSample = function () {
    return {
      decision: O.U.NOT_RECORD
    };
  };
  e.prototype.toString = function () {
    return "AlwaysOffSampler";
  };
  return e;
}();
var M = function () {
  function e() {}
  e.prototype.shouldSample = function () {
    return {
      decision: O.U.RECORD_AND_SAMPLED
    };
  };
  e.prototype.toString = function () {
    return "AlwaysOnSampler";
  };
  return e;
}();
var L = require(52210);
var D = require(97228);
var B = require(68726);
var F = function () {
  function e(e) {
    var t;
    var n;
    var r;
    var i;
    this._root = e.root;
    if (this._root) {
      s.L(new Error("ParentBasedSampler must have a root sampler configured"));
      this._root = new M();
    }
    this._remoteParentSampled = null !== (t = e.remoteParentSampled) && void 0 !== t ? t : new M();
    this._remoteParentNotSampled = null !== (n = e.remoteParentNotSampled) && void 0 !== n ? n : new R();
    this._localParentSampled = null !== (r = e.localParentSampled) && void 0 !== r ? r : new M();
    this._localParentNotSampled = null !== (i = e.localParentNotSampled) && void 0 !== i ? i : new R();
  }
  e.prototype.shouldSample = function (e, t, n, r, i, o) {
    var s = L.g.getSpanContext(e);
    return s && D.BM(s) ? s.isRemote ? s.traceFlags & B.r.SAMPLED ? this._remoteParentSampled.shouldSample(e, t, n, r, i, o) : this._remoteParentNotSampled.shouldSample(e, t, n, r, i, o) : s.traceFlags & B.r.SAMPLED ? this._localParentSampled.shouldSample(e, t, n, r, i, o) : this._localParentNotSampled.shouldSample(e, t, n, r, i, o) : this._root.shouldSample(e, t, n, r, i, o);
  };
  e.prototype.toString = function () {
    return "ParentBased{root=" + this._root.toString() + ", remoteParentSampled=" + this._remoteParentSampled.toString() + ", remoteParentNotSampled=" + this._remoteParentNotSampled.toString() + ", localParentSampled=" + this._localParentSampled.toString() + ", localParentNotSampled=" + this._localParentNotSampled.toString() + "}";
  };
  return e;
}();
var j = function () {
  function e(e) {
    if (void 0 === e) {
      e = 0;
    }
    this._ratio = e;
    this._ratio = this._normalize(e);
    this._upperBound = Math.floor(4294967295 * this._ratio);
  }
  e.prototype.shouldSample = function (e, t) {
    return {
      decision: D.jN(t) && this._accumulate(t) < this._upperBound ? O.U.RECORD_AND_SAMPLED : O.U.NOT_RECORD
    };
  };
  e.prototype.toString = function () {
    return "TraceIdRatioBased{" + this._ratio + "}";
  };
  e.prototype._normalize = function (e) {
    return "number" != typeof e || isNaN(e) ? 0 : e >= 1 ? 1 : e <= 0 ? 0 : e;
  };
  e.prototype._accumulate = function (e) {
    for (t = 0, n = 0, void 0; n < e.length / 8; n++) {
      var t;
      var n;
      var r = 8 * n;
      t = (t ^ parseInt(e.slice(r, r + 8), 16)) >>> 0;
    }
    return t;
  };
  return e;
}();
var U = require(98397);
var $ = require(59598);
var V = require(70450);
var H = require(39009);
var q = require(29290);
var z = (N = function (e, t) {
  N = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
      e[n] = t[n];
    }
  };
  return N(e, t);
}, function (e, t) {
  if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  function n() {
    this.constructor = e;
  }
  N(e, t);
  e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
var K = function (e) {
  function t(n) {
    var r = e.call(this, n) || this;
    Object.setPrototypeOf(r, t.prototype);
    return r;
  }
  z(t, e);
  return t;
}(Error);
function G(e, t) {
  var n;
  var r = new Promise(function (e, r) {
    n = setTimeout(function () {
      r(new K("Operation timed out."));
    }, t);
  });
  return Promise.race([e, r]).then(function (e) {
    clearTimeout(n);
    return e;
  }, function (e) {
    throw clearTimeout(n), e;
  });
}
function W(e, t) {
  return "string" == typeof t ? e === t : !!e.match(t);
}
function Q(e, t) {
  var n;
  var r;
  if (!t) return !1;
  try {
    for (i = function (e) {
      var t = "function" == typeof Symbol && Symbol.iterator;
      var n = t && e[t];
      var r = 0;
      if (n) return n.call(e);
      if (e && "number" == typeof e.length) return {
        next: function () {
          if (e && r >= e.length) {
            e = void 0;
          }
          return {
            value: e && e[r++],
            done: !e
          };
        }
      };
      throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }(t), o = i.next(), void 0; !o.done; o = i.next()) {
      var i;
      var o;
      if (W(e, o.value)) return !0;
    }
  } catch (e) {
    n = {
      error: e
    };
  } finally {
    try {
      if (o && !o.done && (r = i.return)) {
        r.call(i);
      }
    } finally {
      if (n) throw n.error;
    }
  }
  return !1;
}
function Z(e) {
  return "function" == typeof e && "function" == typeof e.__original && "function" == typeof e.__unwrap && !0 === e.__wrapped;
}
var X = require(71399);
var Y = require(66339);
var J = {
  _export: function (e, t) {
    return new Promise(function (n) {
      Y.D.with(U.hE(Y.D.active()), function () {
        e.export(t, function (e) {
          n(e);
        });
      });
    });
  }
};