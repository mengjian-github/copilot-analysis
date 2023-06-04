var r = require(57310);
var i = require(69253);
var o = require(80287);
var s = require(54470);
var a = require(55290);
var c = require(3504);
var l = require(59428);
var u = require(70894);
var p = require(49004);
var d = require(82588);
var h = require(25740);
var f = require(95282);
var m = require(99813);
var g = function () {
  function e(e) {
    this._telemetryProcessors = [];
    var t = new i(e);
    this.config = t;
    if (!this.config.instrumentationKey || "" == this.config.instrumentationKey) throw new Error("Instrumentation key not found, please provide a connection string before starting Application Insights SDK.");
    this.context = new s();
    this.commonProperties = {};
    this.authorizationHandler = null;
    if (this.config.disableStatsbeat) {
      this._statsbeat = new p(this.config, this.context);
      this._statsbeat.enable(!0);
    }
    var n = new d(this.config, this.getAuthorizationHandler, null, null, this._statsbeat);
    this.channel = new c(function () {
      return t.disableAppInsights;
    }, function () {
      return t.maxBatchSize;
    }, function () {
      return t.maxBatchIntervalMs;
    }, n);
  }
  e.prototype.trackAvailability = function (e) {
    this.track(e, a.TelemetryType.Availability);
  };
  e.prototype.trackPageView = function (e) {
    this.track(e, a.TelemetryType.PageView);
  };
  e.prototype.trackTrace = function (e) {
    this.track(e, a.TelemetryType.Trace);
  };
  e.prototype.trackMetric = function (e) {
    this.track(e, a.TelemetryType.Metric);
  };
  e.prototype.trackException = function (e) {
    if (e && e.exception && !h.isError(e.exception)) {
      e.exception = new Error(e.exception.toString());
    }
    this.track(e, a.TelemetryType.Exception);
  };
  e.prototype.trackEvent = function (e) {
    this.track(e, a.TelemetryType.Event);
  };
  e.prototype.trackRequest = function (e) {
    this.track(e, a.TelemetryType.Request);
  };
  e.prototype.trackDependency = function (t) {
    if (t && !t.target && t.data) try {
      t.target = new r.URL(t.data).host;
    } catch (n) {
      t.target = null;
      f.warn(e.TAG, "The URL object is failed to create.", n);
    }
    this.track(t, a.TelemetryType.Dependency);
  };
  e.prototype.flush = function (e) {
    this.channel.triggerSend(!!e && !!e.isAppCrashing, e ? e.callback : void 0);
  };
  e.prototype.track = function (t, n) {
    if (t && a.telemetryTypeToBaseType(n)) {
      var r = m.createEnvelope(t, n, this.commonProperties, this.context, this.config);
      if (t.time) {
        r.time = t.time.toISOString();
      }
      var i = this.runTelemetryProcessors(r, t.contextObjects);
      i = i && l.samplingTelemetryProcessor(r, {
        correlationContext: u.CorrelationContextManager.getCurrentContext()
      });
      l.preAggregatedMetricsTelemetryProcessor(r, this.context);
      if (i) {
        l.performanceMetricsTelemetryProcessor(r, this.quickPulseClient);
        this.channel.send(r);
      }
    } else f.warn(e.TAG, "track() requires telemetry object and telemetryType to be specified.");
  };
  e.prototype.setAutoPopulateAzureProperties = function (e) {};
  e.prototype.getAuthorizationHandler = function (t) {
    return t && t.aadTokenCredential ? (this.authorizationHandler || (f.info(e.TAG, "Adding authorization handler"), this.authorizationHandler = new o(t.aadTokenCredential)), this.authorizationHandler) : null;
  };
  e.prototype.addTelemetryProcessor = function (e) {
    this._telemetryProcessors.push(e);
  };
  e.prototype.clearTelemetryProcessors = function () {
    this._telemetryProcessors = [];
  };
  e.prototype.runTelemetryProcessors = function (t, n) {
    var r = !0;
    var i = this._telemetryProcessors.length;
    if (0 === i) return r;
    (n = n || {}).correlationContext = u.CorrelationContextManager.getCurrentContext();
    for (var o = 0; o < i; ++o) try {
      var s = this._telemetryProcessors[o];
      if (s && !1 === s.apply(null, [t, n])) {
        r = !1;
        break;
      }
    } catch (n) {
      r = !0;
      f.warn(e.TAG, "One of telemetry processors failed, telemetry item will be sent.", n, t);
    }
    if (r) {
      if (t && t.tags) {
        t.tags = h.validateStringMap(t.tags);
      }
      if (t && t.data && t.data.baseData && t.data.baseData.properties) {
        t.data.baseData.properties = h.validateStringMap(t.data.baseData.properties);
      }
    }
    return r;
  };
  e.prototype.getStatsbeat = function () {
    return this._statsbeat;
  };
  e.TAG = "TelemetryClient";
  return e;
}();
module.exports = g;