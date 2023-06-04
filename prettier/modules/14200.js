Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(76776);
const o = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: {
    message: "must match exactly one schema in oneOf",
    params: ({
      params: e
    }) => r._`{passingSchemas: ${e.passing}}`
  },
  code(e) {
    const {
      gen: t,
      schema: n,
      parentSchema: o,
      it: s
    } = e;
    if (!Array.isArray(n)) throw new Error("ajv implementation error");
    if (s.opts.discriminator && o.discriminator) return;
    const a = n;
    const c = t.let("valid", !1);
    const l = t.let("passing", null);
    const u = t.name("_valid");
    e.setParams({
      passing: l
    });
    t.block(function () {
      a.forEach((n, o) => {
        let a;
        if (i.alwaysValidSchema(s, n)) {
          t.var(u, !0);
        } else {
          a = e.subschema({
            keyword: "oneOf",
            schemaProp: o,
            compositeRule: !0
          }, u);
        }
        if (o > 0) {
          t.if(r._`${u} && ${c}`).assign(c, !1).assign(l, r._`[${l}, ${o}]`).else();
        }
        t.if(u, () => {
          t.assign(c, !0);
          t.assign(l, o);
          if (a) {
            e.mergeEvaluated(a, r.Name);
          }
        });
      });
    });
    e.result(c, () => e.reset(), () => e.error(!0));
  }
};
exports.default = o;