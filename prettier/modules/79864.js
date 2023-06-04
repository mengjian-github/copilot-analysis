Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(76776);
const o = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: {
    message: ({
      params: {
        min: e,
        max: t
      }
    }) => void 0 === t ? r.str`must contain at least ${e} valid item(s)` : r.str`must contain at least ${e} and no more than ${t} valid item(s)`,
    params: ({
      params: {
        min: e,
        max: t
      }
    }) => void 0 === t ? r._`{minContains: ${e}}` : r._`{minContains: ${e}, maxContains: ${t}}`
  },
  code(e) {
    const {
      gen: t,
      schema: n,
      parentSchema: o,
      data: s,
      it: a
    } = e;
    let c;
    let l;
    const {
      minContains: u,
      maxContains: p
    } = o;
    if (a.opts.next) {
      c = void 0 === u ? 1 : u;
      l = p;
    } else {
      c = 1;
    }
    const d = t.const("len", r._`${s}.length`);
    e.setParams({
      min: c,
      max: l
    });
    if (void 0 === l && 0 === c) return void (0, i.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
    if (void 0 !== l && c > l) {
      i.checkStrictMode(a, '"minContains" > "maxContains" is always invalid');
      return void e.fail();
    }
    if (i.alwaysValidSchema(a, n)) {
      let t = r._`${d} >= ${c}`;
      if (void 0 !== l) {
        t = r._`${t} && ${d} <= ${l}`;
      }
      return void e.pass(t);
    }
    a.items = !0;
    const h = t.name("valid");
    function f() {
      const e = t.name("_valid");
      const n = t.let("count", 0);
      m(e, () => t.if(e, () => function (e) {
        t.code(r._`${e}++`);
        if (void 0 === l) {
          t.if(r._`${e} >= ${c}`, () => t.assign(h, !0).break());
        } else {
          t.if(r._`${e} > ${l}`, () => t.assign(h, !1).break());
          if (1 === c) {
            t.assign(h, !0);
          } else {
            t.if(r._`${e} >= ${c}`, () => t.assign(h, !0));
          }
        }
      }(n)));
    }
    function m(n, r) {
      t.forRange("i", 0, d, t => {
        e.subschema({
          keyword: "contains",
          dataProp: t,
          dataPropType: i.Type.Num,
          compositeRule: !0
        }, n);
        r();
      });
    }
    if (void 0 === l && 1 === c) {
      m(h, () => t.if(h, () => t.break()));
    } else {
      if (0 === c) {
        t.let(h, !0);
        if (void 0 !== l) {
          t.if(r._`${s}.length > 0`, f);
        }
      } else {
        t.let(h, !1);
        f();
      }
    }
    e.result(h, () => e.reset());
  }
};
exports.default = o;