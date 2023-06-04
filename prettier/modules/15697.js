Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(76776);
const i = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const {
      gen: t,
      schema: n,
      it: i
    } = e;
    if (r.alwaysValidSchema(i, n)) return void e.fail();
    const o = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, o);
    e.failResult(o, () => e.reset(), () => e.error());
  },
  error: {
    message: "must NOT be valid"
  }
};
exports.default = i;