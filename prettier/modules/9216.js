function n(e, r, i, o, s, a) {
  var c = Math.floor((r - e) / 2) + e;
  var l = s(i, o[c], !0);
  return 0 === l ? c : l > 0 ? r - c > 1 ? n(c, r, i, o, s, a) : a == exports.LEAST_UPPER_BOUND ? r < o.length ? r : -1 : c : c - e > 1 ? n(e, c, i, o, s, a) : a == exports.LEAST_UPPER_BOUND ? c : e < 0 ? -1 : e;
}
exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;
exports.search = function (e, r, i, o) {
  if (0 === r.length) return -1;
  var s = n(-1, r.length, e, r, i, o || exports.GREATEST_LOWER_BOUND);
  if (s < 0) return -1;
  for (; s - 1 >= 0 && 0 === i(r[s], r[s - 1], !0);) --s;
  return s;
};