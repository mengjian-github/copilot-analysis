require.d(exports, {
  Dt: () => m,
  J3: () => u,
  Jt: () => c,
  KO: () => h,
  PW: () => d,
  U: () => a,
  Us: () => p,
  X_: () => g,
  aE: () => l,
  i5: () => s,
  ji: () => f,
  vF: () => y
});
var r = require(90471);
var i = Math.pow(10, 6);
var o = Math.pow(10, 9);
function s(e) {
  var t = e / 1e3;
  return [Math.trunc(t), Math.round(e % 1e3 * i)];
}
function a() {
  var e = r.t.timeOrigin;
  if ("number" != typeof e) {
    var t = r.t;
    e = t.timing && t.timing.fetchStart;
  }
  return e;
}
function c(e) {
  return y(s(a()), s("number" == typeof e ? e : r.t.now()));
}
function l(e) {
  if (m(e)) return e;
  if ("number" == typeof e) return e < a() ? c(e) : s(e);
  if (e instanceof Date) return s(e.getTime());
  throw TypeError("Invalid input type");
}
function u(e, t) {
  var n = t[0] - e[0];
  var r = t[1] - e[1];
  if (r < 0) {
    n -= 1;
    r += o;
  }
  return [n, r];
}
function p(e) {
  var t = "" + "0".repeat(9) + e[1] + "Z";
  var n = t.substr(t.length - 9 - 1);
  return new Date(1e3 * e[0]).toISOString().replace("000Z", n);
}
function d(e) {
  return e[0] * o + e[1];
}
function h(e) {
  return Math.round(1e3 * e[0] + e[1] / 1e6);
}
function f(e) {
  return Math.round(1e6 * e[0] + e[1] / 1e3);
}
function m(e) {
  return Array.isArray(e) && 2 === e.length && "number" == typeof e[0] && "number" == typeof e[1];
}
function g(e) {
  return m(e) || "number" == typeof e || e instanceof Date;
}
function y(e, t) {
  var n = [e[0] + t[0], e[1] + t[1]];
  if (n[1] >= o) {
    n[1] -= o;
    n[0] += 1;
  }
  return n;
}