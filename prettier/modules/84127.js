Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.performanceMetricsTelemetryProcessor = void 0;
var r = require(74350);
var i = require(55290);
exports.performanceMetricsTelemetryProcessor = function (e, t) {
  switch (t && t.addDocument(e), e.data.baseType) {
    case i.TelemetryTypeString.Exception:
      r.countException();
      break;
    case i.TelemetryTypeString.Request:
      var n = e.data.baseData;
      r.countRequest(n.duration, n.success);
      break;
    case i.TelemetryTypeString.Dependency:
      var o = e.data.baseData;
      r.countDependency(o.duration, o.success);
  }
  return !0;
};