Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.processMarkdown = void 0;
const r = require(4876);
const i = require(3469);
const o = i.buildLabelRules({
  heading: /^# /,
  subheading: /^## /,
  subsubheading: /### /
});
exports.processMarkdown = function (e) {
  let t = e;
  i.labelLines(t, o);
  if ((0, r.isBlank)(t)) return t;
  function n(e) {
    return "heading" === e.label ? 1 : "subheading" === e.label ? 2 : "subsubheading" === e.label ? 3 : void 0;
  }
  let s = [t];
  let a = [...t.subs];
  t.subs = [];
  for (const e of a) {
    const t = n(e);
    if (void 0 === t || r.isBlank(e)) s[s.length - 1].subs.push(e);else {
      for (; s.length < t;) s.push(s[s.length - 1]);
      for (s[t - 1].subs.push(e), s[t] = e; s.length > t + 1;) s.pop();
    }
  }
  t = i.groupBlocks(t);
  t = i.flattenVirtual(t);
  i.labelVirtualInherited(t);
  return t;
};