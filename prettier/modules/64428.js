Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.cleanupTelemetryReporters = exports.registerCommandWithTelemetry = void 0;
const vscode = require("vscode");
const telemetry = require("./telemetry");
const main = require("./main");
function s(e, t) {
  if (t) {
    e.get(main.VsCodeExtensionContext).subscriptions.push(t);
  }
}
exports.registerCommandWithTelemetry = function (e, t, n) {
  const s = vscode.commands.registerCommand(t, async (...r) => {
    try {
      return await n(...r);
    } catch (n) {
      telemetry.telemetryException(e, n, t);
    }
  });
  e.get(main.VsCodeExtensionContext).subscriptions.push(s);
};
exports.cleanupTelemetryReporters = function (e) {
  const t = e.get(telemetry.TelemetryReporters);
  s(e, t.getReporter(e));
  s(e, t.getSecureReporter(e));
};