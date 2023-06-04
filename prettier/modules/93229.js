Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(76776);
const o = require(74499);
const s = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: {
    message({
      keyword: e,
      schemaCode: t
    }) {
      const n = "maxLength" === e ? "more" : "fewer";
      return r.str`must NOT have ${n} than ${t} characters`;
    },
    params: ({
      schemaCode: e
    }) => r._`{limit: ${e}}`
  },
  code(e) {
    const {
      keyword: t,
      data: n,
      schemaCode: s,
      it: a
    } = e;
    const c = "maxLength" === t ? r.operators.GT : r.operators.LT;
    const l = !1 === a.opts.unicode ? r._`${n}.length` : r._`${i.useFunc(e.gen, o.default)}(${n})`;
    e.fail$data(r._`${l} ${c} ${s}`);
  }
};
exports.default = s;