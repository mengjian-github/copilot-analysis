Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(10412);
const i = require(93487);
const o = require(22141);
const s = require(76776);
const a = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: {
    message: "must NOT have additional properties",
    params: ({
      params: e
    }) => i._`{additionalProperty: ${e.additionalProperty}}`
  },
  code(e) {
    const {
      gen: t,
      schema: n,
      parentSchema: a,
      data: c,
      errsCount: l,
      it: u
    } = e;
    if (!l) throw new Error("ajv implementation error");
    const {
      allErrors: p,
      opts: d
    } = u;
    u.props = !0;
    if ("all" !== d.removeAdditional && (0, s.alwaysValidSchema)(u, n)) return;
    const h = r.allSchemaProperties(a.properties);
    const f = r.allSchemaProperties(a.patternProperties);
    function m(e) {
      t.code(i._`delete ${c}[${e}]`);
    }
    function g(r) {
      if ("all" === d.removeAdditional || d.removeAdditional && !1 === n) m(r);else {
        if (!1 === n) {
          e.setParams({
            additionalProperty: r
          });
          e.error();
          return void (p || t.break());
        }
        if ("object" == typeof n && !s.alwaysValidSchema(u, n)) {
          const n = t.name("valid");
          if ("failing" === d.removeAdditional) {
            y(r, n, !1);
            t.if(i.not(n), () => {
              e.reset();
              m(r);
            });
          } else {
            y(r, n);
            if (p) {
              t.if(i.not(n), () => t.break());
            }
          }
        }
      }
    }
    function y(t, n, r) {
      const i = {
        keyword: "additionalProperties",
        dataProp: t,
        dataPropType: s.Type.Str
      };
      if (!1 === r) {
        Object.assign(i, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        });
      }
      e.subschema(i, n);
    }
    t.forIn("key", c, n => {
      if (h.length || f.length) {
        t.if(function (n) {
          let o;
          if (h.length > 8) {
            const e = s.schemaRefOrVal(u, a.properties, "properties");
            o = r.isOwnProperty(t, e, n);
          } else o = h.length ? i.or(...h.map(e => i._`${n} === ${e}`)) : i.nil;
          if (f.length) {
            o = i.or(o, ...f.map(t => i._`${r.usePattern(e, t)}.test(${n})`));
          }
          return i.not(o);
        }(n), () => g(n));
      } else {
        g(n);
      }
    });
    e.ok(i._`${l} === ${o.default.errors}`);
  }
};
exports.default = a;