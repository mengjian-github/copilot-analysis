Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(76776);
const o = require(10412);
const s = require(4783);
const a = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
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
      schema: t,
      parentSchema: n,
      it: r
    } = e;
    const {
      prefixItems: a
    } = n;
    r.items = !0;
    if (i.alwaysValidSchema(r, t)) {
      if (a) {
        s.validateAdditionalItems(e, a);
      } else {
        e.ok(o.validateArray(e));
      }
    }
  }
};
exports.default = a;