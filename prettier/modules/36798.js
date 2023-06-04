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
exports.preAggregatedMetricsTelemetryProcessor = void 0;
var i = require(55290);
var o = require(62309);
var s = require(55290);
exports.preAggregatedMetricsTelemetryProcessor = function (e, t) {
  if (o.isEnabled()) switch (e.data.baseType) {
    case s.TelemetryTypeString.Exception:
      var n = e.data.baseData;
      n.properties = r(r({}, n.properties), {
        "_MS.ProcessedByMetricExtractors": "(Name:'Exceptions', Ver:'1.1')"
      });
      var a = {
        cloudRoleInstance: e.tags[t.keys.cloudRoleInstance],
        cloudRoleName: e.tags[t.keys.cloudRole]
      };
      o.countException(a);
      break;
    case s.TelemetryTypeString.Trace:
      var c = e.data.baseData;
      c.properties = r(r({}, c.properties), {
        "_MS.ProcessedByMetricExtractors": "(Name:'Traces', Ver:'1.1')"
      });
      var l = {
        cloudRoleInstance: e.tags[t.keys.cloudRoleInstance],
        cloudRoleName: e.tags[t.keys.cloudRole],
        traceSeverityLevel: i.SeverityLevel[c.severity]
      };
      o.countTrace(l);
      break;
    case s.TelemetryTypeString.Request:
      var u = e.data.baseData;
      u.properties = r(r({}, u.properties), {
        "_MS.ProcessedByMetricExtractors": "(Name:'Requests', Ver:'1.1')"
      });
      var p = {
        cloudRoleInstance: e.tags[t.keys.cloudRoleInstance],
        cloudRoleName: e.tags[t.keys.cloudRole],
        operationSynthetic: e.tags[t.keys.operationSyntheticSource],
        requestSuccess: u.success,
        requestResultCode: u.responseCode
      };
      o.countRequest(u.duration, p);
      break;
    case s.TelemetryTypeString.Dependency:
      var d = e.data.baseData;
      d.properties = r(r({}, d.properties), {
        "_MS.ProcessedByMetricExtractors": "(Name:'Dependencies', Ver:'1.1')"
      });
      var h = {
        cloudRoleInstance: e.tags[t.keys.cloudRoleInstance],
        cloudRoleName: e.tags[t.keys.cloudRole],
        operationSynthetic: e.tags[t.keys.operationSyntheticSource],
        dependencySuccess: d.success,
        dependencyType: d.type,
        dependencyTarget: d.target,
        dependencyResultCode: d.resultCode
      };
      o.countDependency(d.duration, h);
  }
  return !0;
};