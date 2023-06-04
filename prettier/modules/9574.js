Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.dispose = exports.Configuration = exports.wrapWithCorrelationContext = exports.startOperation = exports.getCorrelationContext = exports.start = exports.setup = exports.liveMetricsClient = exports.defaultClient = exports.DistributedTracingModes = void 0;
var r;
var i = require(70894);
var o = require(66281);
var s = require(6639);
var a = require(74350);
var c = require(62309);
var l = require(38975);
var u = require(11918);
var p = require(88723);
var d = require(40731);
var h = require(29962);
var f = require(95282);
var m = require(83668);
var g = require(11629);
var y = require(81162);
exports.TelemetryClient = require(1259);
exports.Contracts = require(55290);
exports.azureFunctionsTypes = require(56761);
(function (e) {
  e[e.AI = 0] = "AI";
  e[e.AI_AND_W3C = 1] = "AI_AND_W3C";
})(r = exports.DistributedTracingModes || (exports.DistributedTracingModes = {}));
var _;
var v;
var b;
var E;
var w;
var T;
var S;
var x;
var C;
var I;
var A;
var k;
var P;
var N = function () {
  return !1;
};
var O = function () {
  return !0;
};
var R = function () {
  return !0;
};
var M = function () {
  return !0;
};
var L = function () {
  return !1;
};
var D = function () {
  return !0;
};
var B = function () {
  return !0;
};
var F = function () {
  return !0;
};
var j = function () {
  return !0;
};
var U = function () {
  return !1;
};
var $ = function () {
  return !0;
};
var V = function () {
  return !1;
};
var H = function () {
  return !1;
};
var q = function () {
  return !1;
};
var z = function () {
  return !0;
}();
var K = N();
var G = q();
var W = O();
var Q = R();
var Z = M();
var X = L();
var Y = D();
var J = B();
var ee = F();
var te = j();
var ne = U();
var re = $();
var ie = V();
var oe = H();
var se = void 0;
var ae = void 0;
var ce = void 0;
var le = !1;
function ue() {
  if (exports.defaultClient) {
    le = !0;
    b.enable(z, K);
    E.enable(W);
    w.enable(Q);
    T.enable(Z);
    S.enable(X);
    C.enable(re, v);
    I.useAutoCorrelation(te, _);
    I.enable(Y);
    A.enable(J);
    x.enable(ie, ce);
    if (exports.liveMetricsClient && ne) {
      exports.liveMetricsClient.enable(ne);
    }
    k.enable(oe);
  } else {
    f.warn("Start cannot be called before setup");
  }
  return pe;
}
exports.setup = function (e) {
  if (exports.defaultClient) {
    f.info("The default client is already setup");
  } else {
    exports.defaultClient = new exports.TelemetryClient(e);
    (function () {
      z = void 0 !== exports.defaultClient.config.enableAutoCollectExternalLoggers ? exports.defaultClient.config.enableAutoCollectExternalLoggers : z;
      K = void 0 !== exports.defaultClient.config.enableAutoCollectConsole ? exports.defaultClient.config.enableAutoCollectConsole : K;
      G = void 0 !== exports.defaultClient.config.enableLoggerErrorToTrace ? exports.defaultClient.config.enableLoggerErrorToTrace : G;
      W = void 0 !== exports.defaultClient.config.enableAutoCollectExceptions ? exports.defaultClient.config.enableAutoCollectExceptions : W;
      Q = void 0 !== exports.defaultClient.config.enableAutoCollectPerformance ? exports.defaultClient.config.enableAutoCollectPerformance : Q;
      Z = void 0 !== exports.defaultClient.config.enableAutoCollectPreAggregatedMetrics ? exports.defaultClient.config.enableAutoCollectPreAggregatedMetrics : Z;
      X = void 0 !== exports.defaultClient.config.enableAutoCollectHeartbeat ? exports.defaultClient.config.enableAutoCollectHeartbeat : X;
      Y = void 0 !== exports.defaultClient.config.enableAutoCollectRequests ? exports.defaultClient.config.enableAutoCollectRequests : Y;
      J = void 0 !== exports.defaultClient.config.enableAutoDependencyCorrelation ? exports.defaultClient.config.enableAutoDependencyCorrelation : J;
      te = void 0 !== exports.defaultClient.config.enableAutoDependencyCorrelation ? exports.defaultClient.config.enableAutoDependencyCorrelation : te;
      _ = void 0 !== exports.defaultClient.config.enableUseAsyncHooks ? exports.defaultClient.config.enableUseAsyncHooks : _;
      ie = void 0 !== exports.defaultClient.config.enableWebInstrumentation ? exports.defaultClient.config.enableWebInstrumentation : ie;
      ie = !0 === exports.defaultClient.config.enableAutoWebSnippetInjection || ie;
      oe = void 0 !== exports.defaultClient.config.enableAutoCollectIncomingRequestAzureFunctions ? exports.defaultClient.config.enableAutoCollectIncomingRequestAzureFunctions : oe;
      var e = g.AutoCollectNativePerformance.parseEnabled(exports.defaultClient.config.enableAutoCollectExtendedMetrics, exports.defaultClient.config);
      re = e.isEnabled;
      v = e.disabledMetrics;
    })();
    b = new o(exports.defaultClient);
    E = new s(exports.defaultClient);
    w = new a(exports.defaultClient);
    T = new c(exports.defaultClient);
    S = new l(exports.defaultClient);
    x = new u(exports.defaultClient);
    I = new d(exports.defaultClient);
    A = new p(exports.defaultClient);
    if (C) {
      C = new g.AutoCollectNativePerformance(exports.defaultClient);
    }
    k = new y.AzureFunctionsHook(exports.defaultClient);
  }
  if (exports.defaultClient && exports.defaultClient.channel) {
    exports.defaultClient.channel.setUseDiskRetryCaching(ee, se, ae);
  }
  return pe;
};
exports.start = ue;
exports.getCorrelationContext = function () {
  return te ? i.CorrelationContextManager.getCurrentContext() : null;
};
exports.startOperation = function (e, t) {
  return i.CorrelationContextManager.startOperation(e, t);
};
exports.wrapWithCorrelationContext = function (e, t) {
  return i.CorrelationContextManager.wrapCallback(e, t);
};
var pe = function () {
  function e() {}
  e.setDistributedTracingMode = function (t) {
    h.w3cEnabled = t === r.AI_AND_W3C;
    return e;
  };
  e.setAutoCollectConsole = function (t, n) {
    if (void 0 === n) {
      n = !1;
    }
    z = t;
    K = n;
    if (le) {
      b.enable(t, n);
    }
    return e;
  };
  e.setAutoCollectExceptions = function (t) {
    W = t;
    if (le) {
      E.enable(t);
    }
    return e;
  };
  e.setAutoCollectPerformance = function (n, r) {
    if (void 0 === r) {
      r = !0;
    }
    Q = n;
    var i = g.AutoCollectNativePerformance.parseEnabled(r, exports.defaultClient.config);
    re = i.isEnabled;
    v = i.disabledMetrics;
    if (le) {
      w.enable(n);
      C.enable(i.isEnabled, i.disabledMetrics);
    }
    return e;
  };
  e.setAutoCollectPreAggregatedMetrics = function (t) {
    Z = t;
    if (le) {
      T.enable(t);
    }
    return e;
  };
  e.setAutoCollectHeartbeat = function (t) {
    X = t;
    if (le) {
      S.enable(t);
    }
    return e;
  };
  e.enableAutoWebSnippetInjection = function (t, n) {
    ie = t;
    ce = n;
    if (le) {
      x.enable(t, ce);
    }
    return e;
  };
  e.enableWebInstrumentation = function (t, n) {
    ie = t;
    ce = n;
    if (le) {
      x.enable(t, ce);
    }
    return e;
  };
  e.setAutoCollectRequests = function (t) {
    Y = t;
    if (le) {
      I.enable(t);
    }
    return e;
  };
  e.setAutoCollectDependencies = function (t) {
    J = t;
    if (le) {
      A.enable(t);
    }
    return e;
  };
  e.setAutoDependencyCorrelation = function (t, n) {
    te = t;
    _ = n;
    if (le) {
      I.useAutoCorrelation(t, n);
    }
    return e;
  };
  e.setUseDiskRetryCaching = function (n, r, i) {
    ee = n;
    se = r;
    ae = i;
    if (exports.defaultClient && exports.defaultClient.channel) {
      exports.defaultClient.channel.setUseDiskRetryCaching(ee, se, ae);
    }
    return e;
  };
  e.setInternalLogging = function (t, n) {
    if (void 0 === t) {
      t = !1;
    }
    if (void 0 === n) {
      n = !0;
    }
    f.enableDebug = t;
    f.disableWarnings = !n;
    return e;
  };
  e.setAutoCollectIncomingRequestAzureFunctions = function (t) {
    oe = t;
    if (le) {
      k.enable(t);
    }
    return e;
  };
  e.setSendLiveMetrics = function (n) {
    if (void 0 === n) {
      n = !1;
    }
    return exports.defaultClient ? (!exports.liveMetricsClient && n ? (exports.liveMetricsClient = new m(exports.defaultClient.config, exports.defaultClient.context, exports.defaultClient.getAuthorizationHandler), P = new a(exports.liveMetricsClient, 1e3, !0), exports.liveMetricsClient.addCollector(P), exports.defaultClient.quickPulseClient = exports.liveMetricsClient) : exports.liveMetricsClient && exports.liveMetricsClient.enable(n), ne = n, e) : (f.warn("Live metrics client cannot be setup without the default client"), e);
  };
  e.start = ue;
  return e;
}();
exports.Configuration = pe;
exports.dispose = function () {
  h.w3cEnabled = !0;
  exports.defaultClient = null;
  le = !1;
  if (b) {
    b.dispose();
  }
  if (E) {
    E.dispose();
  }
  if (w) {
    w.dispose();
  }
  if (T) {
    T.dispose();
  }
  if (S) {
    S.dispose();
  }
  if (x) {
    x.dispose();
  }
  if (C) {
    C.dispose();
  }
  if (I) {
    I.dispose();
  }
  if (A) {
    A.dispose();
  }
  if (exports.liveMetricsClient) {
    exports.liveMetricsClient.enable(!1);
    ne = !1;
    exports.liveMetricsClient = void 0;
  }
  if (k) {
    k.dispose();
  }
};