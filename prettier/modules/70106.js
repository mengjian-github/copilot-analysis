Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.debounce = exports.Debouncer = void 0;
exports.Debouncer = class {
  async debounce(e) {
    if (this.state) {
      clearTimeout(this.state.timer);
      this.state.reject();
      this.state = void 0;
    }
    return new Promise((t, n) => {
      this.state = {
        timer: setTimeout(() => t(), e),
        reject: n
      };
    });
  }
};
exports.debounce = function (e, t) {
  let n;
  return (...r) => (n && clearTimeout(n), new Promise(i => {
    n = setTimeout(() => {
      const e = t(...r);
      i(e);
    }, e);
  }));
};