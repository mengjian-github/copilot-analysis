Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.JsonConfig = void 0;
var r = require(57147);
var i = require(71017);
var o = require(95282);
var s = "APPSETTING_";
var a = "APPINSIGHTS_INSTRUMENTATIONKEY";
var c = "APPINSIGHTS_INSTRUMENTATION_KEY";
var JsonConfig = function () {
  function e() {
    this.connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    this.instrumentationKey = process.env[a] || process.env[s + a] || process.env[c] || process.env[s + c];
    if (!this.connectionString && this.instrumentationKey) {
      o.warn("APPINSIGHTS_INSTRUMENTATIONKEY is in path of deprecation, please use APPLICATIONINSIGHTS_CONNECTION_STRING env variable to setup the SDK.");
    }
    this.disableAllExtendedMetrics = !!process.env.APPLICATION_INSIGHTS_DISABLE_ALL_EXTENDED_METRICS;
    this.extendedMetricDisablers = process.env.APPLICATION_INSIGHTS_DISABLE_EXTENDED_METRIC;
    this.proxyHttpUrl = process.env.http_proxy;
    this.proxyHttpsUrl = process.env.https_proxy;
    this.noDiagnosticChannel = !!process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL;
    this.disableStatsbeat = !!process.env.APPLICATION_INSIGHTS_NO_STATSBEAT;
    this.noHttpAgentKeepAlive = !!process.env.APPLICATION_INSIGHTS_NO_HTTP_AGENT_KEEP_ALIVE;
    this.noPatchModules = process.env.APPLICATION_INSIGHTS_NO_PATCH_MODULES || "";
    this.enableWebInstrumentation = !!process.env.APPLICATIONINSIGHTS_WEB_INSTRUMENTATION_ENABLED || !!process.env.APPLICATIONINSIGHTS_WEB_SNIPPET_ENABLED;
    this.webInstrumentationSrc = process.env.APPLICATIONINSIGHTS_WEB_INSTRUMENTATION_SOURCE || "";
    this.webInstrumentationConnectionString = process.env.APPLICATIONINSIGHTS_WEB_INSTRUMENTATION_CONNECTION_STRING || process.env.APPLICATIONINSIGHTS_WEB_SNIPPET_CONNECTION_STRING || "";
    this.enableAutoWebSnippetInjection = this.enableWebInstrumentation;
    this.webSnippetConnectionString = this.webInstrumentationConnectionString;
    this._loadJsonFile();
  }
  e.getInstance = function () {
    if (e._instance) {
      e._instance = new e();
    }
    return e._instance;
  };
  e.prototype._loadJsonFile = function () {
    var e = i.join(__dirname, "../../");
    var t = i.join(e, "applicationinsights.json");
    var n = process.env.APPLICATIONINSIGHTS_CONFIGURATION_FILE;
    if (n) {
      t = i.isAbsolute(n) ? n : i.join(e, n);
    }
    try {
      var s = JSON.parse(r.readFileSync(t, "utf8"));
      if (null != s.disableStatsbeat) {
        this.disableStatsbeat = s.disableStatsbeat;
      }
      if (null != s.disableAllExtendedMetrics) {
        this.disableAllExtendedMetrics = s.disableStatsbeat;
      }
      if (null != s.noDiagnosticChannel) {
        this.noDiagnosticChannel = s.noDiagnosticChannel;
      }
      if (null != s.noHttpAgentKeepAlive) {
        this.noHttpAgentKeepAlive = s.noHttpAgentKeepAlive;
      }
      if (null != s.connectionString) {
        this.connectionString = s.connectionString;
      }
      if (null != s.extendedMetricDisablers) {
        this.extendedMetricDisablers = s.extendedMetricDisablers;
      }
      if (null != s.noDiagnosticChannel) {
        this.noDiagnosticChannel = s.noDiagnosticChannel;
      }
      if (null != s.proxyHttpUrl) {
        this.proxyHttpUrl = s.proxyHttpUrl;
      }
      if (null != s.proxyHttpsUrl) {
        this.proxyHttpsUrl = s.proxyHttpsUrl;
      }
      if (null != s.proxyHttpsUrl) {
        this.proxyHttpsUrl = s.proxyHttpsUrl;
      }
      if (null != s.noPatchModules) {
        this.noPatchModules = s.noPatchModules;
      }
      if (null != s.enableAutoWebSnippetInjection) {
        this.enableWebInstrumentation = s.enableAutoWebSnippetInjection;
        this.enableAutoWebSnippetInjection = this.enableWebInstrumentation;
      }
      if (null != s.enableWebInstrumentation) {
        this.enableWebInstrumentation = s.enableWebInstrumentation;
        this.enableAutoWebSnippetInjection = this.enableWebInstrumentation;
      }
      if (null != s.webSnippetConnectionString) {
        this.webInstrumentationConnectionString = s.webSnippetConnectionString;
        this.webSnippetConnectionString = this.webInstrumentationConnectionString;
      }
      if (null != s.webInstrumentationConnectionString) {
        this.webInstrumentationConnectionString = s.webInstrumentationConnectionString;
        this.webSnippetConnectionString = this.webInstrumentationConnectionString;
      }
      if (null != s.webInstrumentationConfig) {
        this.webInstrumentationConfig = s.webInstrumentationConfig;
      }
      if (null != s.webInstrumentationSrc) {
        this.webInstrumentationSrc = s.webInstrumentationSrc;
      }
      if (null != s.enableLoggerErrorToTrace) {
        this.enableLoggerErrorToTrace = s.enableLoggerErrorToTrace;
      }
      this.endpointUrl = s.endpointUrl;
      this.maxBatchSize = s.maxBatchSize;
      this.maxBatchIntervalMs = s.maxBatchIntervalMs;
      this.disableAppInsights = s.disableAppInsights;
      this.samplingPercentage = s.samplingPercentage;
      this.correlationIdRetryIntervalMs = s.correlationIdRetryIntervalMs;
      this.correlationHeaderExcludedDomains = s.correlationHeaderExcludedDomains;
      this.ignoreLegacyHeaders = s.ignoreLegacyHeaders;
      this.distributedTracingMode = s.distributedTracingMode;
      this.enableAutoCollectExternalLoggers = s.enableAutoCollectExternalLoggers;
      this.enableAutoCollectConsole = s.enableAutoCollectConsole;
      this.enableLoggerErrorToTrace = s.enableLoggerErrorToTrace;
      this.enableAutoCollectExceptions = s.enableAutoCollectExceptions;
      this.enableAutoCollectPerformance = s.enableAutoCollectPerformance;
      this.enableAutoCollectExtendedMetrics = s.enableAutoCollectExtendedMetrics;
      this.enableAutoCollectPreAggregatedMetrics = s.enableAutoCollectPreAggregatedMetrics;
      this.enableAutoCollectHeartbeat = s.enableAutoCollectHeartbeat;
      this.enableAutoCollectRequests = s.enableAutoCollectRequests;
      this.enableAutoCollectDependencies = s.enableAutoCollectDependencies;
      this.enableAutoDependencyCorrelation = s.enableAutoDependencyCorrelation;
      this.enableAutoCollectIncomingRequestAzureFunctions = s.enableAutoCollectIncomingRequestAzureFunctions;
      this.enableUseAsyncHooks = s.enableUseAsyncHooks;
      this.enableUseDiskRetryCaching = s.enableUseDiskRetryCaching;
      this.enableResendInterval = s.enableResendInterval;
      this.enableMaxBytesOnDisk = s.enableMaxBytesOnDisk;
      this.enableInternalDebugLogging = s.enableInternalDebugLogging;
      this.enableInternalWarningLogging = s.enableInternalWarningLogging;
      this.enableSendLiveMetrics = s.enableSendLiveMetrics;
      this.quickPulseHost = s.quickPulseHost;
    } catch (e) {
      o.info("Missing or invalid JSON config file: ", e);
    }
  };
  return e;
}();
exports.JsonConfig = JsonConfig;