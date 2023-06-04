Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.TelemetrySpy = void 0;
exports.TelemetrySpy = class {
  constructor() {
    this.events = [];
    this.errors = [];
    this.exceptions = [];
  }
  sendTelemetryEvent(e, t, n) {
    this.events.push({
      name: e,
      properties: t,
      measurements: n
    });
  }
  sendTelemetryErrorEvent(e, t, n, r) {
    this.errors.push({
      name: e,
      properties: t,
      measurements: n,
      errorProps: r
    });
  }
  sendTelemetryException(e, t, n) {
    this.exceptions.push({
      error: e,
      properties: t,
      measurements: n
    });
  }
  dispose() {
    return Promise.resolve();
  }
  eventsMatching(e) {
    return this.events.filter(e);
  }
};