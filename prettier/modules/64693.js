Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(76776);
const o = require(43510);
const s = {
  keyword: "const",
  $data: !0,
  error: {
    message: "must be equal to constant",
    params: ({
      schemaCode: e
    }) => r._`{allowedValue: ${e}}`
  },
  code(e) {
    const {
      gen: t,
      data: n,
      $data: s,
      schemaCode: a,
      schema: c
    } = e;
    if (s || c && "object" == typeof c) {
      e.fail$data(r._`!${i.useFunc(t, o.default)}(${n}, ${a})`);
    } else {
      e.fail(r._`${c} !== ${n}`);
    }
  }
};
exports.default = s;