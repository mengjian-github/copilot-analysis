function n(e, t, n) {
  var r = e[t];
  e[t] = e[n];
  e[n] = r;
}
function r(e, t, i, o) {
  if (i < o) {
    var s = i - 1;
    n(e, (u = i, p = o, Math.round(u + Math.random() * (p - u))), o);
    for (a = e[o], c = i, void 0; c < o; c++) {
      var a;
      var c;
      if (t(e[c], a) <= 0) {
        n(e, s += 1, c);
      }
    }
    n(e, s + 1, c);
    var l = s + 1;
    r(e, t, i, l - 1);
    r(e, t, l + 1, o);
  }
  var u;
  var p;
}
exports.U = function (e, t) {
  r(e, t, 0, e.length - 1);
};