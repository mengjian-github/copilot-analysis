Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(76776);
const o = require(43510);
const s = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: {
    message: "must be equal to one of the allowed values",
    params: ({
      schemaCode: e
    }) => r._`{allowedValues: ${e}}`
  },
  code(e) {
    const {
      gen: t,
      data: n,
      $data: s,
      schema: a,
      schemaCode: c,
      it: l
    } = e;
    if (!s && 0 === a.length) throw new Error("enum must have non-empty array");
    const u = a.length >= l.opts.loopEnum;
    let p;
    const d = () => null != p ? p : p = i.useFunc(t, o.default);
    let h;
    if (u || s) {
      h = t.let("valid");
      e.block$data(h, function () {
        t.assign(h, !1);
        t.forOf("v", c, e => t.if(r._`${d()}(${n}, ${e})`, () => t.assign(h, !0).break()));
      });
    } else {
      if (!Array.isArray(a)) throw new Error("ajv implementation error");
      const e = t.const("vSchema", c);
      h = r.or(...a.map((t, i) => function (e, t) {
        const i = a[t];
        return "object" == typeof i && null !== i ? r._`${d()}(${n}, ${e}[${t}])` : r._`${n} === ${i}`;
      }(e, i)));
    }
    e.pass(h);
  }
};
exports.default = s;