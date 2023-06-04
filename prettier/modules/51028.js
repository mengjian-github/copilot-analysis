Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.fromTreeWithValuedLines = exports.fromTreeWithFocussedLines = exports.DEFAULT_TREE_TRAVERSAL_CONFIG = void 0;
const r = require(58267);
const i = require(48126);
function fromTreeWithValuedLines(e) {
  const t = r.foldTree(e, [], (e, t) => ("line" !== e.type && "blank" !== e.type || t.push("line" === e.type ? [r.deparseLine(e).trimEnd(), e.label ?? 0] : ["", e.label ?? 0]), t), "topDown");
  return new i.ElidableText(...t);
}
exports.DEFAULT_TREE_TRAVERSAL_CONFIG = {
  worthUp: .9,
  worthSibling: .88,
  worthDown: .8
};
exports.fromTreeWithFocussedLines = function (e, n = exports.DEFAULT_TREE_TRAVERSAL_CONFIG) {
  const i = r.mapLabels(e, e => e ? 1 : void 0);
  r.visitTree(i, e => {
    if (r.isBlank(e)) return;
    const t = Math.max(...e.subs.map(e => e.label ?? 0));
    e.label = Math.max(e.label ?? 0, t * n.worthUp);
  }, "bottomUp");
  r.visitTree(i, e => {
    if (r.isBlank(e)) return;
    const t = e.subs.map(e => e.label ?? 0);
    let i = [...t];
    for (let e = 0; e < t.length; e++) if (0 !== t[e]) {
      i = i.map((r, i) => Math.max(r, Math.pow(n.worthSibling, Math.abs(e - i)) * t[e]));
    }
    const o = e.label;
    if (void 0 !== o) {
      i = i.map(e => Math.max(e, n.worthDown * o));
    }
    e.subs.forEach((e, t) => e.label = i[t]);
  }, "topDown");
  return fromTreeWithValuedLines(i);
};
exports.fromTreeWithValuedLines = fromTreeWithValuedLines;