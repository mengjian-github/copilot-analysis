Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(74815);
const i = require(10412);
const o = require(76776);
const s = require(69351);
const a = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const {
      gen: t,
      schema: n,
      parentSchema: a,
      data: c,
      it: l
    } = e;
    if ("all" === l.opts.removeAdditional && void 0 === a.additionalProperties) {
      s.default.code(new r.KeywordCxt(l, s.default, "additionalProperties"));
    }
    const u = i.allSchemaProperties(n);
    for (const e of u) l.definedProperties.add(e);
    if (l.opts.unevaluated && u.length && !0 !== l.props) {
      l.props = o.mergeEvaluated.props(t, o.toHash(u), l.props);
    }
    const p = u.filter(e => !o.alwaysValidSchema(l, n[e]));
    if (0 === p.length) return;
    const d = t.name("valid");
    for (const n of p) {
      if (h(n)) {
        f(n);
      } else {
        t.if(i.propertyInData(t, c, n, l.opts.ownProperties));
        f(n);
        if (l.allErrors) {
          t.else().var(d, !0);
        }
        t.endIf();
      }
      e.it.definedProperties.add(n);
      e.ok(d);
    }
    function h(e) {
      return l.opts.useDefaults && !l.compositeRule && void 0 !== n[e].default;
    }
    function f(t) {
      e.subschema({
        keyword: "properties",
        schemaProp: t,
        dataProp: t
      }, d);
    }
  }
};
exports.default = a;