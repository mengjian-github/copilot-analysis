Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(10412);
const i = require(93487);
const o = require(76776);
const s = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: {
    message: ({
      params: {
        missingProperty: e
      }
    }) => i.str`must have required property '${e}'`,
    params: ({
      params: {
        missingProperty: e
      }
    }) => i._`{missingProperty: ${e}}`
  },
  code(e) {
    const {
      gen: t,
      schema: n,
      schemaCode: s,
      data: a,
      $data: c,
      it: l
    } = e;
    const {
      opts: u
    } = l;
    if (!c && 0 === n.length) return;
    const p = n.length >= u.loopRequired;
    if (l.allErrors) {
      (function () {
        if (p || c) e.block$data(i.nil, d);else for (const t of n) r.checkReportMissingProp(e, t);
      })();
    } else {
      (function () {
        const o = t.let("missing");
        if (p || c) {
          const n = t.let("valid", !0);
          e.block$data(n, () => function (n, o) {
            e.setParams({
              missingProperty: n
            });
            t.forOf(n, s, () => {
              t.assign(o, r.propertyInData(t, a, n, u.ownProperties));
              t.if(i.not(o), () => {
                e.error();
                t.break();
              });
            }, i.nil);
          }(o, n));
          e.ok(n);
        } else {
          t.if(r.checkMissingProp(e, n, o));
          r.reportMissingProp(e, o);
          t.else();
        }
      })();
    }
    if (u.strictRequired) {
      const t = e.parentSchema.properties,
        {
          definedProperties: r
        } = e.it;
      for (const e of n) if (void 0 === (null == t ? void 0 : t[e]) && !r.has(e)) {
        const t = `required property "${e}" is not defined at "${l.schemaEnv.baseId + l.errSchemaPath}" (strictRequired)`;
        (0, o.checkStrictMode)(l, t, l.opts.strictRequired);
      }
    }
    function d() {
      t.forOf("prop", s, n => {
        e.setParams({
          missingProperty: n
        });
        t.if(r.noPropertyInData(t, a, n, u.ownProperties), () => e.error());
      });
    }
  }
};
exports.default = s;