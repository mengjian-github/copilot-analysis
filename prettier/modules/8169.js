Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.default = function (e, t, n) {
  var r = !0;
  var i = !1;
  var o = !1;
  var s = 1;
  return function a() {
    if (r && !o) {
      if (i) {
        s++;
      } else {
        r = !1;
      }
      if (e + s <= n) return s;
      o = !0;
    }
    if (!i) {
      if (o) {
        r = !0;
      }
      return t <= e - s ? -s++ : (i = !0, a());
    }
  };
};