Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = r.operators;
const o = {
  maximum: {
    okStr: "<=",
    ok: i.LTE,
    fail: i.GT
  },
  minimum: {
    okStr: ">=",
    ok: i.GTE,
    fail: i.LT
  },
  exclusiveMaximum: {
    okStr: "<",
    ok: i.LT,
    fail: i.GTE
  },
  exclusiveMinimum: {
    okStr: ">",
    ok: i.GT,
    fail: i.LTE
  }
};
const s = {
  message: ({
    keyword: e,
    schemaCode: t
  }) => r.str`must be ${o[e].okStr} ${t}`,
  params: ({
    keyword: e,
    schemaCode: t
  }) => r._`{comparison: ${o[e].okStr}, limit: ${t}}`
};
const a = {
  keyword: Object.keys(o),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: s,
  code(e) {
    const {
      keyword: t,
      data: n,
      schemaCode: i
    } = e;
    e.fail$data(r._`${n} ${o[t].fail} ${i} || isNaN(${n})`);
  }
};
exports.default = a;