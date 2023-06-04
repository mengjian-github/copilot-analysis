require.d(exports, {
  BM: () => l,
  Lc: () => c,
  jN: () => a,
  kw: () => u
});
var r = require(27007);
var i = require(97817);
var o = /^([0-9a-f]{32})$/i;
var s = /^[0-9a-f]{16}$/i;
function a(e) {
  return o.test(e) && e !== r.AE;
}
function c(e) {
  return s.test(e) && e !== r.fQ;
}
function l(e) {
  return a(e.traceId) && c(e.spanId);
}
function u(e) {
  return new i.s(e);
}