Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(10412);
const i = require(93487);
const o = require(76776);
const s = require(76776);
const a = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const {
      gen: t,
      schema: n,
      data: a,
      parentSchema: c,
      it: l
    } = e;
    const {
      opts: u
    } = l;
    const p = r.allSchemaProperties(n);
    const d = p.filter(e => o.alwaysValidSchema(l, n[e]));
    if (0 === p.length || d.length === p.length && (!l.opts.unevaluated || !0 === l.props)) return;
    const h = u.strictSchema && !u.allowMatchingProperties && c.properties;
    const f = t.name("valid");
    if (!0 === l.props || l.props instanceof i.Name) {
      l.props = s.evaluatedPropsToName(t, l.props);
    }
    const {
      props: m
    } = l;
    function g(e) {
      for (const t in h) if (new RegExp(e).test(t)) {
        o.checkStrictMode(l, `property ${t} matches pattern ${e} (use allowMatchingProperties)`);
      }
    }
    function y(n) {
      t.forIn("key", a, o => {
        t.if(i._`${r.usePattern(e, n)}.test(${o})`, () => {
          const r = d.includes(n);
          if (r) {
            e.subschema({
              keyword: "patternProperties",
              schemaProp: n,
              dataProp: o,
              dataPropType: s.Type.Str
            }, f);
          }
          if (l.opts.unevaluated && !0 !== m) {
            t.assign(i._`${m}[${o}]`, !0);
          } else {
            if (r || l.allErrors) {
              t.if(i.not(f), () => t.break());
            }
          }
        });
      });
    }
    !function () {
      for (const e of p) {
        if (h) {
          g(e);
        }
        if (l.allErrors) {
          y(e);
        } else {
          t.var(f, !0);
          y(e);
          t.if(f);
        }
      }
    }();
  }
};
exports.default = a;