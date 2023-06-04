Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(10412);
const i = require(93487);
const o = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: {
    message: ({
      schemaCode: e
    }) => i.str`must match pattern "${e}"`,
    params: ({
      schemaCode: e
    }) => i._`{pattern: ${e}}`
  },
  code(e) {
    const {
      data: t,
      $data: n,
      schema: o,
      schemaCode: s,
      it: a
    } = e;
    const c = a.opts.unicodeRegExp ? "u" : "";
    const l = n ? i._`(new RegExp(${s}, ${c}))` : r.usePattern(e, o);
    e.fail$data(i._`!${l}.test(${t})`);
  }
};
exports.default = o;