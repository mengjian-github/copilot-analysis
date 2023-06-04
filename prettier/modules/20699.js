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
exports.AsyncScopeManager = exports.OpenTelemetryScopeManagerWrapper = void 0;
var i = require(70894);
var o = require(82361);
var OpenTelemetryScopeManagerWrapper = function () {
  function e() {}
  e.prototype.active = function () {
    var e = this;
    var t = i.CorrelationContextManager.getCurrentContext();
    return r(r({}, t), {
      getValue: function (n) {
        return e._activeSymbol ? n === e._activeSymbol && t : (e._activeSymbol = n, t);
      },
      setValue: function () {}
    });
  };
  e.prototype.with = function (t, n) {
    var r = t.parentSpanId;
    var o = t.name;
    var s = e._spanToContext(t, r, o);
    return i.CorrelationContextManager.runWithContext(s, n)();
  };
  e.prototype.bind = function (e) {
    return "function" == typeof e ? i.CorrelationContextManager.wrapCallback(e) : (e instanceof o.EventEmitter && i.CorrelationContextManager.wrapEmitter(e), e);
  };
  e.prototype.enable = function () {
    i.CorrelationContextManager.enable();
    return this;
  };
  e.prototype.disable = function () {
    i.CorrelationContextManager.disable();
    return this;
  };
  e._spanToContext = function (e, t, n) {
    var o = e.spanContext ? e.spanContext() : e.context();
    var s = r(r({}, e.spanContext()), {
      traceFlags: e.spanContext().traceFlags
    });
    var a = t ? "|" + o.traceId + "." + t + "." : o.traceId;
    var c = i.CorrelationContextManager.getCurrentContext();
    if (c) {
      s.traceId = c.operation.id;
      if (t) {
        a = c.operation.parentId;
      }
    }
    return i.CorrelationContextManager.spanToContextObject(s, a, n);
  };
  return e;
}();
exports.OpenTelemetryScopeManagerWrapper = OpenTelemetryScopeManagerWrapper;
exports.AsyncScopeManager = new OpenTelemetryScopeManagerWrapper();