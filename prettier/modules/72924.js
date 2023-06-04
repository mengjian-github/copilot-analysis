Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(64665);
const i = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: e => r.validateTuple(e, "items")
};
exports.default = i;