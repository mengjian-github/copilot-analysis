require.d(exports, {
  qG: () => h,
  KR: () => d,
  J9: () => g,
  Ys: () => f,
  VH: () => m,
  vU: () => T,
  Ds: () => w
});
var r = require(16740);
var i = require(29290);
var o = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : "object" == typeof window ? window : "object" == typeof global ? global : {};
var s = ["OTEL_SDK_DISABLED"];
function a(e) {
  return s.indexOf(e) > -1;
}
var c = ["OTEL_BSP_EXPORT_TIMEOUT", "OTEL_BSP_MAX_EXPORT_BATCH_SIZE", "OTEL_BSP_MAX_QUEUE_SIZE", "OTEL_BSP_SCHEDULE_DELAY", "OTEL_BLRP_EXPORT_TIMEOUT", "OTEL_BLRP_MAX_EXPORT_BATCH_SIZE", "OTEL_BLRP_MAX_QUEUE_SIZE", "OTEL_BLRP_SCHEDULE_DELAY", "OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT", "OTEL_ATTRIBUTE_COUNT_LIMIT", "OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT", "OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT", "OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT", "OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT", "OTEL_SPAN_EVENT_COUNT_LIMIT", "OTEL_SPAN_LINK_COUNT_LIMIT", "OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT", "OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT", "OTEL_EXPORTER_OTLP_TIMEOUT", "OTEL_EXPORTER_OTLP_TRACES_TIMEOUT", "OTEL_EXPORTER_OTLP_METRICS_TIMEOUT", "OTEL_EXPORTER_JAEGER_AGENT_PORT"];
function l(e) {
  return c.indexOf(e) > -1;
}
var u = ["OTEL_NO_PATCH_MODULES", "OTEL_PROPAGATORS"];
function p(e) {
  return u.indexOf(e) > -1;
}
var d = 1 / 0;
var h = 128;
var f = 128;
var m = 128;
var g = {
  OTEL_SDK_DISABLED: !1,
  CONTAINER_NAME: "",
  ECS_CONTAINER_METADATA_URI_V4: "",
  ECS_CONTAINER_METADATA_URI: "",
  HOSTNAME: "",
  KUBERNETES_SERVICE_HOST: "",
  NAMESPACE: "",
  OTEL_BSP_EXPORT_TIMEOUT: 3e4,
  OTEL_BSP_MAX_EXPORT_BATCH_SIZE: 512,
  OTEL_BSP_MAX_QUEUE_SIZE: 2048,
  OTEL_BSP_SCHEDULE_DELAY: 5e3,
  OTEL_BLRP_EXPORT_TIMEOUT: 3e4,
  OTEL_BLRP_MAX_EXPORT_BATCH_SIZE: 512,
  OTEL_BLRP_MAX_QUEUE_SIZE: 2048,
  OTEL_BLRP_SCHEDULE_DELAY: 5e3,
  OTEL_EXPORTER_JAEGER_AGENT_HOST: "",
  OTEL_EXPORTER_JAEGER_AGENT_PORT: 6832,
  OTEL_EXPORTER_JAEGER_ENDPOINT: "",
  OTEL_EXPORTER_JAEGER_PASSWORD: "",
  OTEL_EXPORTER_JAEGER_USER: "",
  OTEL_EXPORTER_OTLP_ENDPOINT: "",
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: "",
  OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: "",
  OTEL_EXPORTER_OTLP_HEADERS: "",
  OTEL_EXPORTER_OTLP_TRACES_HEADERS: "",
  OTEL_EXPORTER_OTLP_METRICS_HEADERS: "",
  OTEL_EXPORTER_OTLP_TIMEOUT: 1e4,
  OTEL_EXPORTER_OTLP_TRACES_TIMEOUT: 1e4,
  OTEL_EXPORTER_OTLP_METRICS_TIMEOUT: 1e4,
  OTEL_EXPORTER_ZIPKIN_ENDPOINT: "http://localhost:9411/api/v2/spans",
  OTEL_LOG_LEVEL: r.n.INFO,
  OTEL_NO_PATCH_MODULES: [],
  OTEL_PROPAGATORS: ["tracecontext", "baggage"],
  OTEL_RESOURCE_ATTRIBUTES: "",
  OTEL_SERVICE_NAME: "",
  OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT: d,
  OTEL_ATTRIBUTE_COUNT_LIMIT: h,
  OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT: d,
  OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT: h,
  OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT: d,
  OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT: h,
  OTEL_SPAN_EVENT_COUNT_LIMIT: 128,
  OTEL_SPAN_LINK_COUNT_LIMIT: 128,
  OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT: f,
  OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT: m,
  OTEL_TRACES_EXPORTER: "",
  OTEL_TRACES_SAMPLER: i.J.ParentBasedAlwaysOn,
  OTEL_TRACES_SAMPLER_ARG: "",
  OTEL_LOGS_EXPORTER: "",
  OTEL_EXPORTER_OTLP_INSECURE: "",
  OTEL_EXPORTER_OTLP_TRACES_INSECURE: "",
  OTEL_EXPORTER_OTLP_METRICS_INSECURE: "",
  OTEL_EXPORTER_OTLP_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_METRICS_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_COMPRESSION: "",
  OTEL_EXPORTER_OTLP_TRACES_COMPRESSION: "",
  OTEL_EXPORTER_OTLP_METRICS_COMPRESSION: "",
  OTEL_EXPORTER_OTLP_CLIENT_KEY: "",
  OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY: "",
  OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY: "",
  OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_PROTOCOL: "http/protobuf",
  OTEL_EXPORTER_OTLP_TRACES_PROTOCOL: "http/protobuf",
  OTEL_EXPORTER_OTLP_METRICS_PROTOCOL: "http/protobuf",
  OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: "cumulative"
};
function y(e, t, n) {
  if (void 0 !== n[e]) {
    var r = String(n[e]);
    t[e] = "true" === r.toLowerCase();
  }
}
function _(e, t, n, r, i) {
  if (void 0 === r) {
    r = -1 / 0;
  }
  if (void 0 === i) {
    i = 1 / 0;
  }
  if (void 0 !== n[e]) {
    var o = Number(n[e]);
    isNaN(o) || (t[e] = o < r ? r : o > i ? i : o);
  }
}
function v(e, t, n, r) {
  if (void 0 === r) {
    r = ",";
  }
  var i = n[e];
  if ("string" == typeof i) {
    t[e] = i.split(r).map(function (e) {
      return e.trim();
    });
  }
}
var b = {
  ALL: r.n.ALL,
  VERBOSE: r.n.VERBOSE,
  DEBUG: r.n.DEBUG,
  INFO: r.n.INFO,
  WARN: r.n.WARN,
  ERROR: r.n.ERROR,
  NONE: r.n.NONE
};
function E(e, t, n) {
  var r = n[e];
  if ("string" == typeof r) {
    var i = b[r.toUpperCase()];
    if (null != i) {
      t[e] = i;
    }
  }
}
function w(e) {
  var t = {};
  for (var n in g) {
    var r = n;
    if ("OTEL_LOG_LEVEL" === r) E(r, t, e);else if (a(r)) y(r, t, e);else if (l(r)) _(r, t, e);else if (p(r)) v(r, t, e);else {
      var i = e[r];
      if (null != i) {
        t[r] = String(i);
      }
    }
  }
  return t;
}
function T() {
  return "undefined" != typeof process && process && process.env ? w(process.env) : w(o);
}