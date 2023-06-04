Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.NoOpStatusReporter = exports.StatusReporter = void 0;
  class n {}
  exports.StatusReporter = n, exports.NoOpStatusReporter = class extends n {
    setProgress() {}
    removeProgress() {}
    setWarning() {}
    setError(e) {}
    setInactive() {}
    forceNormal() {}
  };