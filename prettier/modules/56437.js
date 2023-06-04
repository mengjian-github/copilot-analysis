Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NoopTelemetryReporter = exports.snippyTelemetry = exports.matchNotificationTelemetry = exports.matchPanelTelemetry = void 0;
const r = require(6333);
const i = require(77032);
const o = /^[1-6][0-9][0-9]$/;
const s = /([A-Z][a-z]+)/;
const a = "codeQuote";
class c {
  constructor(e) {
    this.baseKey = e;
  }
  buildKey(...e) {
    return [a, this.baseKey, ...e].join(".");
  }
}
exports.matchPanelTelemetry = new class extends c {
  constructor() {
    super("match_panel");
    this.matchPanelTiming = void 0;
  }
  handleOpen({
    context: e,
    actor: t
  }) {
    const n = this.buildKey("open", "count");
    this.matchPanelTiming = Date.now().valueOf();
    const o = r.TelemetryData.createAndMarkAsIssued({
      opened_by: t
    });
    i.codeQuoteLogger.info(e, n, o);
    r.telemetry(e, n, o);
  }
  handleClose({
    context: e,
    actor: t
  }) {
    if (void 0 === this.matchPanelTiming) return void i.codeQuoteLogger.debug(e, "Match panel timing is undefined, or the panel already closed.");
    const n = r.TelemetryData.createAndMarkAsIssued({
      dismissed_by: t
    }, {
      time_open: Date.now().valueOf() - this.matchPanelTiming
    });
    const o = this.buildKey("close", "count");
    i.codeQuoteLogger.info(e, o, n);
    r.telemetry(e, o, n);
    this.matchPanelTiming = void 0;
  }
}();
exports.matchNotificationTelemetry = new class extends c {
  constructor() {
    super("match_notification");
  }
  handleDoAction({
    context: e,
    actor: t
  }) {
    const n = r.TelemetryData.createAndMarkAsIssued({
      opened_by: t
    });
    const o = this.buildKey("show_matches", "count");
    i.codeQuoteLogger.info(e, o, n);
    r.telemetry(e, o, n);
  }
  handleDismiss({
    context: e,
    actor: t
  }) {
    const n = r.TelemetryData.createAndMarkAsIssued({
      dismissed_by: t
    });
    const o = this.buildKey("dismiss", "count");
    i.codeQuoteLogger.info(e, o, n);
    r.telemetry(e, o, n);
  }
}();
exports.snippyTelemetry = new class extends c {
  constructor() {
    super("snippy");
  }
  handleUnexpectedError({
    context: e,
    origin: t,
    reason: n
  }) {
    const o = r.TelemetryData.createAndMarkAsIssued({
      origin: t,
      reason: n
    });
    i.codeQuoteLogger.info(e, "unexpected_error", o);
    r.telemetryError(e, this.buildKey("unexpected_error"), o);
  }
  handleCompletionMissing({
    context: e,
    origin: t,
    reason: n
  }) {
    const o = r.TelemetryData.createAndMarkAsIssued({
      origin: t,
      reason: n
    });
    i.codeQuoteLogger.info(e, "completion_missing", o);
    r.telemetryError(e, this.buildKey("completion_missing"), o);
  }
  handleSnippyNetworkError({
    context: e,
    origin: t,
    reason: n,
    message: a
  }) {
    if (!t.match(o)) return void i.codeQuoteLogger.debug(e, "Invalid status code, not sending telemetry", {
      origin: t
    });
    const c = n.split(s).filter(e => Boolean(e)).join("_").toLowerCase();
    const l = r.TelemetryData.createAndMarkAsIssued({
      message: a
    });
    i.codeQuoteLogger.info(e, c, t, l);
    r.telemetryError(e, this.buildKey(c, t), l);
  }
}();
exports.NoopTelemetryReporter = class extends c {
  constructor(e = "") {
    super(e);
  }
  telemetry(...e) {}
  telemetryError(...e) {}
};