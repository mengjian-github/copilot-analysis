Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.convertChangesToDMP = function (e) {
  for (r = [], i = 0, void 0; i < e.length; i++) {
    var t;
    var n;
    var r;
    var i;
    n = (t = e[i]).added ? 1 : t.removed ? -1 : 0;
    r.push([n, t.value]);
  }
  return r;
};