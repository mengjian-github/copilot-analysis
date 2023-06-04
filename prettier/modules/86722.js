Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NoOpStatusReporter = exports.StatusReporter = void 0;
class StatusReporter {}
exports.StatusReporter = StatusReporter;
exports.NoOpStatusReporter = class extends StatusReporter {
  setProgress() {}
  removeProgress() {}
  setWarning() {}
  setError(e) {}
  setInactive() {}
  forceNormal() {}
};