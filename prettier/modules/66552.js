Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(76776);
const i = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({
    keyword: e,
    parentSchema: t,
    it: n
  }) {
    if (void 0 === t.if) {
      r.checkStrictMode(n, `"${e}" without "if" is ignored`);
    }
  }
};
exports.default = i;