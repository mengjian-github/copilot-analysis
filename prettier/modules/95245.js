Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueClone = void 0;
const r = require(5151);
(exports.ValueClone || (exports.ValueClone = {})).Clone = function e(t) {
  if (r.Is.Date(t)) return function (e) {
    return new globalThis.Date(e.toISOString());
  }(t);
  if (r.Is.Object(t)) return function (t) {
    return [...globalThis.Object.keys(t), ...globalThis.Object.getOwnPropertySymbols(t)].reduce((n, r) => ({
      ...n,
      [r]: e(t[r])
    }), {});
  }(t);
  if (r.Is.Array(t)) return function (t) {
    return t.map(t => e(t));
  }(t);
  if (r.Is.TypedArray(t)) return function (e) {
    return e.slice();
  }(t);
  if (r.Is.Value(t)) return t;
  throw new Error("ValueClone: Unable to clone value");
};