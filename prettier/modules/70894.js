Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CorrelationContextManager = void 0;
var r = require(95282);
var i = require(87396);
var o = require(58090);
var s = require(10420);
var a = require(86694);
var c = require(25740);
var CorrelationContextManager = function () {
  function e() {}
  e.getCurrentContext = function () {
    if (!e.enabled) return null;
    var t = e.session.get(e.CONTEXT_NAME);
    return void 0 === t ? null : t;
  };
  e.generateContextObject = function (e, t, n, r, i, o) {
    t = t || e;
    return this.enabled ? {
      operation: {
        name: n,
        id: e,
        parentId: t,
        traceparent: i,
        tracestate: o
      },
      customProperties: new u(r)
    } : null;
  };
  e.spanToContextObject = function (t, n, r) {
    var i = new o();
    i.traceId = t.traceId;
    i.spanId = t.spanId;
    i.traceFlag = o.formatOpenTelemetryTraceFlags(t.traceFlags) || o.DEFAULT_TRACE_FLAG;
    i.parentId = n;
    return e.generateContextObject(i.traceId, i.parentId, r, null, i);
  };
  e.runWithContext = function (t, n) {
    var i;
    if (e.enabled) try {
      return e.session.bind(n, ((i = {})[e.CONTEXT_NAME] = t, i))();
    } catch (e) {
      r.warn("Error binding to session context", c.dumpObj(e));
    }
    return n();
  };
  e.wrapEmitter = function (t) {
    if (e.enabled) try {
      e.session.bindEmitter(t);
    } catch (e) {
      r.warn("Error binding to session context", c.dumpObj(e));
    }
  };
  e.wrapCallback = function (t, n) {
    var i;
    if (e.enabled) try {
      return e.session.bind(t, n ? ((i = {})[e.CONTEXT_NAME] = n, i) : void 0);
    } catch (e) {
      r.warn("Error binding to session context", c.dumpObj(e));
    }
    return t;
  };
  e.enable = function (t) {
    if (this.enabled) {
      if (this.isNodeVersionCompatible()) {
        if (e.hasEverEnabled) {
          this.forceClsHooked = t;
          this.hasEverEnabled = !0;
          if (void 0 === this.cls) {
            if (!0 === e.forceClsHooked || void 0 === e.forceClsHooked && e.shouldUseClsHooked()) {
              this.cls = require(39562);
            } else {
              this.cls = require(13057);
            }
          }
          e.session = this.cls.createNamespace("AI-CLS-Session");
          i.registerContextPreservation(function (t) {
            try {
              return e.session.bind(t);
            } catch (e) {
              r.warn("Error binding to session context", c.dumpObj(e));
            }
          });
        }
        this.enabled = !0;
      } else {
        this.enabled = !1;
      }
    }
  };
  e.startOperation = function (t, n) {
    var i = t && t.traceContext || null;
    var c = t && t.spanContext ? t : null;
    var l = t && t.traceId ? t : null;
    var u = t && t.headers;
    if (c) return this.spanToContextObject(c.spanContext(), c.parentSpanId, c.name);
    if (l) return this.spanToContextObject(l, "|" + l.traceId + "." + l.spanId + ".", "string" == typeof n ? n : "");
    var p = "string" == typeof n ? n : "";
    if (i) {
      var d = null;
      var h = null;
      p = i.attributes.OperationName || p;
      if (n) {
        var f = n;
        f.headers && (f.headers.traceparent ? d = new o(f.headers.traceparent) : f.headers["request-id"] && (d = new o(null, f.headers["request-id"])), f.headers.tracestate && (h = new s(f.headers.tracestate)));
      }
      if (d) {
        d = new o(i.traceparent);
      }
      if (h) {
        h = new s(i.tracestate);
      }
      var m = void 0;
      if ("object" == typeof n) {
        m = (g = new a(n)).getCorrelationContextHeader();
        p = g.getOperationName({});
      }
      return e.generateContextObject(d.traceId, d.parentId, p, m, d, h);
    }
    if (u) {
      d = new o(u.traceparent ? u.traceparent.toString() : null);
      h = new s(u.tracestate ? u.tracestate.toString() : null);
      var g = new a(t);
      return e.generateContextObject(d.traceId, d.parentId, g.getOperationName({}), g.getCorrelationContextHeader(), d, h);
    }
    r.warn("startOperation was called with invalid arguments", arguments);
    return null;
  };
  e.disable = function () {
    this.enabled = !1;
  };
  e.reset = function () {
    if (e.hasEverEnabled) {
      e.session = null;
      e.session = this.cls.createNamespace("AI-CLS-Session");
    }
  };
  e.isNodeVersionCompatible = function () {
    var e = process.versions.node.split(".");
    return parseInt(e[0]) > 3 || parseInt(e[0]) > 2 && parseInt(e[1]) > 2;
  };
  e.shouldUseClsHooked = function () {
    var e = process.versions.node.split(".");
    return parseInt(e[0]) > 8 || parseInt(e[0]) >= 8 && parseInt(e[1]) >= 2;
  };
  e.canUseClsHooked = function () {
    var e = process.versions.node.split(".");
    var t = parseInt(e[0]) > 8 || parseInt(e[0]) >= 8 && parseInt(e[1]) >= 0;
    var n = parseInt(e[0]) < 8 || parseInt(e[0]) <= 8 && parseInt(e[1]) < 2;
    var r = parseInt(e[0]) > 4 || parseInt(e[0]) >= 4 && parseInt(e[1]) >= 7;
    return !(t && n) && r;
  };
  e.enabled = !1;
  e.hasEverEnabled = !1;
  e.forceClsHooked = void 0;
  e.CONTEXT_NAME = "ApplicationInsights-Context";
  return e;
}();
exports.CorrelationContextManager = CorrelationContextManager;
var u = function () {
  function e(e) {
    this.props = [];
    this.addHeaderData(e);
  }
  e.prototype.addHeaderData = function (e) {
    var t = e ? e.split(", ") : [];
    this.props = t.map(function (e) {
      var t = e.split("=");
      return {
        key: t[0],
        value: t[1]
      };
    }).concat(this.props);
  };
  e.prototype.serializeToHeader = function () {
    return this.props.map(function (e) {
      return e.key + "=" + e.value;
    }).join(", ");
  };
  e.prototype.getProperty = function (e) {
    for (var t = 0; t < this.props.length; ++t) {
      var n = this.props[t];
      if (n.key === e) return n.value;
    }
  };
  e.prototype.setProperty = function (t, n) {
    if (e.bannedCharacters.test(t) || e.bannedCharacters.test(n)) r.warn("Correlation context property keys and values must not contain ',' or '='. setProperty was called with key: " + t + " and value: " + n);else {
      for (var i = 0; i < this.props.length; ++i) {
        var o = this.props[i];
        if (o.key === t) return void (o.value = n);
      }
      this.props.push({
        key: t,
        value: n
      });
    }
  };
  e.bannedCharacters = /[,=]/;
  return e;
}();