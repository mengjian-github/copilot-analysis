var n;
var r;
var i;
var o;
var s;
var a;
var c;
var l;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.WEB_INSTRUMENTATION_DEPRECATED_SOURCE = exports.WEB_INSTRUMENTATION_DEFAULT_SOURCE = exports.TIME_SINCE_ENQUEUED = exports.ENQUEUED_TIME = exports.MessageBusDestination = exports.MicrosoftEventHub = exports.AzNamespace = exports.StatsbeatNetworkCategory = exports.StatsbeatFeatureType = exports.StatsbeatInstrumentation = exports.StatsbeatFeature = exports.StatsbeatCounter = exports.StatsbeatAttach = exports.StatsbeatResourceProvider = exports.StatsbeatTelemetryName = exports.HeartBeatMetricName = exports.DependencyTypeName = exports.TelemetryTypeStringToQuickPulseDocumentType = exports.TelemetryTypeStringToQuickPulseType = exports.QuickPulseType = exports.QuickPulseDocumentType = exports.PerformanceToQuickPulseCounter = exports.MetricId = exports.PerformanceCounter = exports.QuickPulseCounter = exports.DEFAULT_LIVEMETRICS_HOST = exports.DEFAULT_LIVEMETRICS_ENDPOINT = exports.DEFAULT_BREEZE_ENDPOINT = exports.APPLICATION_INSIGHTS_SDK_VERSION = void 0;
exports.APPLICATION_INSIGHTS_SDK_VERSION = "2.6.0";
exports.DEFAULT_BREEZE_ENDPOINT = "https://dc.services.visualstudio.com";
exports.DEFAULT_LIVEMETRICS_ENDPOINT = "https://rt.services.visualstudio.com";
exports.DEFAULT_LIVEMETRICS_HOST = "rt.services.visualstudio.com";
(function (e) {
  e.COMMITTED_BYTES = "\\Memory\\Committed Bytes";
  e.PROCESSOR_TIME = "\\Processor(_Total)\\% Processor Time";
  e.REQUEST_RATE = "\\ApplicationInsights\\Requests/Sec";
  e.REQUEST_FAILURE_RATE = "\\ApplicationInsights\\Requests Failed/Sec";
  e.REQUEST_DURATION = "\\ApplicationInsights\\Request Duration";
  e.DEPENDENCY_RATE = "\\ApplicationInsights\\Dependency Calls/Sec";
  e.DEPENDENCY_FAILURE_RATE = "\\ApplicationInsights\\Dependency Calls Failed/Sec";
  e.DEPENDENCY_DURATION = "\\ApplicationInsights\\Dependency Call Duration";
  e.EXCEPTION_RATE = "\\ApplicationInsights\\Exceptions/Sec";
})(r = exports.QuickPulseCounter || (exports.QuickPulseCounter = {}));
(function (e) {
  e.PRIVATE_BYTES = "\\Process(??APP_WIN32_PROC??)\\Private Bytes";
  e.AVAILABLE_BYTES = "\\Memory\\Available Bytes";
  e.PROCESSOR_TIME = "\\Processor(_Total)\\% Processor Time";
  e.PROCESS_TIME = "\\Process(??APP_WIN32_PROC??)\\% Processor Time";
  e.REQUEST_RATE = "\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Requests/Sec";
  e.REQUEST_DURATION = "\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Request Execution Time";
})(i = exports.PerformanceCounter || (exports.PerformanceCounter = {}));
(l = exports.MetricId || (exports.MetricId = {})).REQUESTS_DURATION = "requests/duration";
l.DEPENDENCIES_DURATION = "dependencies/duration";
l.EXCEPTIONS_COUNT = "exceptions/count";
l.TRACES_COUNT = "traces/count";
(n = {})[i.PROCESSOR_TIME] = r.PROCESSOR_TIME;
n[i.REQUEST_RATE] = r.REQUEST_RATE;
n[i.REQUEST_DURATION] = r.REQUEST_DURATION;
n[r.COMMITTED_BYTES] = r.COMMITTED_BYTES;
n[r.REQUEST_FAILURE_RATE] = r.REQUEST_FAILURE_RATE;
n[r.DEPENDENCY_RATE] = r.DEPENDENCY_RATE;
n[r.DEPENDENCY_FAILURE_RATE] = r.DEPENDENCY_FAILURE_RATE;
n[r.DEPENDENCY_DURATION] = r.DEPENDENCY_DURATION;
n[r.EXCEPTION_RATE] = r.EXCEPTION_RATE;
exports.PerformanceToQuickPulseCounter = n;
exports.QuickPulseDocumentType = {
  Event: "Event",
  Exception: "Exception",
  Trace: "Trace",
  Metric: "Metric",
  Request: "Request",
  Dependency: "RemoteDependency",
  Availability: "Availability",
  PageView: "PageView"
};
exports.QuickPulseType = {
  Event: "EventTelemetryDocument",
  Exception: "ExceptionTelemetryDocument",
  Trace: "TraceTelemetryDocument",
  Metric: "MetricTelemetryDocument",
  Request: "RequestTelemetryDocument",
  Dependency: "DependencyTelemetryDocument",
  Availability: "AvailabilityTelemetryDocument",
  PageView: "PageViewTelemetryDocument"
};
exports.TelemetryTypeStringToQuickPulseType = {
  EventData: exports.QuickPulseType.Event,
  ExceptionData: exports.QuickPulseType.Exception,
  MessageData: exports.QuickPulseType.Trace,
  MetricData: exports.QuickPulseType.Metric,
  RequestData: exports.QuickPulseType.Request,
  RemoteDependencyData: exports.QuickPulseType.Dependency,
  AvailabilityData: exports.QuickPulseType.Availability,
  PageViewData: exports.QuickPulseType.PageView
};
exports.TelemetryTypeStringToQuickPulseDocumentType = {
  EventData: exports.QuickPulseDocumentType.Event,
  ExceptionData: exports.QuickPulseDocumentType.Exception,
  MessageData: exports.QuickPulseDocumentType.Trace,
  MetricData: exports.QuickPulseDocumentType.Metric,
  RequestData: exports.QuickPulseDocumentType.Request,
  RemoteDependencyData: exports.QuickPulseDocumentType.Dependency,
  AvailabilityData: exports.QuickPulseDocumentType.Availability,
  PageViewData: exports.QuickPulseDocumentType.PageView
};
exports.DependencyTypeName = {
  Grpc: "GRPC",
  Http: "HTTP",
  InProc: "InProc",
  Sql: "SQL",
  QueueMessage: "Queue Message"
};
exports.HeartBeatMetricName = "HeartbeatState";
exports.StatsbeatTelemetryName = "Statsbeat";
exports.StatsbeatResourceProvider = {
  appsvc: "appsvc",
  functions: "functions",
  vm: "vm",
  unknown: "unknown"
};
exports.StatsbeatAttach = {
  codeless: "codeless",
  sdk: "sdk"
};
exports.StatsbeatCounter = {
  REQUEST_SUCCESS: "Request Success Count",
  REQUEST_FAILURE: "Request Failure Count",
  REQUEST_DURATION: "Request Duration",
  RETRY_COUNT: "Retry Count",
  THROTTLE_COUNT: "Throttle Count",
  EXCEPTION_COUNT: "Exception Count",
  ATTACH: "Attach",
  FEATURE: "Feature"
};
(c = exports.StatsbeatFeature || (exports.StatsbeatFeature = {}))[c.NONE = 0] = "NONE";
c[c.DISK_RETRY = 1] = "DISK_RETRY";
c[c.AAD_HANDLING = 2] = "AAD_HANDLING";
c[c.WEB_SNIPPET = 4] = "WEB_SNIPPET";
(a = exports.StatsbeatInstrumentation || (exports.StatsbeatInstrumentation = {}))[a.NONE = 0] = "NONE";
a[a.AZURE_CORE_TRACING = 1] = "AZURE_CORE_TRACING";
a[a.MONGODB = 2] = "MONGODB";
a[a.MYSQL = 4] = "MYSQL";
a[a.REDIS = 8] = "REDIS";
a[a.POSTGRES = 16] = "POSTGRES";
a[a.BUNYAN = 32] = "BUNYAN";
a[a.WINSTON = 64] = "WINSTON";
a[a.CONSOLE = 128] = "CONSOLE";
(s = exports.StatsbeatFeatureType || (exports.StatsbeatFeatureType = {}))[s.Feature = 0] = "Feature";
s[s.Instrumentation = 1] = "Instrumentation";
(o = exports.StatsbeatNetworkCategory || (exports.StatsbeatNetworkCategory = {}))[o.Breeze = 0] = "Breeze";
o[o.Quickpulse = 1] = "Quickpulse";
exports.AzNamespace = "az.namespace";
exports.MicrosoftEventHub = "Microsoft.EventHub";
exports.MessageBusDestination = "message_bus.destination";
exports.ENQUEUED_TIME = "enqueuedTime";
exports.TIME_SINCE_ENQUEUED = "timeSinceEnqueued";
exports.WEB_INSTRUMENTATION_DEFAULT_SOURCE = "https://js.monitor.azure.com/scripts/b/ai";
exports.WEB_INSTRUMENTATION_DEPRECATED_SOURCE = "https://az416426.vo.msecnd.net/scripts/b/ai";