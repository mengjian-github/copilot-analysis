Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.callRef = exports.getValidate = void 0;
const r = require(6646);
const i = require(10412);
const o = require(93487);
const s = require(22141);
const a = require(25173);
const c = require(76776);
const l = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const {
      gen: t,
      schema: n,
      it: i
    } = e;
    const {
      baseId: s,
      schemaEnv: c,
      validateName: l,
      opts: d,
      self: h
    } = i;
    const {
      root: f
    } = c;
    if (("#" === n || "#/" === n) && s === f.baseId) return function () {
      if (c === f) return callRef(e, l, c, c.$async);
      const n = t.scopeValue("root", {
        ref: f
      });
      return callRef(e, o._`${n}.validate`, f, f.$async);
    }();
    const m = a.resolveRef.call(h, f, s, n);
    if (void 0 === m) throw new r.default(i.opts.uriResolver, s, n);
    return m instanceof a.SchemaEnv ? function (t) {
      const n = getValidate(e, t);
      callRef(e, n, t, t.$async);
    }(m) : function (r) {
      const i = t.scopeValue("schema", !0 === d.code.source ? {
        ref: r,
        code: o.stringify(r)
      } : {
        ref: r
      });
      const s = t.name("valid");
      const a = e.subschema({
        schema: r,
        dataTypes: [],
        schemaPath: o.nil,
        topSchemaRef: i,
        errSchemaPath: n
      }, s);
      e.mergeEvaluated(a);
      e.ok(s);
    }(m);
  }
};
function getValidate(e, t) {
  const {
    gen: n
  } = e;
  return t.validate ? n.scopeValue("validate", {
    ref: t.validate
  }) : o._`${n.scopeValue("wrapper", {
    ref: t
  })}.validate`;
}
function callRef(e, t, n, r) {
  const {
    gen: a,
    it: l
  } = e;
  const {
    allErrors: u,
    schemaEnv: p,
    opts: d
  } = l;
  const h = d.passContext ? s.default.this : o.nil;
  function f(e) {
    const t = o._`${e}.errors`;
    a.assign(s.default.vErrors, o._`${s.default.vErrors} === null ? ${t} : ${s.default.vErrors}.concat(${t})`);
    a.assign(s.default.errors, o._`${s.default.vErrors}.length`);
  }
  function m(e) {
    var t;
    if (!l.opts.unevaluated) return;
    const r = null === (t = null == n ? void 0 : n.validate) || void 0 === t ? void 0 : t.evaluated;
    if (!0 !== l.props) if (r && !r.dynamicProps) {
      if (void 0 !== r.props) {
        l.props = c.mergeEvaluated.props(a, r.props, l.props);
      }
    } else {
      const t = a.var("props", o._`${e}.evaluated.props`);
      l.props = c.mergeEvaluated.props(a, t, l.props, o.Name);
    }
    if (!0 !== l.items) if (r && !r.dynamicItems) {
      if (void 0 !== r.items) {
        l.items = c.mergeEvaluated.items(a, r.items, l.items);
      }
    } else {
      const t = a.var("items", o._`${e}.evaluated.items`);
      l.items = c.mergeEvaluated.items(a, t, l.items, o.Name);
    }
  }
  if (r) {
    (function () {
      if (!p.$async) throw new Error("async schema referenced by sync schema");
      const n = a.let("valid");
      a.try(() => {
        a.code(o._`await ${i.callValidateCode(e, t, h)}`);
        m(t);
        if (u) {
          a.assign(n, !0);
        }
      }, e => {
        a.if(o._`!(${e} instanceof ${l.ValidationError})`, () => a.throw(e));
        f(e);
        if (u) {
          a.assign(n, !1);
        }
      });
      e.ok(n);
    })();
  } else {
    e.result(i.callValidateCode(e, t, h), () => m(t), () => f(t));
  }
}
exports.getValidate = getValidate;
exports.callRef = callRef;
exports.default = l;