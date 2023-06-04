require.r(exports);
require.d(exports, {
  AlwaysOffSampler: () => E,
  AlwaysOnSampler: () => w,
  BasicTracerProvider: () => re,
  BatchSpanProcessor: () => ne,
  ConsoleSpanExporter: () => ie,
  ForceFlushState: () => B,
  InMemorySpanExporter: () => oe,
  NoopSpanProcessor: () => Z,
  ParentBasedSampler: () => x,
  RandomIdGenerator: () => R,
  SamplingDecision: () => r,
  SimpleSpanProcessor: () => ae,
  Span: () => _,
  TraceIdRatioBasedSampler: () => C,
  Tracer: () => F
});
var r;
var i = require(66339);
var o = require(52210);
var s = require(90928);
var a = require(27007);
var c = require(70087);
var l = require(51227);
var u = require(68726);
var p = require(98397);
var d = require(60551);
var h = require(1820);
var f = require(90471);
var m = require(97664);
var g = require(73108);
var y = function (e, t) {
  var n = "function" == typeof Symbol && e[Symbol.iterator];
  if (!n) return e;
  var r;
  var i;
  var o = n.call(e);
  var s = [];
  try {
    for (; (void 0 === t || t-- > 0) && !(r = o.next()).done;) s.push(r.value);
  } catch (e) {
    i = {
      error: e
    };
  } finally {
    try {
      if (r && !r.done && (n = o.return)) {
        n.call(o);
      }
    } finally {
      if (i) throw i.error;
    }
  }
  return s;
};
var _ = function () {
  function e(e, t, n, r, i, o, s, a, c) {
    if (void 0 === s) {
      s = [];
    }
    this.attributes = {};
    this.links = [];
    this.events = [];
    this._droppedAttributesCount = 0;
    this._droppedEventsCount = 0;
    this._droppedLinksCount = 0;
    this.status = {
      code: h.Q.UNSET
    };
    this.endTime = [0, 0];
    this._ended = !1;
    this._duration = [-1, -1];
    this.name = n;
    this._spanContext = r;
    this.parentSpanId = o;
    this.kind = i;
    this.links = s;
    var l = Date.now();
    this._performanceStartTime = f.t.now();
    this._performanceOffset = l - (this._performanceStartTime + m.U());
    this._startTimeProvided = null != a;
    this.startTime = this._getTime(null != a ? a : l);
    this.resource = e.resource;
    this.instrumentationLibrary = e.instrumentationLibrary;
    this._spanLimits = e.getSpanLimits();
    this._spanProcessor = e.getActiveSpanProcessor();
    this._spanProcessor.onStart(this, t);
    this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0;
  }
  e.prototype.spanContext = function () {
    return this._spanContext;
  };
  e.prototype.setAttribute = function (e, t) {
    return null == t || this._isSpanEnded() ? this : 0 === e.length ? (s.K.warn("Invalid attribute key: " + e), this) : d.Do(t) ? Object.keys(this.attributes).length >= this._spanLimits.attributeCountLimit && !Object.prototype.hasOwnProperty.call(this.attributes, e) ? (this._droppedAttributesCount++, this) : (this.attributes[e] = this._truncateToSize(t), this) : (s.K.warn("Invalid attribute value set for key: " + e), this);
  };
  e.prototype.setAttributes = function (e) {
    var t;
    var n;
    try {
      for (r = function (e) {
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
      }(Object.entries(e)), i = r.next(), void 0; !i.done; i = r.next()) {
        var r;
        var i;
        var o = y(i.value, 2);
        var s = o[0];
        var a = o[1];
        this.setAttribute(s, a);
      }
    } catch (e) {
      t = {
        error: e
      };
    } finally {
      try {
        if (i && !i.done && (n = r.return)) {
          n.call(r);
        }
      } finally {
        if (t) throw t.error;
      }
    }
    return this;
  };
  e.prototype.addEvent = function (e, t, n) {
    if (this._isSpanEnded()) return this;
    if (0 === this._spanLimits.eventCountLimit) {
      s.K.warn("No events allowed.");
      this._droppedEventsCount++;
      return this;
    }
    if (this.events.length >= this._spanLimits.eventCountLimit) {
      s.K.warn("Dropping extra events.");
      this.events.shift();
      this._droppedEventsCount++;
    }
    if (m.X_(t)) {
      if (m.X_(n)) {
        n = t;
      }
      t = void 0;
    }
    var r = d.FT(t);
    this.events.push({
      name: e,
      attributes: r,
      time: this._getTime(n),
      droppedAttributesCount: 0
    });
    return this;
  };
  e.prototype.setStatus = function (e) {
    if (this._isSpanEnded()) {
      this.status = e;
    }
    return this;
  };
  e.prototype.updateName = function (e) {
    if (this._isSpanEnded()) {
      this.name = e;
    }
    return this;
  };
  e.prototype.end = function (e) {
    if (this._isSpanEnded()) {
      s.K.error(this.name + " " + this._spanContext.traceId + "-" + this._spanContext.spanId + " - You can only call end() on a span once.");
    } else {
      this._ended = !0;
      this.endTime = this._getTime(e);
      this._duration = m.J3(this.startTime, this.endTime);
      if (this._duration[0] < 0) {
        s.K.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime);
        this.endTime = this.startTime.slice();
        this._duration = [0, 0];
      }
      this._spanProcessor.onEnd(this);
    }
  };
  e.prototype._getTime = function (e) {
    if ("number" == typeof e && e < f.t.now()) return m.Jt(e + this._performanceOffset);
    if ("number" == typeof e) return m.i5(e);
    if (e instanceof Date) return m.i5(e.getTime());
    if (m.Dt(e)) return e;
    if (this._startTimeProvided) return m.i5(Date.now());
    var t = f.t.now() - this._performanceStartTime;
    return m.vF(this.startTime, m.i5(t));
  };
  e.prototype.isRecording = function () {
    return !1 === this._ended;
  };
  e.prototype.recordException = function (e, t) {
    var n = {};
    if ("string" == typeof e) {
      n[g.og.EXCEPTION_MESSAGE] = e;
    } else {
      if (e) {
        if (e.code) {
          n[g.og.EXCEPTION_TYPE] = e.code.toString();
        } else {
          if (e.name) {
            n[g.og.EXCEPTION_TYPE] = e.name;
          }
        }
        if (e.message) {
          n[g.og.EXCEPTION_MESSAGE] = e.message;
        }
        if (e.stack) {
          n[g.og.EXCEPTION_STACKTRACE] = e.stack;
        }
      }
    }
    if (n[g.og.EXCEPTION_TYPE] || n[g.og.EXCEPTION_MESSAGE]) {
      this.addEvent("exception", n, t);
    } else {
      s.K.warn("Failed to record an exception " + e);
    }
  };
  Object.defineProperty(e.prototype, "duration", {
    get: function () {
      return this._duration;
    },
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperty(e.prototype, "ended", {
    get: function () {
      return this._ended;
    },
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperty(e.prototype, "droppedAttributesCount", {
    get: function () {
      return this._droppedAttributesCount;
    },
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperty(e.prototype, "droppedEventsCount", {
    get: function () {
      return this._droppedEventsCount;
    },
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperty(e.prototype, "droppedLinksCount", {
    get: function () {
      return this._droppedLinksCount;
    },
    enumerable: !1,
    configurable: !0
  });
  e.prototype._isSpanEnded = function () {
    if (this._ended) {
      s.K.warn("Can not execute the operation on ended Span {traceId: " + this._spanContext.traceId + ", spanId: " + this._spanContext.spanId + "}");
    }
    return this._ended;
  };
  e.prototype._truncateToLimitUtil = function (e, t) {
    return e.length <= t ? e : e.substr(0, t);
  };
  e.prototype._truncateToSize = function (e) {
    var t = this;
    var n = this._attributeValueLengthLimit;
    return n <= 0 ? (s.K.warn("Attribute value limit must be positive, got " + n), e) : "string" == typeof e ? this._truncateToLimitUtil(e, n) : Array.isArray(e) ? e.map(function (e) {
      return "string" == typeof e ? t._truncateToLimitUtil(e, n) : e;
    }) : e;
  };
  return e;
}();
var v = require(54241);
var b = require(29290);
!function (e) {
  e[e.NOT_RECORD = 0] = "NOT_RECORD";
  e[e.RECORD = 1] = "RECORD";
  e[e.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
}(r || (r = {}));
var E = function () {
  function e() {}
  e.prototype.shouldSample = function () {
    return {
      decision: r.NOT_RECORD
    };
  };
  e.prototype.toString = function () {
    return "AlwaysOffSampler";
  };
  return e;
}();
var w = function () {
  function e() {}
  e.prototype.shouldSample = function () {
    return {
      decision: r.RECORD_AND_SAMPLED
    };
  };
  e.prototype.toString = function () {
    return "AlwaysOnSampler";
  };
  return e;
}();
var T = require(97228);
var S = require(36220);
var x = function () {
  function e(e) {
    var t;
    var n;
    var r;
    var i;
    this._root = e.root;
    if (this._root) {
      S.L(new Error("ParentBasedSampler must have a root sampler configured"));
      this._root = new w();
    }
    this._remoteParentSampled = null !== (t = e.remoteParentSampled) && void 0 !== t ? t : new w();
    this._remoteParentNotSampled = null !== (n = e.remoteParentNotSampled) && void 0 !== n ? n : new E();
    this._localParentSampled = null !== (r = e.localParentSampled) && void 0 !== r ? r : new w();
    this._localParentNotSampled = null !== (i = e.localParentNotSampled) && void 0 !== i ? i : new E();
  }
  e.prototype.shouldSample = function (e, t, n, r, i, s) {
    var a = o.g.getSpanContext(e);
    return a && T.BM(a) ? a.isRemote ? a.traceFlags & u.r.SAMPLED ? this._remoteParentSampled.shouldSample(e, t, n, r, i, s) : this._remoteParentNotSampled.shouldSample(e, t, n, r, i, s) : a.traceFlags & u.r.SAMPLED ? this._localParentSampled.shouldSample(e, t, n, r, i, s) : this._localParentNotSampled.shouldSample(e, t, n, r, i, s) : this._root.shouldSample(e, t, n, r, i, s);
  };
  e.prototype.toString = function () {
    return "ParentBased{root=" + this._root.toString() + ", remoteParentSampled=" + this._remoteParentSampled.toString() + ", remoteParentNotSampled=" + this._remoteParentNotSampled.toString() + ", localParentSampled=" + this._localParentSampled.toString() + ", localParentNotSampled=" + this._localParentNotSampled.toString() + "}";
  };
  return e;
}();
var C = function () {
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
      decision: T.jN(t) && this._accumulate(t) < this._upperBound ? r.RECORD_AND_SAMPLED : r.NOT_RECORD
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
var I = v.d();
var A = b.J.AlwaysOn;
function k() {
  return {
    sampler: P(I),
    forceFlushTimeoutMillis: 3e4,
    generalLimits: {
      attributeValueLengthLimit: v.d().OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT,
      attributeCountLimit: v.d().OTEL_ATTRIBUTE_COUNT_LIMIT
    },
    spanLimits: {
      attributeValueLengthLimit: v.d().OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT,
      attributeCountLimit: v.d().OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT,
      linkCountLimit: v.d().OTEL_SPAN_LINK_COUNT_LIMIT,
      eventCountLimit: v.d().OTEL_SPAN_EVENT_COUNT_LIMIT,
      attributePerEventCountLimit: v.d().OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
      attributePerLinkCountLimit: v.d().OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT
    }
  };
}
function P(e) {
  switch (void 0 === e && (e = v.d()), e.OTEL_TRACES_SAMPLER) {
    case b.J.AlwaysOn:
      return new w();
    case b.J.AlwaysOff:
      return new E();
    case b.J.ParentBasedAlwaysOn:
      return new x({
        root: new w()
      });
    case b.J.ParentBasedAlwaysOff:
      return new x({
        root: new E()
      });
    case b.J.TraceIdRatio:
      return new C(N(e));
    case b.J.ParentBasedTraceIdRatio:
      return new x({
        root: new C(N(e))
      });
    default:
      s.K.error('OTEL_TRACES_SAMPLER value "' + e.OTEL_TRACES_SAMPLER + " invalid, defaulting to " + A + '".');
      return new w();
  }
}
function N(e) {
  if (void 0 === e.OTEL_TRACES_SAMPLER_ARG || "" === e.OTEL_TRACES_SAMPLER_ARG) {
    s.K.error("OTEL_TRACES_SAMPLER_ARG is blank, defaulting to 1.");
    return 1;
  }
  var t = Number(e.OTEL_TRACES_SAMPLER_ARG);
  return isNaN(t) ? (s.K.error("OTEL_TRACES_SAMPLER_ARG=" + e.OTEL_TRACES_SAMPLER_ARG + " was given, but it is invalid, defaulting to 1."), 1) : t < 0 || t > 1 ? (s.K.error("OTEL_TRACES_SAMPLER_ARG=" + e.OTEL_TRACES_SAMPLER_ARG + " was given, but it is out of range ([0..1]), defaulting to 1."), 1) : t;
}
var O = require(70450);
var R = function () {
  this.generateTraceId = L(16);
  this.generateSpanId = L(8);
};
var M = Buffer.allocUnsafe(16);
function L(e) {
  return function () {
    for (var t = 0; t < e / 4; t++) M.writeUInt32BE(Math.random() * Math.pow(2, 32) >>> 0, 4 * t);
    for (t = 0; t < e && !(M[t] > 0); t++) if (t === e - 1) {
      M[e - 1] = 1;
    }
    return M.toString("hex", 0, e);
  };
}
var D;
var B;
var F = function () {
  function e(e, t, n) {
    this._tracerProvider = n;
    var r;
    var i;
    var o;
    var s;
    var a = (r = t, i = {
      sampler: P()
    }, o = k(), (s = Object.assign({}, o, i, r)).generalLimits = Object.assign({}, o.generalLimits, r.generalLimits || {}), s.spanLimits = Object.assign({}, o.spanLimits, r.spanLimits || {}), s);
    this._sampler = a.sampler;
    this._generalLimits = a.generalLimits;
    this._spanLimits = a.spanLimits;
    this._idGenerator = t.idGenerator || new R();
    this.resource = n.resource;
    this.instrumentationLibrary = e;
  }
  e.prototype.startSpan = function (e, t, n) {
    var r;
    var h;
    var f;
    if (void 0 === t) {
      t = {};
    }
    if (void 0 === n) {
      n = i.D.active();
    }
    if (t.root) {
      n = o.g.deleteSpan(n);
    }
    var m = o.g.getSpan(n);
    if (p.Ll(n)) {
      s.K.debug("Instrumentation suppressed, returning Noop Span");
      return o.g.wrapSpanContext(a.Rr);
    }
    var g;
    var y;
    var v;
    var b = null == m ? void 0 : m.spanContext();
    var E = this._idGenerator.generateSpanId();
    if (b && o.g.isSpanContextValid(b)) {
      g = b.traceId;
      y = b.traceState;
      v = b.spanId;
    } else {
      g = this._idGenerator.generateTraceId();
    }
    var w = null !== (r = t.kind) && void 0 !== r ? r : c.M.INTERNAL;
    var T = (null !== (h = t.links) && void 0 !== h ? h : []).map(function (e) {
      return {
        context: e.context,
        attributes: d.FT(e.attributes)
      };
    });
    var S = d.FT(t.attributes);
    var x = this._sampler.shouldSample(n, g, e, w, S, T);
    y = null !== (f = x.traceState) && void 0 !== f ? f : y;
    var C = {
      traceId: g,
      spanId: E,
      traceFlags: x.decision === l.U.RECORD_AND_SAMPLED ? u.r.SAMPLED : u.r.NONE,
      traceState: y
    };
    if (x.decision === l.U.NOT_RECORD) {
      s.K.debug("Recording is off, propagating context in a non-recording span");
      return o.g.wrapSpanContext(C);
    }
    var I = new _(this, n, e, C, w, v, T, t.startTime);
    var A = d.FT(Object.assign(S, x.attributes));
    I.setAttributes(A);
    return I;
  };
  e.prototype.startActiveSpan = function (e, t, n, r) {
    var s;
    var a;
    var c;
    if (!(arguments.length < 2)) {
      if (2 === arguments.length) {
        c = t;
      } else {
        if (3 === arguments.length) {
          s = t;
          c = n;
        } else {
          s = t;
          a = n;
          c = r;
        }
      }
      var l = null != a ? a : i.D.active();
      var u = this.startSpan(e, s, l);
      var p = o.g.setSpan(l, u);
      return i.D.with(p, c, void 0, u);
    }
  };
  e.prototype.getGeneralLimits = function () {
    return this._generalLimits;
  };
  e.prototype.getSpanLimits = function () {
    return this._spanLimits;
  };
  e.prototype.getActiveSpanProcessor = function () {
    return this._tracerProvider.getActiveSpanProcessor();
  };
  return e;
}();
var j = require(68303);
var U = require(39009);
var $ = require(63135);
var V = require(49588);
var H = require(80926);
var q = require(95364);
var z = require(93290);
var K = function () {
  K = Object.assign || function (e) {
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
  return K.apply(this, arguments);
};
var G = function () {
  function e(e, t) {
    var n;
    var r = this;
    this._attributes = e;
    this.asyncAttributesPending = null != t;
    this._syncAttributes = null !== (n = this._attributes) && void 0 !== n ? n : {};
    this._asyncAttributesPromise = null == t ? void 0 : t.then(function (e) {
      r._attributes = Object.assign({}, r._attributes, e);
      r.asyncAttributesPending = !1;
      return e;
    }, function (e) {
      s.K.debug("a resource's async attributes promise rejected: %s", e);
      r.asyncAttributesPending = !1;
      return {};
    });
  }
  e.empty = function () {
    return e.EMPTY;
  };
  e.default = function () {
    var t;
    return new e(((t = {})[q.R9.SERVICE_NAME] = "unknown_service:" + process.argv0, t[q.R9.TELEMETRY_SDK_LANGUAGE] = z.m[q.R9.TELEMETRY_SDK_LANGUAGE], t[q.R9.TELEMETRY_SDK_NAME] = z.m[q.R9.TELEMETRY_SDK_NAME], t[q.R9.TELEMETRY_SDK_VERSION] = z.m[q.R9.TELEMETRY_SDK_VERSION], t));
  };
  Object.defineProperty(e.prototype, "attributes", {
    get: function () {
      var e;
      if (this.asyncAttributesPending) {
        s.K.error("Accessing resource attributes before async attributes settled");
      }
      return null !== (e = this._attributes) && void 0 !== e ? e : {};
    },
    enumerable: !1,
    configurable: !0
  });
  e.prototype.waitForAsyncAttributes = function () {
    e = this;
    t = void 0;
    r = function () {
      return function (e, t) {
        var n;
        var r;
        var i;
        var o;
        var s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
        o = {
          next: a(0),
          throw: a(1),
          return: a(2)
        };
        if ("function" == typeof Symbol) {
          o[Symbol.iterator] = function () {
            return this;
          };
        }
        return o;
        function a(o) {
          return function (a) {
            return function (o) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; s;) try {
                n = 1;
                if (r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
                switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                  case 0:
                  case 1:
                    i = o;
                    break;
                  case 4:
                    s.label++;
                    return {
                      value: o[1],
                      done: !1
                    };
                  case 5:
                    s.label++;
                    r = o[1];
                    o = [0];
                    continue;
                  case 7:
                    o = s.ops.pop();
                    s.trys.pop();
                    continue;
                  default:
                    if (!((i = (i = s.trys).length > 0 && i[i.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                      s = 0;
                      continue;
                    }
                    if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                      s.label = o[1];
                      break;
                    }
                    if (6 === o[0] && s.label < i[1]) {
                      s.label = i[1];
                      i = o;
                      break;
                    }
                    if (i && s.label < i[2]) {
                      s.label = i[2];
                      s.ops.push(o);
                      break;
                    }
                    if (i[2]) {
                      s.ops.pop();
                    }
                    s.trys.pop();
                    continue;
                }
                o = t.call(e, s);
              } catch (e) {
                o = [6, e];
                r = 0;
              } finally {
                n = i = 0;
              }
              if (5 & o[0]) throw o[1];
              return {
                value: o[0] ? o[1] : void 0,
                done: !0
              };
            }([o, a]);
          };
        }
      }(this, function (e) {
        switch (e.label) {
          case 0:
            return this.asyncAttributesPending ? [4, this._asyncAttributesPromise] : [3, 2];
          case 1:
            e.sent();
            e.label = 2;
          case 2:
            return [2];
        }
      });
    };
    return new ((n = void 0) || (n = Promise))(function (i, o) {
      function s(e) {
        try {
          c(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function a(e) {
        try {
          c(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function c(e) {
        var t;
        if (e.done) {
          i(e.value);
        } else {
          (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
      }
      c((r = r.apply(e, t || [])).next());
    });
    var e;
    var t;
    var n;
    var r;
  };
  e.prototype.merge = function (t) {
    var n;
    var r = this;
    if (!t) return this;
    var i = K(K({}, this._syncAttributes), null !== (n = t._syncAttributes) && void 0 !== n ? n : t.attributes);
    if (!this._asyncAttributesPromise && !t._asyncAttributesPromise) return new e(i);
    var o = Promise.all([this._asyncAttributesPromise, t._asyncAttributesPromise]).then(function (e) {
      var n;
      var i = function (e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n) return e;
        var r;
        var i;
        var o = n.call(e);
        var s = [];
        try {
          for (; (void 0 === t || t-- > 0) && !(r = o.next()).done;) s.push(r.value);
        } catch (e) {
          i = {
            error: e
          };
        } finally {
          try {
            if (r && !r.done && (n = o.return)) {
              n.call(o);
            }
          } finally {
            if (i) throw i.error;
          }
        }
        return s;
      }(e, 2);
      var o = i[0];
      var s = i[1];
      return K(K(K(K({}, r._syncAttributes), o), null !== (n = t._syncAttributes) && void 0 !== n ? n : t.attributes), s);
    });
    return new e(i, o);
  };
  e.EMPTY = new e({});
  return e;
}();
var W = function (e) {
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
};
var Q = function () {
  function e(e) {
    this._spanProcessors = e;
  }
  e.prototype.forceFlush = function () {
    var e;
    var t;
    var n = [];
    try {
      for (r = W(this._spanProcessors), i = r.next(), void 0; !i.done; i = r.next()) {
        var r;
        var i;
        var o = i.value;
        n.push(o.forceFlush());
      }
    } catch (t) {
      e = {
        error: t
      };
    } finally {
      try {
        if (i && !i.done && (t = r.return)) {
          t.call(r);
        }
      } finally {
        if (e) throw e.error;
      }
    }
    return new Promise(function (e) {
      Promise.all(n).then(function () {
        e();
      }).catch(function (t) {
        S.L(t || new Error("MultiSpanProcessor: forceFlush failed"));
        e();
      });
    });
  };
  e.prototype.onStart = function (e, t) {
    var n;
    var r;
    try {
      for (i = W(this._spanProcessors), o = i.next(), void 0; !o.done; o = i.next()) {
        var i;
        var o;
        o.value.onStart(e, t);
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
  };
  e.prototype.onEnd = function (e) {
    var t;
    var n;
    try {
      for (r = W(this._spanProcessors), i = r.next(), void 0; !i.done; i = r.next()) {
        var r;
        var i;
        i.value.onEnd(e);
      }
    } catch (e) {
      t = {
        error: e
      };
    } finally {
      try {
        if (i && !i.done && (n = r.return)) {
          n.call(r);
        }
      } finally {
        if (t) throw t.error;
      }
    }
  };
  e.prototype.shutdown = function () {
    var e;
    var t;
    var n = [];
    try {
      for (r = W(this._spanProcessors), i = r.next(), void 0; !i.done; i = r.next()) {
        var r;
        var i;
        var o = i.value;
        n.push(o.shutdown());
      }
    } catch (t) {
      e = {
        error: t
      };
    } finally {
      try {
        if (i && !i.done && (t = r.return)) {
          t.call(r);
        }
      } finally {
        if (e) throw e.error;
      }
    }
    return new Promise(function (e, t) {
      Promise.all(n).then(function () {
        e();
      }, t);
    });
  };
  return e;
}();
var Z = function () {
  function e() {}
  e.prototype.onStart = function (e, t) {};
  e.prototype.onEnd = function (e) {};
  e.prototype.shutdown = function () {
    return Promise.resolve();
  };
  e.prototype.forceFlush = function () {
    return Promise.resolve();
  };
  return e;
}();
var X = require(71399);
var Y = require(63420);
var J = require(52140);
var ee = function () {
  function e(e, t) {
    this._exporter = e;
    this._finishedSpans = [];
    this._droppedSpansCount = 0;
    var n = v.d();
    this._maxExportBatchSize = "number" == typeof (null == t ? void 0 : t.maxExportBatchSize) ? t.maxExportBatchSize : n.OTEL_BSP_MAX_EXPORT_BATCH_SIZE;
    this._maxQueueSize = "number" == typeof (null == t ? void 0 : t.maxQueueSize) ? t.maxQueueSize : n.OTEL_BSP_MAX_QUEUE_SIZE;
    this._scheduledDelayMillis = "number" == typeof (null == t ? void 0 : t.scheduledDelayMillis) ? t.scheduledDelayMillis : n.OTEL_BSP_SCHEDULE_DELAY;
    this._exportTimeoutMillis = "number" == typeof (null == t ? void 0 : t.exportTimeoutMillis) ? t.exportTimeoutMillis : n.OTEL_BSP_EXPORT_TIMEOUT;
    this._shutdownOnce = new X.q(this._shutdown, this);
    if (this._maxExportBatchSize > this._maxQueueSize) {
      s.K.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize");
      this._maxExportBatchSize = this._maxQueueSize;
    }
  }
  e.prototype.forceFlush = function () {
    return this._shutdownOnce.isCalled ? this._shutdownOnce.promise : this._flushAll();
  };
  e.prototype.onStart = function (e, t) {};
  e.prototype.onEnd = function (e) {
    if (this._shutdownOnce.isCalled) {
      if (0 != (e.spanContext().traceFlags & u.r.SAMPLED)) {
        this._addToBuffer(e);
      }
    }
  };
  e.prototype.shutdown = function () {
    return this._shutdownOnce.call();
  };
  e.prototype._shutdown = function () {
    var e = this;
    return Promise.resolve().then(function () {
      return e.onShutdown();
    }).then(function () {
      return e._flushAll();
    }).then(function () {
      return e._exporter.shutdown();
    });
  };
  e.prototype._addToBuffer = function (e) {
    if (this._finishedSpans.length >= this._maxQueueSize) {
      if (0 === this._droppedSpansCount) {
        s.K.debug("maxQueueSize reached, dropping spans");
      }
      return void this._droppedSpansCount++;
    }
    if (this._droppedSpansCount > 0) {
      s.K.warn("Dropped " + this._droppedSpansCount + " spans because maxQueueSize reached");
      this._droppedSpansCount = 0;
    }
    this._finishedSpans.push(e);
    this._maybeStartTimer();
  };
  e.prototype._flushAll = function () {
    var e = this;
    return new Promise(function (t, n) {
      for (r = [], i = 0, o = Math.ceil(e._finishedSpans.length / e._maxExportBatchSize), void 0; i < o; i++) {
        var r;
        var i;
        var o;
        r.push(e._flushOneBatch());
      }
      Promise.all(r).then(function () {
        t();
      }).catch(n);
    });
  };
  e.prototype._flushOneBatch = function () {
    var e = this;
    this._clearTimer();
    return 0 === this._finishedSpans.length ? Promise.resolve() : new Promise(function (t, n) {
      var r = setTimeout(function () {
        n(new Error("Timeout"));
      }, e._exportTimeoutMillis);
      i.D.with(p.hE(i.D.active()), function () {
        var i = e._finishedSpans.splice(0, e._maxExportBatchSize);
        var o = function () {
          return e._exporter.export(i, function (e) {
            var i;
            clearTimeout(r);
            if (e.code === Y.I.SUCCESS) {
              t();
            } else {
              n(null !== (i = e.error) && void 0 !== i ? i : new Error("BatchSpanProcessor: span export failed"));
            }
          });
        };
        var s = i.map(function (e) {
          return e.resource;
        }).filter(function (e) {
          return e.asyncAttributesPending;
        });
        if (0 === s.length) {
          o();
        } else {
          Promise.all(s.map(function (e) {
            var t;
            return null === (t = e.waitForAsyncAttributes) || void 0 === t ? void 0 : t.call(e);
          })).then(o, function (e) {
            S.L(e);
            n(e);
          });
        }
      });
    });
  };
  e.prototype._maybeStartTimer = function () {
    var e = this;
    if (void 0 === this._timer) {
      this._timer = setTimeout(function () {
        e._flushOneBatch().then(function () {
          if (e._finishedSpans.length > 0) {
            e._clearTimer();
            e._maybeStartTimer();
          }
        }).catch(function (e) {
          S.L(e);
        });
      }, this._scheduledDelayMillis);
      J.g(this._timer);
    }
  };
  e.prototype._clearTimer = function () {
    if (void 0 !== this._timer) {
      clearTimeout(this._timer);
      this._timer = void 0;
    }
  };
  return e;
}();
var te = (D = function (e, t) {
  D = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
      e[n] = t[n];
    }
  };
  return D(e, t);
}, function (e, t) {
  if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  function n() {
    this.constructor = e;
  }
  D(e, t);
  e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
var ne = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }
  te(t, e);
  t.prototype.onShutdown = function () {};
  return t;
}(ee);
!function (e) {
  e[e.resolved = 0] = "resolved";
  e[e.timeout = 1] = "timeout";
  e[e.error = 2] = "error";
  e[e.unresolved = 3] = "unresolved";
}(B || (B = {}));
var re = function () {
  function e(e) {
    var t;
    if (void 0 === e) {
      e = {};
    }
    this._registeredSpanProcessors = [];
    this._tracers = new Map();
    var n = U.T({}, k(), function (e) {
      var t;
      var n;
      var r;
      var i;
      var o;
      var s;
      var a;
      var c;
      var l;
      var u;
      var p;
      var d;
      var h = Object.assign({}, e.spanLimits);
      var f = O.vU();
      h.attributeCountLimit = null !== (s = null !== (o = null !== (i = null !== (n = null === (t = e.spanLimits) || void 0 === t ? void 0 : t.attributeCountLimit) && void 0 !== n ? n : null === (r = e.generalLimits) || void 0 === r ? void 0 : r.attributeCountLimit) && void 0 !== i ? i : f.OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT) && void 0 !== o ? o : f.OTEL_ATTRIBUTE_COUNT_LIMIT) && void 0 !== s ? s : O.qG;
      h.attributeValueLengthLimit = null !== (d = null !== (p = null !== (u = null !== (c = null === (a = e.spanLimits) || void 0 === a ? void 0 : a.attributeValueLengthLimit) && void 0 !== c ? c : null === (l = e.generalLimits) || void 0 === l ? void 0 : l.attributeValueLengthLimit) && void 0 !== u ? u : f.OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT) && void 0 !== p ? p : f.OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT) && void 0 !== d ? d : O.KR;
      return Object.assign({}, e, {
        spanLimits: h
      });
    }(e));
    this.resource = null !== (t = n.resource) && void 0 !== t ? t : G.empty();
    this.resource = G.default().merge(this.resource);
    this._config = Object.assign({}, n, {
      resource: this.resource
    });
    var r = this._buildExporterFromEnv();
    if (void 0 !== r) {
      var i = new ne(r);
      this.activeSpanProcessor = i;
    } else this.activeSpanProcessor = new Z();
  }
  e.prototype.getTracer = function (e, t, n) {
    var r = e + "@" + (t || "") + ":" + ((null == n ? void 0 : n.schemaUrl) || "");
    if (this._tracers.has(r)) {
      this._tracers.set(r, new F({
        name: e,
        version: t,
        schemaUrl: null == n ? void 0 : n.schemaUrl
      }, this._config, this));
    }
    return this._tracers.get(r);
  };
  e.prototype.addSpanProcessor = function (e) {
    if (0 === this._registeredSpanProcessors.length) {
      this.activeSpanProcessor.shutdown().catch(function (e) {
        return s.K.error("Error while trying to shutdown current span processor", e);
      });
    }
    this._registeredSpanProcessors.push(e);
    this.activeSpanProcessor = new Q(this._registeredSpanProcessors);
  };
  e.prototype.getActiveSpanProcessor = function () {
    return this.activeSpanProcessor;
  };
  e.prototype.register = function (e) {
    if (void 0 === e) {
      e = {};
    }
    o.g.setGlobalTracerProvider(this);
    if (void 0 === e.propagator) {
      e.propagator = this._buildPropagatorFromEnv();
    }
    if (e.contextManager) {
      i.D.setGlobalContextManager(e.contextManager);
    }
    if (e.propagator) {
      j.u.setGlobalPropagator(e.propagator);
    }
  };
  e.prototype.forceFlush = function () {
    var e = this._config.forceFlushTimeoutMillis;
    var t = this._registeredSpanProcessors.map(function (t) {
      return new Promise(function (n) {
        var r;
        var i = setTimeout(function () {
          n(new Error("Span processor did not completed within timeout period of " + e + " ms"));
          r = B.timeout;
        }, e);
        t.forceFlush().then(function () {
          clearTimeout(i);
          if (r !== B.timeout) {
            r = B.resolved;
            n(r);
          }
        }).catch(function (e) {
          clearTimeout(i);
          r = B.error;
          n(e);
        });
      });
    });
    return new Promise(function (e, n) {
      Promise.all(t).then(function (t) {
        var r = t.filter(function (e) {
          return e !== B.resolved;
        });
        if (r.length > 0) {
          n(r);
        } else {
          e();
        }
      }).catch(function (e) {
        return n([e]);
      });
    });
  };
  e.prototype.shutdown = function () {
    return this.activeSpanProcessor.shutdown();
  };
  e.prototype._getPropagator = function (e) {
    var t;
    return null === (t = this.constructor._registeredPropagators.get(e)) || void 0 === t ? void 0 : t();
  };
  e.prototype._getSpanExporter = function (e) {
    var t;
    return null === (t = this.constructor._registeredExporters.get(e)) || void 0 === t ? void 0 : t();
  };
  e.prototype._buildPropagatorFromEnv = function () {
    var e = this;
    var t = Array.from(new Set(v.d().OTEL_PROPAGATORS));
    var n = t.map(function (t) {
      var n = e._getPropagator(t);
      if (n) {
        s.K.warn('Propagator "' + t + '" requested through environment variable is unavailable.');
      }
      return n;
    }).reduce(function (e, t) {
      if (t) {
        e.push(t);
      }
      return e;
    }, []);
    return 0 === n.length ? void 0 : 1 === t.length ? n[0] : new $.Y({
      propagators: n
    });
  };
  e.prototype._buildExporterFromEnv = function () {
    var e = v.d().OTEL_TRACES_EXPORTER;
    if ("none" !== e && "" !== e) {
      var t = this._getSpanExporter(e);
      if (t) {
        s.K.error('Exporter "' + e + '" requested through environment variable is unavailable.');
      }
      return t;
    }
  };
  e._registeredPropagators = new Map([["tracecontext", function () {
    return new V.jf();
  }], ["baggage", function () {
    return new H.a();
  }]]);
  e._registeredExporters = new Map();
  return e;
}();
var ie = function () {
  function e() {}
  e.prototype.export = function (e, t) {
    return this._sendSpans(e, t);
  };
  e.prototype.shutdown = function () {
    this._sendSpans([]);
    return Promise.resolve();
  };
  e.prototype._exportInfo = function (e) {
    var t;
    return {
      traceId: e.spanContext().traceId,
      parentId: e.parentSpanId,
      traceState: null === (t = e.spanContext().traceState) || void 0 === t ? void 0 : t.serialize(),
      name: e.name,
      id: e.spanContext().spanId,
      kind: e.kind,
      timestamp: m.ji(e.startTime),
      duration: m.ji(e.duration),
      attributes: e.attributes,
      status: e.status,
      events: e.events,
      links: e.links
    };
  };
  e.prototype._sendSpans = function (e, t) {
    var n;
    var r;
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
      }(e), o = i.next(), void 0; !o.done; o = i.next()) {
        var i;
        var o;
        var s = o.value;
        console.dir(this._exportInfo(s), {
          depth: 3
        });
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
    if (t) return t({
      code: Y.I.SUCCESS
    });
  };
  return e;
}();
var oe = function () {
  function e() {
    this._finishedSpans = [];
    this._stopped = !1;
  }
  e.prototype.export = function (e, t) {
    var n;
    if (this._stopped) return t({
      code: Y.I.FAILED,
      error: new Error("Exporter has been stopped")
    });
    (n = this._finishedSpans).push.apply(n, function (e, t, n) {
      if (n || 2 === arguments.length) for (i = 0, o = t.length, void 0; i < o; i++) {
        var r;
        var i;
        var o;
        if (!r && i in t) {
          if (r) {
            r = Array.prototype.slice.call(t, 0, i);
          }
          r[i] = t[i];
        }
      }
      return e.concat(r || Array.prototype.slice.call(t));
    }([], function (e, t) {
      var n = "function" == typeof Symbol && e[Symbol.iterator];
      if (!n) return e;
      var r;
      var i;
      var o = n.call(e);
      var s = [];
      try {
        for (; (void 0 === t || t-- > 0) && !(r = o.next()).done;) s.push(r.value);
      } catch (e) {
        i = {
          error: e
        };
      } finally {
        try {
          if (r && !r.done && (n = o.return)) {
            n.call(o);
          }
        } finally {
          if (i) throw i.error;
        }
      }
      return s;
    }(e), !1));
    setTimeout(function () {
      return t({
        code: Y.I.SUCCESS
      });
    }, 0);
  };
  e.prototype.shutdown = function () {
    this._stopped = !0;
    this._finishedSpans = [];
    return Promise.resolve();
  };
  e.prototype.reset = function () {
    this._finishedSpans = [];
  };
  e.prototype.getFinishedSpans = function () {
    return this._finishedSpans;
  };
  return e;
}();
var se = require(47593);
var ae = function () {
  function e(e) {
    this._exporter = e;
    this._shutdownOnce = new X.q(this._shutdown, this);
    this._unresolvedExports = new Set();
  }
  e.prototype.forceFlush = function () {
    e = this;
    t = void 0;
    r = function () {
      return function (e, t) {
        var n;
        var r;
        var i;
        var o;
        var s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
        o = {
          next: a(0),
          throw: a(1),
          return: a(2)
        };
        if ("function" == typeof Symbol) {
          o[Symbol.iterator] = function () {
            return this;
          };
        }
        return o;
        function a(o) {
          return function (a) {
            return function (o) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; s;) try {
                n = 1;
                if (r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
                switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                  case 0:
                  case 1:
                    i = o;
                    break;
                  case 4:
                    s.label++;
                    return {
                      value: o[1],
                      done: !1
                    };
                  case 5:
                    s.label++;
                    r = o[1];
                    o = [0];
                    continue;
                  case 7:
                    o = s.ops.pop();
                    s.trys.pop();
                    continue;
                  default:
                    if (!((i = (i = s.trys).length > 0 && i[i.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                      s = 0;
                      continue;
                    }
                    if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                      s.label = o[1];
                      break;
                    }
                    if (6 === o[0] && s.label < i[1]) {
                      s.label = i[1];
                      i = o;
                      break;
                    }
                    if (i && s.label < i[2]) {
                      s.label = i[2];
                      s.ops.push(o);
                      break;
                    }
                    if (i[2]) {
                      s.ops.pop();
                    }
                    s.trys.pop();
                    continue;
                }
                o = t.call(e, s);
              } catch (e) {
                o = [6, e];
                r = 0;
              } finally {
                n = i = 0;
              }
              if (5 & o[0]) throw o[1];
              return {
                value: o[0] ? o[1] : void 0,
                done: !0
              };
            }([o, a]);
          };
        }
      }(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, Promise.all(Array.from(this._unresolvedExports))];
          case 1:
            e.sent();
            return [2];
        }
      });
    };
    return new ((n = void 0) || (n = Promise))(function (i, o) {
      function s(e) {
        try {
          c(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function a(e) {
        try {
          c(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function c(e) {
        var t;
        if (e.done) {
          i(e.value);
        } else {
          (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
      }
      c((r = r.apply(e, t || [])).next());
    });
    var e;
    var t;
    var n;
    var r;
  };
  e.prototype.onStart = function (e, t) {};
  e.prototype.onEnd = function (e) {
    var t;
    var n;
    var r = this;
    if (!this._shutdownOnce.isCalled && 0 != (e.spanContext().traceFlags & u.r.SAMPLED)) {
      var i = function () {
        return se.internal._export(r._exporter, [e]).then(function (e) {
          var t;
          if (e.code !== Y.I.SUCCESS) {
            S.L(null !== (t = e.error) && void 0 !== t ? t : new Error("SimpleSpanProcessor: span export failed (status " + e + ")"));
          }
        }).catch(function (e) {
          S.L(e);
        });
      };
      if (e.resource.asyncAttributesPending) {
        var o = null === (n = (t = e.resource).waitForAsyncAttributes) || void 0 === n ? void 0 : n.call(t).then(function () {
          if (null != o) {
            r._unresolvedExports.delete(o);
          }
          return i();
        }, function (e) {
          return S.L(e);
        });
        if (null != o) {
          this._unresolvedExports.add(o);
        }
      } else i();
    }
  };
  e.prototype.shutdown = function () {
    return this._shutdownOnce.call();
  };
  e.prototype._shutdown = function () {
    return this._exporter.shutdown();
  };
  return e;
}();