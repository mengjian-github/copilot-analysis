Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(89306);
const o = require(25173);
const s = require(76776);
const a = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: {
    message: ({
      params: {
        discrError: e,
        tagName: t
      }
    }) => e === i.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
    params: ({
      params: {
        discrError: e,
        tag: t,
        tagName: n
      }
    }) => r._`{error: ${e}, tag: ${n}, tagValue: ${t}}`
  },
  code(e) {
    const {
      gen: t,
      data: n,
      schema: a,
      parentSchema: c,
      it: l
    } = e;
    const {
      oneOf: u
    } = c;
    if (!l.opts.discriminator) throw new Error("discriminator: requires discriminator option");
    const p = a.propertyName;
    if ("string" != typeof p) throw new Error("discriminator: requires propertyName");
    if (a.mapping) throw new Error("discriminator: mapping is not supported");
    if (!u) throw new Error("discriminator: requires oneOf keyword");
    const d = t.let("valid", !1);
    const h = t.const("tag", r._`${n}${r.getProperty(p)}`);
    function f(n) {
      const i = t.name("valid");
      const o = e.subschema({
        keyword: "oneOf",
        schemaProp: n
      }, i);
      e.mergeEvaluated(o, r.Name);
      return i;
    }
    t.if(r._`typeof ${h} == "string"`, () => function () {
      const n = function () {
        var e;
        const t = {};
        const n = i(c);
        let r = !0;
        for (let t = 0; t < u.length; t++) {
          let c = u[t];
          if ((null == c ? void 0 : c.$ref) && !s.schemaHasRulesButRef(c, l.self.RULES)) {
            c = o.resolveRef.call(l.self, l.schemaEnv.root, l.baseId, null == c ? void 0 : c.$ref);
            if (c instanceof o.SchemaEnv) {
              c = c.schema;
            }
          }
          const d = null === (e = null == c ? void 0 : c.properties) || void 0 === e ? void 0 : e[p];
          if ("object" != typeof d) throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${p}"`);
          r = r && (n || i(c));
          a(d, t);
        }
        if (!r) throw new Error(`discriminator: "${p}" must be required`);
        return t;
        function i({
          required: e
        }) {
          return Array.isArray(e) && e.includes(p);
        }
        function a(e, t) {
          if (e.const) d(e.const, t);else {
            if (!e.enum) throw new Error(`discriminator: "properties/${p}" must have "const" or "enum"`);
            for (const n of e.enum) d(n, t);
          }
        }
        function d(e, n) {
          if ("string" != typeof e || e in t) throw new Error(`discriminator: "${p}" values must be unique strings`);
          t[e] = n;
        }
      }();
      t.if(!1);
      for (const e in n) {
        t.elseIf(r._`${h} === ${e}`);
        t.assign(d, f(n[e]));
      }
      t.else();
      e.error(!1, {
        discrError: i.DiscrError.Mapping,
        tag: h,
        tagName: p
      });
      t.endIf();
    }(), () => e.error(!1, {
      discrError: i.DiscrError.Tag,
      tag: h,
      tagName: p
    }));
    e.ok(d);
  }
};
exports.default = a;