Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.isVerboseLoggingEnabled = exports.isDebugEnabled = exports.shouldFailForDebugPurposes = exports.isRunningInTest = exports.RuntimeMode = void 0;
class RuntimeMode {
  constructor(e) {
    this.flags = e;
  }
  static fromEnvironment(e) {
    return new RuntimeMode({
      debug: (t = process.argv, r = process.env, t.includes("--debug") || a(r, "GITHUB_COPILOT_DEBUG")),
      verboseLogging: i(process.env),
      telemetryLogging: o(process.env),
      testMode: e,
      recordInput: s(process.argv, process.env)
    });
    var t;
    var r;
  }
}
function isRunningInTest(e) {
  return e.get(RuntimeMode).flags.testMode;
}
function i(e) {
  return a(e, "COPILOT_AGENT_VERBOSE");
}
function o(e) {
  return a(e, "COPILOT_LOG_TELEMETRY");
}
function s(e, t) {
  return e.includes("--record") || a(t, "GITHUB_COPILOT_RECORD");
}
function a(e, t) {
  if (t in e) {
    const n = e[t];
    return "1" === n || "true" === n?.toLowerCase();
  }
  return !1;
}
exports.RuntimeMode = RuntimeMode;
exports.isRunningInTest = isRunningInTest;
exports.shouldFailForDebugPurposes = function (e) {
  return isRunningInTest(e);
};
exports.isDebugEnabled = function (e) {
  return e.get(RuntimeMode).flags.debug;
};
exports.isVerboseLoggingEnabled = function (e) {
  return e.get(RuntimeMode).flags.verboseLogging;
};