require.d(exports, {
  Ll: () => s,
  hE: () => i,
  yy: () => o
});
var r = require(15834).Y("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
function i(e) {
  return e.setValue(r, !0);
}
function o(e) {
  return e.deleteValue(r);
}
function s(e) {
  return !0 === e.getValue(r);
}