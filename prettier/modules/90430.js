Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: {
    message: ({
      schemaCode: e
    }) => r.str`must be multiple of ${e}`,
    params: ({
      schemaCode: e
    }) => r._`{multipleOf: ${e}}`
  },
  code(e) {
    const {
      gen: t,
      data: n,
      schemaCode: i,
      it: o
    } = e;
    const s = o.opts.multipleOfPrecision;
    const a = t.let("res");
    const c = s ? r._`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}` : r._`${a} !== parseInt(${a})`;
    e.fail$data(r._`(${i} === 0 || (${a} = ${n}/${i}, ${c}))`);
  }
};
exports.default = i;