Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(76776);
const o = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: {
    message: "property name must be valid",
    params: ({
      params: e
    }) => r._`{propertyName: ${e.propertyName}}`
  },
  code(e) {
    const {
      gen: t,
      schema: n,
      data: o,
      it: s
    } = e;
    if (i.alwaysValidSchema(s, n)) return;
    const a = t.name("valid");
    t.forIn("key", o, n => {
      e.setParams({
        propertyName: n
      });
      e.subschema({
        keyword: "propertyNames",
        data: n,
        dataTypes: ["string"],
        propertyName: n,
        compositeRule: !0
      }, a);
      t.if(r.not(a), () => {
        e.error(!0);
        if (s.allErrors) {
          t.break();
        }
      });
    });
    e.ok(a);
  }
};
exports.default = o;