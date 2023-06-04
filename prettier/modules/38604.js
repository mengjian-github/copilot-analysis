Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.azureCoreTracing = exports.AzureMonitorSymbol = void 0;
var r = require(84953);
exports.AzureMonitorSymbol = "Azure_Monitor_Tracer";
var i = "azure-coretracing";
var o = !1;
exports.azureCoreTracing = {
  versionSpecifier: ">= 1.0.0 < 2.0.0",
  patch: function (e) {
    if (o) return e;
    try {
      var s = require(82506);
      var a = require(94284);
      var c = new s.BasicTracerProvider();
      var l = c.getTracer("applicationinsights tracer");
      if (e.setTracer) {
        var u = e.setTracer;
        e.setTracer = function (e) {
          var n = e.startSpan;
          e.startSpan = function (e, t, o) {
            var s = n.call(this, e, t, o);
            var a = s.end;
            s.end = function () {
              var e = a.apply(this, arguments);
              r.channel.publish(i, s);
              return e;
            };
            return s;
          };
          e[exports.AzureMonitorSymbol] = !0;
          u.call(this, e);
        };
        a.trace.getSpan(a.context.active());
        e.setTracer(l);
      } else {
        var p = a.trace.setGlobalTracerProvider;
        a.trace.setGlobalTracerProvider = function (e) {
          var n = e.getTracer;
          e.getTracer = function (e, o) {
            var s = n.call(this, e, o);
            if (!s[exports.AzureMonitorSymbol]) {
              var a = s.startSpan;
              s.startSpan = function (e, t, n) {
                var o = a.call(this, e, t, n);
                var s = o.end;
                o.end = function () {
                  var e = s.apply(this, arguments);
                  r.channel.publish(i, o);
                  return e;
                };
                return o;
              };
              s[exports.AzureMonitorSymbol] = !0;
            }
            return s;
          };
          return p.call(this, e);
        };
        c.register();
        a.trace.getSpan(a.context.active());
        var d = require(78298);
        var h = require(40942);
        d.registerInstrumentations({
          instrumentations: [h.createAzureSdkInstrumentation()]
        });
      }
      o = !0;
    } catch (e) {}
    return e;
  },
  publisherName: i
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("@azure/core-tracing", exports.azureCoreTracing);
};