Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.default = function (e, t, {
  signal: n
} = {}) {
  return new Promise((r, i) => {
    function o() {
      if (null == n) {
        n.removeEventListener("abort", o);
      }
      e.removeListener(t, s);
      e.removeListener("error", a);
    }
    function s(...e) {
      o();
      r(e);
    }
    function a(e) {
      o();
      i(e);
    }
    if (null == n) {
      n.addEventListener("abort", o);
    }
    e.on(t, s);
    e.on("error", a);
  });
};