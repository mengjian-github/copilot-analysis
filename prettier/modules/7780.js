function arrayStartsWith(e, t) {
  if (t.length > e.length) return !1;
  for (var n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1;
  return !0;
}
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.arrayEqual = function (e, t) {
  return e.length === t.length && arrayStartsWith(e, t);
};
exports.arrayStartsWith = arrayStartsWith;