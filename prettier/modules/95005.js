Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
const r = require(93487);
const i = require(22141);
const o = require(10412);
const s = require(4181);
function a(e) {
  const {
    gen: t,
    data: n,
    it: i
  } = e;
  t.if(i.parentData, () => t.assign(n, r._`${i.parentData}[${i.parentDataProperty}]`));
}
function c(e, t, n) {
  if (void 0 === n) throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", "function" == typeof n ? {
    ref: n
  } : {
    ref: n,
    code: r.stringify(n)
  });
}
exports.macroKeywordCode = function (e, t) {
  const {
    gen: n,
    keyword: i,
    schema: o,
    parentSchema: s,
    it: a
  } = e;
  const l = t.macro.call(a.self, o, s, a);
  const u = c(n, i, l);
  if (!1 !== a.opts.validateSchema) {
    a.self.validateSchema(l, !0);
  }
  const p = n.name("valid");
  e.subschema({
    schema: l,
    schemaPath: r.nil,
    errSchemaPath: `${a.errSchemaPath}/${i}`,
    topSchemaRef: u,
    compositeRule: !0
  }, p);
  e.pass(p, () => e.error(!0));
};
exports.funcKeywordCode = function (e, t) {
  var n;
  const {
    gen: l,
    keyword: u,
    schema: p,
    parentSchema: d,
    $data: h,
    it: f
  } = e;
  !function ({
    schemaEnv: e
  }, t) {
    if (t.async && !e.$async) throw new Error("async keyword in sync schema");
  }(f, t);
  const m = !h && t.compile ? t.compile.call(f.self, p, d, f) : t.validate;
  const g = c(l, u, m);
  const y = l.let("valid");
  function _(n = t.async ? r._`await ` : r.nil) {
    const s = f.opts.passContext ? i.default.this : i.default.self;
    const a = !("compile" in t && !h || !1 === t.schema);
    l.assign(y, r._`${n}${o.callValidateCode(e, g, s, a)}`, t.modifying);
  }
  function v(e) {
    var n;
    l.if(r.not(null !== (n = t.valid) && void 0 !== n ? n : y), e);
  }
  e.block$data(y, function () {
    if (!1 === t.errors) {
      _();
      if (t.modifying) {
        a(e);
      }
      v(() => e.error());
    } else {
      const n = t.async ? function () {
        const e = l.let("ruleErrs", null);
        l.try(() => _(r._`await `), t => l.assign(y, !1).if(r._`${t} instanceof ${f.ValidationError}`, () => l.assign(e, r._`${t}.errors`), () => l.throw(t)));
        return e;
      }() : function () {
        const e = r._`${g}.errors`;
        l.assign(e, null);
        _(r.nil);
        return e;
      }();
      if (t.modifying) {
        a(e);
      }
      v(() => function (e, t) {
        const {
          gen: n
        } = e;
        n.if(r._`Array.isArray(${t})`, () => {
          n.assign(i.default.vErrors, r._`${i.default.vErrors} === null ? ${t} : ${i.default.vErrors}.concat(${t})`).assign(i.default.errors, r._`${i.default.vErrors}.length`);
          s.extendErrors(e);
        }, () => e.error());
      }(e, n));
    }
  });
  e.ok(null !== (n = t.valid) && void 0 !== n ? n : y);
};
exports.validSchemaType = function (e, t, n = !1) {
  return !t.length || t.some(t => "array" === t ? Array.isArray(e) : "object" === t ? e && "object" == typeof e && !Array.isArray(e) : typeof e == t || n && void 0 === e);
};
exports.validateKeywordUsage = function ({
  schema: e,
  opts: t,
  self: n,
  errSchemaPath: r
}, i, o) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(o) : i.keyword !== o) throw new Error("ajv implementation error");
  const s = i.dependencies;
  if (null == s ? void 0 : s.some(t => !Object.prototype.hasOwnProperty.call(e, t))) throw new Error(`parent schema must have dependencies of ${o}: ${s.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[o])) {
    const e = `keyword "${o}" value is invalid at path "${r}": ` + n.errorsText(i.validateSchema.errors);
    if ("log" !== t.validateSchema) throw new Error(e);
    n.logger.error(e);
  }
};