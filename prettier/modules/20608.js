Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getSamplingHashCode = exports.samplingTelemetryProcessor = void 0;
var r = require(55290);
function getSamplingHashCode(e) {
  var t = 2147483647;
  var n = 5381;
  if (!e) return 0;
  for (; e.length < 8;) e += e;
  for (var r = 0; r < e.length; r++) n = ((n << 5) + n | 0) + e.charCodeAt(r) | 0;
  return (n = n <= -2147483648 ? t : Math.abs(n)) / t * 100;
}
exports.samplingTelemetryProcessor = function (e, t) {
  var n = e.sampleRate;
  return null == n || n >= 100 || !(!e.data || r.TelemetryType.Metric !== r.baseTypeToTelemetryType(e.data.baseType)) || (t.correlationContext && t.correlationContext.operation ? getSamplingHashCode(t.correlationContext.operation.id) < n : 100 * Math.random() < n);
};
exports.getSamplingHashCode = getSamplingHashCode;