Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.generateOptions = function (e, t) {
  if ("function" == typeof e) t.callback = e;else if (e) for (var n in e) if (e.hasOwnProperty(n)) {
    t[n] = e[n];
  }
  return t;
};