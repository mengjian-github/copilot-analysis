Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.validateTuple = void 0;
const r = require(93487);
const i = require(76776);
const o = require(10412);
const s = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const {
      schema: t,
      it: n
    } = e;
    if (Array.isArray(t)) return validateTuple(e, "additionalItems", t);
    n.items = !0;
    if (i.alwaysValidSchema(n, t)) {
      e.ok(o.validateArray(e));
    }
  }
};
function validateTuple(e, t, n = e.schema) {
  const {
    gen: o,
    parentSchema: s,
    data: a,
    keyword: c,
    it: l
  } = e;
  !function (e) {
    const {
      opts: r,
      errSchemaPath: o
    } = l;
    const s = n.length;
    const a = s === e.minItems && (s === e.maxItems || !1 === e[t]);
    if (r.strictTuples && !a) {
      const e = `"${c}" is ${s}-tuple, but minItems or maxItems/${t} are not specified or different at path "${o}"`;
      i.checkStrictMode(l, e, r.strictTuples);
    }
  }(s);
  if (l.opts.unevaluated && n.length && !0 !== l.items) {
    l.items = i.mergeEvaluated.items(o, n.length, l.items);
  }
  const u = o.name("valid");
  const p = o.const("len", r._`${a}.length`);
  n.forEach((t, n) => {
    if (i.alwaysValidSchema(l, t)) {
      o.if(r._`${p} > ${n}`, () => e.subschema({
        keyword: c,
        schemaProp: n,
        dataProp: n
      }, u));
      e.ok(u);
    }
  });
}
exports.validateTuple = validateTuple;
exports.default = s;