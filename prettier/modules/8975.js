Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.elidableTextForDiff = void 0;
const r = require(9479);
const i = require(2180);
const o = require(5533);
exports.elidableTextForDiff = function (e, t) {
  const n = "string" == typeof e ? "string" == typeof t ? void 0 : t.languageId : "string" == typeof t || e.languageId === t.languageId ? e.languageId : void 0;
  e = "string" == typeof e ? e : e.source;
  t = "string" == typeof t ? t : t.source;
  const s = r.structuredPatch("", "", e, t);
  const a = new Set();
  const c = new Set();
  for (const e of s.hunks) {
    for (let t = e.oldStart; t < e.oldStart + e.oldLines; t++) a.add(t);
    for (let t = e.newStart; t < e.newStart + e.newLines; t++) c.add(t);
  }
  const l = i.mapLabels(i.flattenVirtual(i.parseTree(e, n)), () => !1);
  const u = i.mapLabels(i.flattenVirtual(i.parseTree(t, n)), () => !1);
  i.visitTree(l, e => {
    if ("line" !== e.type && "blank" !== e.type) {
      if (a.has(e.lineNumber)) {
        e.label = !0;
      }
    }
  }, "topDown");
  i.visitTree(u, e => {
    if ("line" !== e.type && "blank" !== e.type) {
      if (c.has(e.lineNumber)) {
        e.label = !0;
      }
    }
  }, "topDown");
  return [o.fromTreeWithFocussedLines(l), o.fromTreeWithFocussedLines(u)];
};