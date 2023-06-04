Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueEqual = void 0;
const r = require(5151);
(exports.ValueEqual || (exports.ValueEqual = {})).Equal = function e(t, n) {
  if (r.Is.Object(t)) return function (t, n) {
    if (!r.Is.Object(n)) return !1;
    const i = [...globalThis.Object.keys(t), ...globalThis.Object.getOwnPropertySymbols(t)];
    const o = [...globalThis.Object.keys(n), ...globalThis.Object.getOwnPropertySymbols(n)];
    return i.length === o.length && i.every(r => e(t[r], n[r]));
  }(t, n);
  if (r.Is.Date(t)) return function (e, t) {
    return r.Is.Date(t) && e.getTime() === t.getTime();
  }(t, n);
  if (r.Is.TypedArray(t)) return function (t, n) {
    return !(!r.Is.TypedArray(n) || t.length !== n.length || globalThis.Object.getPrototypeOf(t).constructor.name !== globalThis.Object.getPrototypeOf(n).constructor.name) && t.every((t, r) => e(t, n[r]));
  }(t, n);
  if (r.Is.Array(t)) return function (t, n) {
    return !(!r.Is.Array(n) || t.length !== n.length) && t.every((t, r) => e(t, n[r]));
  }(t, n);
  if (r.Is.Value(t)) return function (e, t) {
    return e === t;
  }(t, n);
  throw new Error("ValueEquals: Unable to compare value");
};