Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.processJava = void 0;
const r = require(29608);
const i = require(79829);
const o = require(75288);
const s = o.buildLabelRules({
  package: /^package /,
  import: /^import /,
  class: /\bclass /,
  interface: /\binterface /,
  javadoc: /^\/\*\*/,
  comment_multi: /^\/\*[^*]/,
  comment_single: /^\/\//,
  annotation: /^@/,
  opener: /^[\[({]/,
  closer: /^[\])}]/
});
exports.processJava = function (e) {
  let t = e;
  o.labelLines(t, s);
  t = o.combineClosersAndOpeners(t);
  t = o.flattenVirtual(t);
  o.labelVirtualInherited(t);
  i.visitTree(t, e => {
    if ("class" === e.label || "interface" === e.label) for (const t of e.subs) if (r.isBlank(t) || void 0 !== t.label && "annotation" !== t.label) {
      t.label = "member";
    }
  }, "bottomUp");
  return t;
};