exports.wp = exports.qP = void 0;
var r = require(94284);
var i = require(63580);
var o = require(84953);
var s = require(65946);
var a = require(20699);
var c = [];
exports.qP = function (e) {
  try {
    var t = e.data;
    var n = s.spanToTelemetryContract(t);
    a.AsyncScopeManager.with(t, function () {
      c.forEach(function (e) {
        if (t.kind === r.SpanKind.SERVER || t.kind === r.SpanKind.CONSUMER) {
          e.trackRequest(n);
        } else {
          if (t.kind !== r.SpanKind.CLIENT && t.kind !== r.SpanKind.INTERNAL && t.kind !== r.SpanKind.PRODUCER) {
            e.trackDependency(n);
          }
        }
      });
    });
  } catch (e) {}
};
exports.wp = function (e, n) {
  if (e) {
    if (c.find(function (e) {
      return e == n;
    })) return;
    if (0 === c.length) {
      o.channel.subscribe("azure-coretracing", exports.qP, o.trueFilter, function (e, t) {
        var r = n.getStatsbeat();
        if (r) {
          r.addInstrumentation(i.StatsbeatInstrumentation.AZURE_CORE_TRACING);
        }
      });
    }
    c.push(n);
  } else if (0 === (c = c.filter(function (e) {
    return e != n;
  })).length) {
    o.channel.unsubscribe("azure-coretracing", exports.qP);
  }
};