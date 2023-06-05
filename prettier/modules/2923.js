Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.AzureInsightReporter = void 0;
const r = require(9574);
const i = require(22037);
const config = require("./config");
const telemetry = require("./telemetry");
function a(e, t) {
  t.commonProperties = function (e, t) {
    (e = e || {}).common_os = i.platform();
    e.common_platformversion = i.release();
    const n = t.get(config.EditorSession);
    e.common_vscodemachineid = n.machineId;
    e.common_vscodesessionid = n.sessionId;
    e.common_uikind = "desktop";
    e.common_remotename = "none";
    e.common_isnewappinstall = "";
    return e;
  }(t.commonProperties, e);
  const n = e.get(config.EditorSession);
  t.context.tags[t.context.keys.sessionId] = n.sessionId;
  t.context.tags[t.context.keys.userId] = n.machineId;
  t.context.tags[t.context.keys.cloudRoleInstance] = "REDACTED";
  t.config.endpointUrl = e.get(telemetry.TelemetryEndpointUrl).getUrl();
}
exports.AzureInsightReporter = class {
  constructor(e, t, n) {
    this.namespace = t;
    this.client = function (e, t) {
      const n = new r.TelemetryClient(t);
      n.config.enableAutoCollectRequests = !1;
      n.config.enableAutoCollectPerformance = !1;
      n.config.enableAutoCollectExceptions = !1;
      n.config.enableAutoCollectConsole = !1;
      n.config.enableAutoCollectDependencies = !1;
      n.config.noDiagnosticChannel = !0;
      a(e, n);
      return n;
    }(e, n);
    a(e, this.client);
  }
  sendTelemetryEvent(e, t, n) {
    this.client.trackEvent({
      name: this.qualifyEventName(e),
      properties: t,
      measurements: n
    });
  }
  sendTelemetryErrorEvent(e, t, n) {
    this.sendTelemetryEvent(this.qualifyEventName(e), t, n);
  }
  sendTelemetryException(e, t, n) {
    this.client.trackException({
      exception: e,
      properties: t,
      measurements: n
    });
  }
  dispose() {
    return new Promise(e => {
      this.client.flush({
        callback: t => {
          e(void 0);
        }
      });
    });
  }
  qualifyEventName(e) {
    return e.startsWith(this.namespace) ? e : `${this.namespace}/${e}`;
  }
};