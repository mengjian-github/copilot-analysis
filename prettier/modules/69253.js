var r = require(29962);
var i = require(55158);
var o = require(95282);
var s = require(63580);
var a = require(57310);
var c = require(3063);
var l = function () {
  function e(t) {
    this._endpointBase = s.DEFAULT_BREEZE_ENDPOINT;
    this._mergeConfig();
    var n = this._connectionString;
    var r = i.parse(t);
    var o = i.parse(n);
    var c = !r.instrumentationkey && Object.keys(r).length > 0 ? null : t;
    var l = this._instrumentationKey;
    this.instrumentationKey = r.instrumentationkey || c || o.instrumentationkey || l;
    var u = "" + (this.endpointUrl || r.ingestionendpoint || o.ingestionendpoint || this._endpointBase);
    if (u.endsWith("/")) {
      u = u.slice(0, -1);
    }
    this.endpointUrl = u + "/v2.1/track";
    this.maxBatchSize = this.maxBatchSize || 250;
    this.maxBatchIntervalMs = this.maxBatchIntervalMs || 15e3;
    this.disableAppInsights = this.disableAppInsights || !1;
    this.samplingPercentage = this.samplingPercentage || 100;
    this.correlationIdRetryIntervalMs = this.correlationIdRetryIntervalMs || 3e4;
    this.enableWebInstrumentation = this.enableWebInstrumentation || this.enableAutoWebSnippetInjection || !1;
    this.webInstrumentationConfig = this.webInstrumentationConfig || null;
    this.enableAutoWebSnippetInjection = this.enableWebInstrumentation;
    this.correlationHeaderExcludedDomains = this.correlationHeaderExcludedDomains || ["*.core.windows.net", "*.core.chinacloudapi.cn", "*.core.cloudapi.de", "*.core.usgovcloudapi.net", "*.core.microsoft.scloud", "*.core.eaglex.ic.gov"];
    this.ignoreLegacyHeaders = this.ignoreLegacyHeaders || !1;
    this.profileQueryEndpoint = r.ingestionendpoint || o.ingestionendpoint || process.env[e.ENV_profileQueryEndpoint] || this._endpointBase;
    this.quickPulseHost = this.quickPulseHost || r.liveendpoint || o.liveendpoint || process.env[e.ENV_quickPulseHost] || s.DEFAULT_LIVEMETRICS_HOST;
    this.webInstrumentationConnectionString = this.webInstrumentationConnectionString || this._webInstrumentationConnectionString || "";
    this.webSnippetConnectionString = this.webInstrumentationConnectionString;
    if (this.quickPulseHost.match(/^https?:\/\//)) {
      this.quickPulseHost = new a.URL(this.quickPulseHost).host;
    }
  }
  Object.defineProperty(e.prototype, "profileQueryEndpoint", {
    get: function () {
      return this._profileQueryEndpoint;
    },
    set: function (e) {
      this._profileQueryEndpoint = e;
      this.correlationId = r.correlationIdPrefix;
    },
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperty(e.prototype, "instrumentationKey", {
    get: function () {
      return this._instrumentationKey;
    },
    set: function (t) {
      if (e._validateInstrumentationKey(t)) {
        o.warn("An invalid instrumentation key was provided. There may be resulting telemetry loss", this.instrumentationKey);
      }
      this._instrumentationKey = t;
    },
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperty(e.prototype, "webSnippetConnectionString", {
    get: function () {
      return this._webInstrumentationConnectionString;
    },
    set: function (e) {
      this._webInstrumentationConnectionString = e;
    },
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperty(e.prototype, "webInstrumentationConnectionString", {
    get: function () {
      return this._webInstrumentationConnectionString;
    },
    set: function (e) {
      this._webInstrumentationConnectionString = e;
    },
    enumerable: !1,
    configurable: !0
  });
  e.prototype._mergeConfig = function () {
    var e = c.JsonConfig.getInstance();
    this._connectionString = e.connectionString;
    this._instrumentationKey = e.instrumentationKey;
    this.correlationHeaderExcludedDomains = e.correlationHeaderExcludedDomains;
    this.correlationIdRetryIntervalMs = e.correlationIdRetryIntervalMs;
    this.disableAllExtendedMetrics = e.disableAllExtendedMetrics;
    this.disableAppInsights = e.disableAppInsights;
    this.disableStatsbeat = e.disableStatsbeat;
    this.distributedTracingMode = e.distributedTracingMode;
    this.enableAutoCollectConsole = e.enableAutoCollectConsole;
    this.enableLoggerErrorToTrace = e.enableLoggerErrorToTrace;
    this.enableAutoCollectDependencies = e.enableAutoCollectDependencies;
    this.enableAutoCollectIncomingRequestAzureFunctions = e.enableAutoCollectIncomingRequestAzureFunctions;
    this.enableAutoCollectExceptions = e.enableAutoCollectExceptions;
    this.enableAutoCollectExtendedMetrics = e.enableAutoCollectExtendedMetrics;
    this.enableAutoCollectExternalLoggers = e.enableAutoCollectExternalLoggers;
    this.enableAutoCollectHeartbeat = e.enableAutoCollectHeartbeat;
    this.enableAutoCollectPerformance = e.enableAutoCollectPerformance;
    this.enableAutoCollectPreAggregatedMetrics = e.enableAutoCollectPreAggregatedMetrics;
    this.enableAutoCollectRequests = e.enableAutoCollectRequests;
    this.enableAutoDependencyCorrelation = e.enableAutoDependencyCorrelation;
    this.enableInternalDebugLogging = e.enableInternalDebugLogging;
    this.enableInternalWarningLogging = e.enableInternalWarningLogging;
    this.enableResendInterval = e.enableResendInterval;
    this.enableMaxBytesOnDisk = e.enableMaxBytesOnDisk;
    this.enableSendLiveMetrics = e.enableSendLiveMetrics;
    this.enableUseAsyncHooks = e.enableUseAsyncHooks;
    this.enableUseDiskRetryCaching = e.enableUseDiskRetryCaching;
    this.endpointUrl = e.endpointUrl;
    this.extendedMetricDisablers = e.extendedMetricDisablers;
    this.ignoreLegacyHeaders = e.ignoreLegacyHeaders;
    this.maxBatchIntervalMs = e.maxBatchIntervalMs;
    this.maxBatchSize = e.maxBatchSize;
    this.proxyHttpUrl = e.proxyHttpUrl;
    this.proxyHttpsUrl = e.proxyHttpsUrl;
    this.quickPulseHost = e.quickPulseHost;
    this.samplingPercentage = e.samplingPercentage;
    this.enableWebInstrumentation = e.enableWebInstrumentation;
    this._webInstrumentationConnectionString = e.webInstrumentationConnectionString;
    this.webInstrumentationConfig = e.webInstrumentationConfig;
    this.webInstrumentationSrc = e.webInstrumentationSrc;
  };
  e._validateInstrumentationKey = function (e) {
    return new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$").test(e);
  };
  e.ENV_azurePrefix = "APPSETTING_";
  e.ENV_iKey = "APPINSIGHTS_INSTRUMENTATIONKEY";
  e.legacy_ENV_iKey = "APPINSIGHTS_INSTRUMENTATION_KEY";
  e.ENV_profileQueryEndpoint = "APPINSIGHTS_PROFILE_QUERY_ENDPOINT";
  e.ENV_quickPulseHost = "APPINSIGHTS_QUICKPULSE_HOST";
  return e;
}();
module.exports = l;