Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(93487);
const i = require(76776);
const o = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: {
    message: ({
      params: e
    }) => r.str`must match "${e.ifClause}" schema`,
    params: ({
      params: e
    }) => r._`{failingKeyword: ${e.ifClause}}`
  },
  code(e) {
    const {
      gen: t,
      parentSchema: n,
      it: o
    } = e;
    if (void 0 === n.then && void 0 === n.else) {
      i.checkStrictMode(o, '"if" without "then" and "else" is ignored');
    }
    const a = s(o, "then");
    const c = s(o, "else");
    if (!a && !c) return;
    const l = t.let("valid", !0);
    const u = t.name("_valid");
    (function () {
      const t = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(t);
    })();
    e.reset();
    if (a && c) {
      const n = t.let("ifClause");
      e.setParams({
        ifClause: n
      }), t.if(u, p("then", n), p("else", n));
    } else a ? t.if(u, p("then")) : t.if((0, r.not)(u), p("else"));
    function p(n, i) {
      return () => {
        const o = e.subschema({
          keyword: n
        }, u);
        t.assign(l, u);
        e.mergeValidEvaluated(o, l);
        if (i) {
          t.assign(i, r._`${n}`);
        } else {
          e.setParams({
            ifClause: n
          });
        }
      };
    }
    e.pass(l, () => e.error(!0));
  }
};
function s(e, t) {
  const n = e.schema[t];
  return void 0 !== n && !i.alwaysValidSchema(e, n);
}
exports.default = o;