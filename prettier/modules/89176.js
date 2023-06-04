Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.setupTelemetryReporters = exports.APP_INSIGHTS_KEY_SECURE = exports.APP_INSIGHTS_KEY = void 0;
const r = require(6333);
const i = require(2923);
exports.APP_INSIGHTS_KEY = "7d7048df-6dd0-4048-bb23-b716c1461f8f";
exports.APP_INSIGHTS_KEY_SECURE = "3fdd7f28-937a-48c8-9a21-ba337db23bd1";
exports.setupTelemetryReporters = async function (e, n, o) {
  await e.get(r.TelemetryReporters).deactivate();
  if (o) {
    const o = e.get(r.TelemetryReporters),
      s = new i.AzureInsightReporter(e, n, exports.APP_INSIGHTS_KEY);
    o.setReporter(s);
    const a = new i.AzureInsightReporter(e, n, exports.APP_INSIGHTS_KEY_SECURE);
    o.setSecureReporter(a);
  }
};