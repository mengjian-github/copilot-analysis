Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.findEditDistanceScore = void 0;
exports.findEditDistanceScore = function (e, t) {
  if (0 === e.length || 0 === t.length) return {
    score: e.length + t.length
  };
  const n = Array.from({
    length: e.length
  }).map(() => Array.from({
    length: t.length
  }).map(() => 0));
  for (let t = 0; t < e.length; t++) n[t][0] = t;
  for (let e = 0; e < t.length; e++) n[0][e] = e;
  for (let r = 0; r < t.length; r++) for (let i = 0; i < e.length; i++) n[i][r] = Math.min((0 == i ? r : n[i - 1][r]) + 1, (0 == r ? i : n[i][r - 1]) + 1, (0 == i || 0 == r ? Math.max(i, r) : n[i - 1][r - 1]) + (e[i] == t[r] ? 0 : 1));
  return {
    score: n[e.length - 1][t.length - 1]
  };
};