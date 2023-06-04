Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: {
    message: ({
      schemaCode: e
    }) => r.str`must match format "${e}"`,
    params: ({
      schemaCode: e
    }) => r._`{format: ${e}}`
  },
  code(e, t) {
    const {
      gen: n,
      data: i,
      $data: o,
      schema: s,
      schemaCode: a,
      it: c
    } = e;
    const {
      opts: l,
      errSchemaPath: u,
      schemaEnv: p,
      self: d
    } = c;
    if (l.validateFormats) {
      if (o) {
        (function () {
          const o = n.scopeValue("formats", {
            ref: d.formats,
            code: l.code.formats
          });
          const s = n.const("fDef", r._`${o}[${a}]`);
          const c = n.let("fType");
          const u = n.let("format");
          n.if(r._`typeof ${s} == "object" && !(${s} instanceof RegExp)`, () => n.assign(c, r._`${s}.type || "string"`).assign(u, r._`${s}.validate`), () => n.assign(c, r._`"string"`).assign(u, s));
          e.fail$data(r.or(!1 === l.strictSchema ? r.nil : r._`${a} && !${u}`, function () {
            const e = p.$async ? r._`(${s}.async ? await ${u}(${i}) : ${u}(${i}))` : r._`${u}(${i})`;
            const n = r._`(typeof ${u} == "function" ? ${e} : ${u}.test(${i}))`;
            return r._`${u} && ${u} !== true && ${c} === ${t} && !${n}`;
          }()));
        })();
      } else {
        (function () {
          const o = d.formats[s];
          if (!o) return void function () {
            if (!1 !== l.strictSchema) throw new Error(e());
            function e() {
              return `unknown format "${s}" ignored in schema at path "${u}"`;
            }
            d.logger.warn(e());
          }();
          if (!0 === o) return;
          const [a, c, h] = function (e) {
            const t = e instanceof RegExp ? r.regexpCode(e) : l.code.formats ? r._`${l.code.formats}${r.getProperty(s)}` : void 0;
            const i = n.scopeValue("formats", {
              key: s,
              ref: e,
              code: t
            });
            return "object" != typeof e || e instanceof RegExp ? ["string", e, i] : [e.type || "string", e.validate, r._`${i}.validate`];
          }(o);
          if (a === t) {
            e.pass(function () {
              if ("object" == typeof o && !(o instanceof RegExp) && o.async) {
                if (!p.$async) throw new Error("async format in sync schema");
                return r._`await ${h}(${i})`;
              }
              return "function" == typeof c ? r._`${h}(${i})` : r._`${h}.test(${i})`;
            }());
          }
        })();
      }
    }
  }
};
exports.default = i;