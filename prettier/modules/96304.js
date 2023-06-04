Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.default = function (e) {
  return function (t, n) {
    return new Promise((r, i) => {
      e.call(this, t, n, (e, t) => {
        if (e) {
          i(e);
        } else {
          r(t);
        }
      });
    });
  };
};