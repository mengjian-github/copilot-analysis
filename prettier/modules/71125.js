Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(76776);
const i = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const {
      gen: t,
      schema: n,
      it: i
    } = e;
    if (!Array.isArray(n)) throw new Error("ajv implementation error");
    const o = t.name("valid");
    n.forEach((t, n) => {
      if (r.alwaysValidSchema(i, t)) return;
      const s = e.subschema({
        keyword: "allOf",
        schemaProp: n
      }, o);
      e.ok(o);
      e.mergeEvaluated(s);
    });
  }
};
exports.default = i;