Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(50453);
const i = require(93487);
const o = require(76776);
const s = require(43510);
const a = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: {
    message: ({
      params: {
        i: e,
        j: t
      }
    }) => i.str`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
    params: ({
      params: {
        i: e,
        j: t
      }
    }) => i._`{i: ${e}, j: ${t}}`
  },
  code(e) {
    const {
      gen: t,
      data: n,
      $data: a,
      schema: c,
      parentSchema: l,
      schemaCode: u,
      it: p
    } = e;
    if (!a && !c) return;
    const d = t.let("valid");
    const h = l.items ? r.getSchemaTypes(l.items) : [];
    function f(o, s) {
      const a = t.name("item");
      const c = r.checkDataTypes(h, a, p.opts.strictNumbers, r.DataType.Wrong);
      const l = t.const("indices", i._`{}`);
      t.for(i._`;${o}--;`, () => {
        t.let(a, i._`${n}[${o}]`);
        t.if(c, i._`continue`);
        if (h.length > 1) {
          t.if(i._`typeof ${a} == "string"`, i._`${a} += "_"`);
        }
        t.if(i._`typeof ${l}[${a}] == "number"`, () => {
          t.assign(s, i._`${l}[${a}]`);
          e.error();
          t.assign(d, !1).break();
        }).code(i._`${l}[${a}] = ${o}`);
      });
    }
    function m(r, a) {
      const c = o.useFunc(t, s.default);
      const l = t.name("outer");
      t.label(l).for(i._`;${r}--;`, () => t.for(i._`${a} = ${r}; ${a}--;`, () => t.if(i._`${c}(${n}[${r}], ${n}[${a}])`, () => {
        e.error();
        t.assign(d, !1).break(l);
      })));
    }
    e.block$data(d, function () {
      const r = t.let("i", i._`${n}.length`);
      const o = t.let("j");
      e.setParams({
        i: r,
        j: o
      });
      t.assign(d, !0);
      t.if(i._`${r} > 1`, () => (h.length > 0 && !h.some(e => "object" === e || "array" === e) ? f : m)(r, o));
    }, i._`${u} === false`);
    e.ok(d);
  }
};
exports.default = a;