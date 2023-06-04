Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getIndentationWindowsDelineations = exports.getBasicWindowDelineations = void 0;
const r = require(79829);
const i = require(75288);
exports.getBasicWindowDelineations = function (e, t) {
  const n = [];
  const r = t.length;
  if (0 == r) return [];
  if (r < e) return [[0, r]];
  for (let t = 0; t < r - e + 1; t++) n.push([t, t + e]);
  return n;
};
exports.getIndentationWindowsDelineations = function (e, t, n, o) {
  if (e.length < n || 0 == o) return [];
  const s = [];
  const a = r.clearLabels(i.parseTree(e.join("\n"), t));
  r.visitTree(a, e => {
    if ("blank" === e.type) return void (e.label = {
      totalLength: 1,
      firstLineAfter: e.lineNumber + 1
    });
    let t = "line" === e.type ? 1 : 0;
    let r = "line" === e.type ? e.lineNumber + 1 : NaN;
    function i(n) {
      return -1 == n ? r - t : e.subs[n].label.firstLineAfter - e.subs[n].label.totalLength;
    }
    function a(t, n) {
      return 0 == t ? n + 1 : e.subs[t - 1].label.firstLineAfter;
    }
    let c = "line" === e.type ? -1 : 0;
    let l = "line" === e.type ? 1 : 0;
    let u = 0;
    for (let p = 0; p < e.subs.length; p++) {
      for (; c >= 0 && c < e.subs.length && "blank" === e.subs[c].type;) {
        l -= e.subs[c].label.totalLength;
        c++;
      }
      if ("blank" !== e.subs[p].type) {
        u = p;
      }
      r = e.subs[p].label.firstLineAfter;
      t += e.subs[p].label.totalLength;
      l += e.subs[p].label.totalLength;
      if (l > o) {
        const t = i(c),
          r = a(p, t),
          d = u == p ? r : a(u, t);
        for (n <= r - t && s.push([t, d]); l > o;) l -= -1 == c ? "line" == e.type ? 1 : 0 : e.subs[c].label.totalLength, c++;
      }
    }
    if (c < e.subs.length) {
      const t = i(c);
      const o = r;
      const a = -1 == c ? o : e.subs[u].label.firstLineAfter;
      if (n <= o - t) {
        s.push([t, a]);
      }
    }
    e.label = {
      totalLength: t,
      firstLineAfter: r
    };
  }, "bottomUp");
  return s.sort((e, t) => e[0] - t[0] || e[1] - t[1]).filter((e, t, n) => 0 == t || e[0] != n[t - 1][0] || e[1] != n[t - 1][1]);
};