var r = require(55290);
var i = require(25740);
var o = require(70894);
var s = require(95282);
var a = function () {
  function e() {}
  e.createEnvelope = function (t, n, o, s, a) {
    var c = null;
    switch (n) {
      case r.TelemetryType.Trace:
        c = e.createTraceData(t);
        break;
      case r.TelemetryType.Dependency:
        c = e.createDependencyData(t);
        break;
      case r.TelemetryType.Event:
        c = e.createEventData(t);
        break;
      case r.TelemetryType.Exception:
        c = e.createExceptionData(t);
        break;
      case r.TelemetryType.Request:
        c = e.createRequestData(t);
        break;
      case r.TelemetryType.Metric:
        c = e.createMetricData(t);
        break;
      case r.TelemetryType.Availability:
        c = e.createAvailabilityData(t);
        break;
      case r.TelemetryType.PageView:
        c = e.createPageViewData(t);
    }
    if (c && c.baseData && r.domainSupportsProperties(c.baseData)) {
      if (o) if (c.baseData.properties) {
        for (var l in o) if (c.baseData.properties[l]) {
          c.baseData.properties[l] = o[l];
        }
      } else c.baseData.properties = o;
      e.addAzureFunctionsCorrelationProperties(c.baseData.properties);
      if (c.baseData.properties) {
        c.baseData.properties = i.validateStringMap(c.baseData.properties);
      }
    }
    var u = a && a.instrumentationKey || "";
    var p = new r.Envelope();
    p.data = c;
    p.iKey = u;
    p.name = "Microsoft.ApplicationInsights." + u.replace(/-/g, "") + "." + c.baseType.substr(0, c.baseType.length - 4);
    p.tags = this.getTags(s, t.tagOverrides);
    p.time = new Date().toISOString();
    p.ver = 1;
    p.sampleRate = a ? a.samplingPercentage : 100;
    if (n === r.TelemetryType.Metric) {
      p.sampleRate = 100;
    }
    return p;
  };
  e.addAzureFunctionsCorrelationProperties = function (e) {
    var t = o.CorrelationContextManager.getCurrentContext();
    if (t && t.customProperties && t.customProperties.getProperty instanceof Function) {
      e = e || {};
      var n = t.customProperties.getProperty("InvocationId");
      if (n) {
        e.InvocationId = n;
      }
      if (n = t.customProperties.getProperty("ProcessId")) {
        e.ProcessId = n;
      }
      if (n = t.customProperties.getProperty("LogLevel")) {
        e.LogLevel = n;
      }
      if (n = t.customProperties.getProperty("Category")) {
        e.Category = n;
      }
      if (n = t.customProperties.getProperty("HostInstanceId")) {
        e.HostInstanceId = n;
      }
      if (n = t.customProperties.getProperty("AzFuncLiveLogsSessionId")) {
        e.AzFuncLiveLogsSessionId = n;
      }
    }
  };
  e.truncateProperties = function (e) {
    if (e.properties) try {
      for (t = {}, n = Object.keys(e.properties), r = Object.values(e.properties), o = 0, void 0; o < n.length; o++) {
        var t;
        var n;
        var r;
        var o;
        if (n[o].length <= 150) {
          if (i.isDate(r[o])) {
            if (null == r[o]) {
              r[o] = "";
            }
            if ("object" == typeof r[o]) {
              r[o] = i.stringify(r[o]);
            }
            t[n[o]] = String(r[o]).substring(0, 8192);
          }
          t[n[o]] = r[o];
        }
      }
      return t;
    } catch (e) {
      s.warn("Failed to properly truncate telemetry properties: ", e);
    }
  };
  e.createTraceData = function (e) {
    var t;
    var n = new r.MessageData();
    n.message = null === (t = e.message) || void 0 === t ? void 0 : t.substring(0, 32768);
    n.properties = this.truncateProperties(e);
    if (isNaN(e.severity)) {
      n.severityLevel = r.SeverityLevel.Information;
    } else {
      n.severityLevel = e.severity;
    }
    var i = new r.Data();
    i.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Trace);
    i.baseData = n;
    return i;
  };
  e.createDependencyData = function (e) {
    var t;
    var n;
    var o;
    var s = new r.RemoteDependencyData();
    s.name = null === (t = e.name) || void 0 === t ? void 0 : t.substring(0, 1024);
    s.data = null === (n = e.data) || void 0 === n ? void 0 : n.substring(0, 8192);
    s.target = null === (o = e.target) || void 0 === o ? void 0 : o.substring(0, 1024);
    s.duration = i.msToTimeSpan(e.duration);
    s.success = e.success;
    s.type = e.dependencyTypeName;
    s.properties = this.truncateProperties(e);
    s.resultCode = e.resultCode ? e.resultCode.toString() : "0";
    if (e.id) {
      s.id = e.id;
    } else {
      s.id = i.w3cTraceId();
    }
    var a = new r.Data();
    a.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Dependency);
    a.baseData = s;
    return a;
  };
  e.createEventData = function (e) {
    var t;
    var n = new r.EventData();
    n.name = null === (t = e.name) || void 0 === t ? void 0 : t.substring(0, 512);
    n.properties = this.truncateProperties(e);
    n.measurements = e.measurements;
    var i = new r.Data();
    i.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Event);
    i.baseData = n;
    return i;
  };
  e.createExceptionData = function (e) {
    var t;
    var n;
    var o = new r.ExceptionData();
    o.properties = this.truncateProperties(e);
    if (isNaN(e.severity)) {
      o.severityLevel = r.SeverityLevel.Error;
    } else {
      o.severityLevel = e.severity;
    }
    o.measurements = e.measurements;
    o.exceptions = [];
    var s = e.exception.stack;
    var a = new r.ExceptionDetails();
    a.message = null === (t = e.exception.message) || void 0 === t ? void 0 : t.substring(0, 32768);
    a.typeName = null === (n = e.exception.name) || void 0 === n ? void 0 : n.substring(0, 1024);
    a.parsedStack = this.parseStack(s);
    a.hasFullStack = i.isArray(a.parsedStack) && a.parsedStack.length > 0;
    o.exceptions.push(a);
    var c = new r.Data();
    c.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Exception);
    c.baseData = o;
    return c;
  };
  e.createRequestData = function (e) {
    var t;
    var n;
    var o;
    var s;
    var a = new r.RequestData();
    if (e.id) {
      a.id = e.id;
    } else {
      a.id = i.w3cTraceId();
    }
    a.name = null === (t = e.name) || void 0 === t ? void 0 : t.substring(0, 1024);
    a.url = null === (n = e.url) || void 0 === n ? void 0 : n.substring(0, 2048);
    a.source = null === (o = e.source) || void 0 === o ? void 0 : o.substring(0, 1024);
    a.duration = i.msToTimeSpan(e.duration);
    a.responseCode = null === (s = e.resultCode ? e.resultCode.toString() : "0") || void 0 === s ? void 0 : s.substring(0, 1024);
    a.success = e.success;
    a.properties = this.truncateProperties(e);
    a.measurements = e.measurements;
    var c = new r.Data();
    c.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Request);
    c.baseData = a;
    return c;
  };
  e.createMetricData = function (e) {
    var t;
    var n = new r.MetricData();
    n.metrics = [];
    var i = new r.DataPoint();
    i.count = isNaN(e.count) ? 1 : e.count;
    i.kind = r.DataPointType.Aggregation;
    i.max = isNaN(e.max) ? e.value : e.max;
    i.min = isNaN(e.min) ? e.value : e.min;
    i.name = null === (t = e.name) || void 0 === t ? void 0 : t.substring(0, 1024);
    i.stdDev = isNaN(e.stdDev) ? 0 : e.stdDev;
    i.value = e.value;
    i.ns = e.namespace;
    n.metrics.push(i);
    n.properties = this.truncateProperties(e);
    var o = new r.Data();
    o.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Metric);
    o.baseData = n;
    return o;
  };
  e.createAvailabilityData = function (e) {
    var t;
    var n;
    var o = new r.AvailabilityData();
    if (e.id) {
      o.id = e.id;
    } else {
      o.id = i.w3cTraceId();
    }
    o.name = null === (t = e.name) || void 0 === t ? void 0 : t.substring(0, 1024);
    o.duration = i.msToTimeSpan(e.duration);
    o.success = e.success;
    o.runLocation = e.runLocation;
    o.message = null === (n = e.message) || void 0 === n ? void 0 : n.substring(0, 8192);
    o.measurements = e.measurements;
    o.properties = this.truncateProperties(e);
    var s = new r.Data();
    s.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Availability);
    s.baseData = o;
    return s;
  };
  e.createPageViewData = function (e) {
    var t;
    var n;
    var o = new r.PageViewData();
    o.name = null === (t = e.name) || void 0 === t ? void 0 : t.substring(0, 1024);
    o.duration = i.msToTimeSpan(e.duration);
    o.url = null === (n = e.url) || void 0 === n ? void 0 : n.substring(0, 2048);
    o.measurements = e.measurements;
    o.properties = this.truncateProperties(e);
    var s = new r.Data();
    s.baseType = r.telemetryTypeToBaseType(r.TelemetryType.PageView);
    s.baseData = o;
    return s;
  };
  e.getTags = function (e, t) {
    var n = o.CorrelationContextManager.getCurrentContext();
    var r = {};
    if (e && e.tags) for (var i in e.tags) r[i] = e.tags[i];
    if (t) for (var i in t) r[i] = t[i];
    if (n) {
      r[e.keys.operationId] = r[e.keys.operationId] || n.operation.id;
      r[e.keys.operationName] = r[e.keys.operationName] || n.operation.name;
      r[e.keys.operationParentId] = r[e.keys.operationParentId] || n.operation.parentId;
    }
    return r;
  };
  e.parseStack = function (e) {
    var t = void 0;
    if ("string" == typeof e) {
      var n = e.split("\n");
      t = [];
      for (r = 0, i = 0, o = 0, void 0; o <= n.length; o++) {
        var r;
        var i;
        var o;
        var s = n[o];
        if (c.regex.test(s)) {
          var a = new c(n[o], r++);
          i += a.sizeInBytes;
          t.push(a);
        }
      }
      if (i > 32768) for (l = 0, u = t.length - 1, p = 0, d = l, h = u, void 0; l < u;) {
        var l;
        var u;
        var p;
        var d;
        var h;
        if ((p += t[l].sizeInBytes + t[u].sizeInBytes) > 32768) {
          var f = h - d + 1;
          t.splice(d, f);
          break;
        }
        d = l;
        h = u;
        l++;
        u--;
      }
    }
    return t;
  };
  return e;
}();
var c = function () {
  function e(t, n) {
    this.sizeInBytes = 0;
    this.level = n;
    this.method = "<no_method>";
    this.assembly = i.trim(t);
    var r = t.match(e.regex);
    if (r && r.length >= 5) {
      this.method = i.trim(r[2]) || this.method;
      this.fileName = i.trim(r[4]) || "<no_filename>";
      this.line = parseInt(r[5]) || 0;
    }
    this.sizeInBytes += this.method.length;
    this.sizeInBytes += this.fileName.length;
    this.sizeInBytes += this.assembly.length;
    this.sizeInBytes += e.baseSize;
    this.sizeInBytes += this.level.toString().length;
    this.sizeInBytes += this.line.toString().length;
  }
  e.regex = /^(\s+at)?(.*?)(\@|\s\(|\s)([^\(\n]+):(\d+):(\d+)(\)?)$/;
  e.baseSize = 58;
  return e;
}();
module.exports = a;