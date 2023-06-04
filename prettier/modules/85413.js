Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getDebounceLimit = void 0;
const r = require(59189);
exports.getDebounceLimit = async function (e, t) {
  let n;
  if ((await e.get(r.Features).debouncePredict()) && t.measurements.contextualFilterScore) {
    const e = t.measurements.contextualFilterScore;
    const r = .3475;
    const i = 7;
    n = 25 + 250 / (1 + Math.pow(e / r, i));
  } else n = await e.get(r.Features).debounceMs();
  return n > 0 ? n : 75;
};