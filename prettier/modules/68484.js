Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.elidableTextForSourceCode = void 0;
const r = require(58267);
const i = require(51028);
exports.elidableTextForSourceCode = function (e, t = !0, n = !0) {
  const o = "string" == typeof e ? r.parseTree(e) : r.parseTree(e.source, e.languageId);
  r.flattenVirtual(o);
  const s = r.mapLabels(o, e => t && "closer" !== e);
  r.visitTree(s, e => {
    if (void 0 === e.label) {
      e.label = t && !1 !== e.label;
    }
  }, "topDown");
  if (t) {
    r.visitTree(s, e => {
      if (e.label) {
        let t = !1;
        for (const n of [...e.subs].reverse()) if (n.label && !t) {
          t = !0;
        } else {
          n.label = !1;
        }
      } else for (const t of e.subs) t.label = !1;
      if (e.subs.length > 0) {
        e.label = !1;
      }
    }, "topDown");
  }
  if (n) {
    r.visitTree(s, e => {
      if (e.label) {
        e.label = (r.isLine(e) || r.isBlank(e)) && 0 == e.lineNumber;
      }
    }, "topDown");
  }
  return i.fromTreeWithFocussedLines(s);
};