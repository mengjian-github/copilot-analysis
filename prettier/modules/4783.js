Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.validateAdditionalItems = void 0;
const r = require(93487);
const i = require(76776);
const o = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: {
    message: ({
      params: {
        len: e
      }
    }) => r.str`must NOT have more than ${e} items`,
    params: ({
      params: {
        len: e
      }
    }) => r._`{limit: ${e}}`
  },
  code(e) {
    const {
      parentSchema: t,
      it: n
    } = e;
    const {
      items: r
    } = t;
    if (Array.isArray(r)) {
      validateAdditionalItems(e, r);
    } else {
      i.checkStrictMode(n, '"additionalItems" is ignored when "items" is not an array of schemas');
    }
  }
};
function validateAdditionalItems(e, t) {
  const {
    gen: n,
    schema: o,
    data: s,
    keyword: a,
    it: c
  } = e;
  c.items = !0;
  const l = n.const("len", r._`${s}.length`);
  if (!1 === o) {
    e.setParams({
      len: t.length
    });
    e.pass(r._`${l} <= ${t.length}`);
  } else if ("object" == typeof o && !i.alwaysValidSchema(c, o)) {
    const o = n.var("valid", r._`${l} <= ${t.length}`);
    n.if(r.not(o), () => function (o) {
      n.forRange("i", t.length, l, t => {
        e.subschema({
          keyword: a,
          dataProp: t,
          dataPropType: i.Type.Num
        }, o);
        if (c.allErrors) {
          n.if(r.not(o), () => n.break());
        }
      });
    }(o));
    e.ok(o);
  }
}
exports.validateAdditionalItems = validateAdditionalItems;
exports.default = o;