require.d(exports, {
  A3: () => d,
  Br: () => a,
  G3: () => p,
  HN: () => c,
  TW: () => u,
  WZ: () => l
});
var r = require(15834);
var i = require(97817);
var o = require(7150);
var s = r.Y("OpenTelemetry Context Key SPAN");
function a(e) {
  return e.getValue(s) || void 0;
}
function c() {
  return a(o.c.getInstance().active());
}
function l(e, t) {
  return e.setValue(s, t);
}
function u(e) {
  return e.deleteValue(s);
}
function p(e, t) {
  return l(e, new i.s(t));
}
function d(e) {
  var t;
  return null === (t = a(e)) || void 0 === t ? void 0 : t.spanContext();
}