Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.cleanupTelemetryReporters = exports.registerCommandWithTelemetry = void 0;
const r = require(89496);
const i = require(6333);
const o = require(91238);
function s(e, t) {
  if (t) {
    e.get(o.VsCodeExtensionContext).subscriptions.push(t);
  }
}
exports.registerCommandWithTelemetry = function (e, t, n) {
  const s = r.commands.registerCommand(t, async (...r) => {
    try {
      return await n(...r);
    } catch (n) {
      i.telemetryException(e, n, t);
    }
  });
  e.get(o.VsCodeExtensionContext).subscriptions.push(s);
};
exports.cleanupTelemetryReporters = function (e) {
  const t = e.get(i.TelemetryReporters);
  s(e, t.getReporter(e));
  s(e, t.getSecureReporter(e));
};