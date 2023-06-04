var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
exports.encode = function (e) {
  if (0 <= e && e < n.length) return n[e];
  throw new TypeError("Must be between 0 and 63: " + e);
};
exports.decode = function (e) {
  return 65 <= e && e <= 90 ? e - 65 : 97 <= e && e <= 122 ? e - 97 + 26 : 48 <= e && e <= 57 ? e - 48 + 52 : 43 == e ? 62 : 47 == e ? 63 : -1;
};