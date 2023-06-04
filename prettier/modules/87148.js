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
var i = require(22037);
var o = require(55290);
var s = require(63580);
var a = require(25740);
var c = require(95282);
var l = a.w3cTraceId();
var u = function () {
  function e() {}
  e.createQuickPulseEnvelope = function (e, t, n, r) {
    var o = i && "function" == typeof i.hostname && i.hostname() || "Unknown";
    var s = r.tags && r.keys && r.keys.cloudRoleInstance && r.tags[r.keys.cloudRoleInstance] || o;
    var a = r.tags && r.keys && r.keys.cloudRole && r.tags[r.keys.cloudRole] || null;
    return {
      Documents: t.length > 0 ? t : null,
      InstrumentationKey: n.instrumentationKey || "",
      Metrics: e.length > 0 ? e : null,
      InvariantVersion: 1,
      Timestamp: "/Date(" + Date.now() + ")/",
      Version: r.tags[r.keys.internalSdkVersion],
      StreamId: l,
      MachineName: o,
      Instance: s,
      RoleName: a
    };
  };
  e.createQuickPulseMetric = function (e) {
    return {
      Name: e.name,
      Value: e.value,
      Weight: e.count || 1
    };
  };
  e.telemetryEnvelopeToQuickPulseDocument = function (t) {
    switch (t.data.baseType) {
      case o.TelemetryTypeString.Event:
        return e.createQuickPulseEventDocument(t);
      case o.TelemetryTypeString.Exception:
        return e.createQuickPulseExceptionDocument(t);
      case o.TelemetryTypeString.Trace:
        return e.createQuickPulseTraceDocument(t);
      case o.TelemetryTypeString.Dependency:
        return e.createQuickPulseDependencyDocument(t);
      case o.TelemetryTypeString.Request:
        return e.createQuickPulseRequestDocument(t);
    }
    return null;
  };
  e.createQuickPulseEventDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var i = t.data.baseData.name;
    return r(r({}, n), {
      Name: i
    });
  };
  e.createQuickPulseTraceDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var i = t.data.baseData.severityLevel || 0;
    return r(r({}, n), {
      Message: t.data.baseData.message,
      SeverityLevel: o.SeverityLevel[i]
    });
  };
  e.createQuickPulseExceptionDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var i = t.data.baseData.exceptions;
    var o = "";
    var s = "";
    var a = "";
    if (i && i.length > 0) {
      if (i[0].parsedStack && i[0].parsedStack.length > 0) {
        i[0].parsedStack.forEach(function (e) {
          o += e.assembly + "\n";
        });
      } else {
        if (i[0].stack && i[0].stack.length > 0) {
          o = i[0].stack;
        }
      }
      s = i[0].message;
      a = i[0].typeName;
    }
    return r(r({}, n), {
      Exception: o,
      ExceptionMessage: s,
      ExceptionType: a
    });
  };
  e.createQuickPulseRequestDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var i = t.data.baseData;
    return r(r({}, n), {
      Name: i.name,
      Success: i.success,
      Duration: i.duration,
      ResponseCode: i.responseCode,
      OperationName: i.name
    });
  };
  e.createQuickPulseDependencyDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var i = t.data.baseData;
    return r(r({}, n), {
      Name: i.name,
      Target: i.target,
      Success: i.success,
      Duration: i.duration,
      ResultCode: i.resultCode,
      CommandName: i.data,
      OperationName: n.OperationId,
      DependencyTypeName: i.type
    });
  };
  e.createQuickPulseDocument = function (t) {
    var n;
    var r;
    if (t.data.baseType) {
      r = s.TelemetryTypeStringToQuickPulseType[t.data.baseType];
      n = s.TelemetryTypeStringToQuickPulseDocumentType[t.data.baseType];
    } else {
      c.warn("Document type invalid; not sending live metric document", t.data.baseType);
    }
    return {
      DocumentType: n,
      __type: r,
      OperationId: t.tags[e.keys.operationId],
      Version: "1.0",
      Properties: e.aggregateProperties(t)
    };
  };
  e.aggregateProperties = function (e) {
    var t = [];
    var n = e.data.baseData.measurements || {};
    for (var r in n) if (n.hasOwnProperty(r)) {
      var i = {
        key: r,
        value: n[r]
      };
      t.push(i);
    }
    var o = e.data.baseData.properties || {};
    for (var r in o) if (o.hasOwnProperty(r)) {
      i = {
        key: r,
        value: o[r]
      };
      t.push(i);
    }
    return t;
  };
  e.keys = new o.ContextTagKeys();
  return e;
}();
module.exports = u;