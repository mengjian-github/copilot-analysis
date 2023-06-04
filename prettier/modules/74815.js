Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
const r = require(55667);
const i = require(50453);
const o = require(58876);
const s = require(50453);
const a = require(90313);
const c = require(95005);
const l = require(13099);
const u = require(93487);
const p = require(22141);
const d = require(32531);
const h = require(76776);
const f = require(4181);
function m({
  gen: e,
  validateName: t,
  schema: n,
  schemaEnv: r,
  opts: i
}, o) {
  if (i.code.es5) {
    e.func(t, u._`${p.default.data}, ${p.default.valCxt}`, r.$async, () => {
      e.code(u._`"use strict"; ${g(n, i)}`);
      (function (e, t) {
        e.if(p.default.valCxt, () => {
          e.var(p.default.instancePath, u._`${p.default.valCxt}.${p.default.instancePath}`);
          e.var(p.default.parentData, u._`${p.default.valCxt}.${p.default.parentData}`);
          e.var(p.default.parentDataProperty, u._`${p.default.valCxt}.${p.default.parentDataProperty}`);
          e.var(p.default.rootData, u._`${p.default.valCxt}.${p.default.rootData}`);
          if (t.dynamicRef) {
            e.var(p.default.dynamicAnchors, u._`${p.default.valCxt}.${p.default.dynamicAnchors}`);
          }
        }, () => {
          e.var(p.default.instancePath, u._`""`);
          e.var(p.default.parentData, u._`undefined`);
          e.var(p.default.parentDataProperty, u._`undefined`);
          e.var(p.default.rootData, p.default.data);
          if (t.dynamicRef) {
            e.var(p.default.dynamicAnchors, u._`{}`);
          }
        });
      })(e, i);
      e.code(o);
    });
  } else {
    e.func(t, u._`${p.default.data}, ${function (e) {
      return u._`{${p.default.instancePath}="", ${p.default.parentData}, ${p.default.parentDataProperty}, ${p.default.rootData}=${p.default.data}${e.dynamicRef ? u._`, ${p.default.dynamicAnchors}={}` : u.nil}}={}`;
    }(i)}`, r.$async, () => e.code(g(n, i)).code(o));
  }
}
function g(e, t) {
  const n = "object" == typeof e && e[t.schemaId];
  return n && (t.code.source || t.code.process) ? u._`/*# sourceURL=${n} */` : u.nil;
}
function y({
  schema: e,
  self: t
}) {
  if ("boolean" == typeof e) return !e;
  for (const n in e) if (t.RULES.all[n]) return !0;
  return !1;
}
function _(e) {
  return "boolean" != typeof e.schema;
}
function v(e) {
  h.checkUnknownRules(e);
  (function (e) {
    const {
      schema: t,
      errSchemaPath: n,
      opts: r,
      self: i
    } = e;
    if (t.$ref && r.ignoreKeywordsWithRef && h.schemaHasRulesButRef(t, i.RULES)) {
      i.logger.warn(`$ref: keywords ignored in schema at path "${n}"`);
    }
  })(e);
}
function b(e, t) {
  if (e.opts.jtd) return w(e, [], !1, t);
  const n = i.getSchemaTypes(e.schema);
  w(e, n, !i.coerceAndCheckDataType(e, n), t);
}
function E({
  gen: e,
  schemaEnv: t,
  schema: n,
  errSchemaPath: r,
  opts: i
}) {
  const o = n.$comment;
  if (!0 === i.$comment) e.code(u._`${p.default.self}.logger.log(${o})`);else if ("function" == typeof i.$comment) {
    const n = u.str`${r}/$comment`;
    const i = e.scopeValue("root", {
      ref: t.root
    });
    e.code(u._`${p.default.self}.opts.$comment(${o}, ${n}, ${i}.schema)`);
  }
}
function w(e, t, n, r) {
  const {
    gen: i,
    schema: a,
    data: c,
    allErrors: l,
    opts: d,
    self: f
  } = e;
  const {
    RULES: m
  } = f;
  function g(h) {
    if (o.shouldUseGroup(a, h)) {
      if (h.type) {
        i.if(s.checkDataType(h.type, c, d.strictNumbers));
        T(e, h);
        if (1 === t.length && t[0] === h.type && n) {
          i.else();
          s.reportTypeError(e);
        }
        i.endIf();
      } else {
        T(e, h);
      }
      if (l) {
        i.if(u._`${p.default.errors} === ${r || 0}`);
      }
    }
  }
  if (!a.$ref || !d.ignoreKeywordsWithRef && h.schemaHasRulesButRef(a, m)) {
    if (d.jtd) {
      (function (e, t) {
        if (!e.schemaEnv.meta && e.opts.strictTypes) {
          (function (e, t) {
            if (t.length) {
              if (e.dataTypes.length) {
                t.forEach(t => {
                  if (S(e.dataTypes, t)) {
                    x(e, `type "${t}" not allowed by context "${e.dataTypes.join(",")}"`);
                  }
                });
                e.dataTypes = e.dataTypes.filter(e => S(t, e));
              } else {
                e.dataTypes = t;
              }
            }
          })(e, t);
          if (e.opts.allowUnionTypes) {
            (function (e, t) {
              if (t.length > 1 && (2 !== t.length || !t.includes("null"))) {
                x(e, "use allowUnionTypes to allow union type keyword");
              }
            })(e, t);
          }
          (function (e, t) {
            const n = e.self.RULES.all;
            for (const r in n) {
              const i = n[r];
              if ("object" == typeof i && o.shouldUseRule(e.schema, i)) {
                const {
                  type: n
                } = i.definition;
                if (n.length && !n.some(e => {
                  r = e;
                  return (n = t).includes(r) || "number" === r && n.includes("integer");
                  var n;
                  var r;
                })) {
                  x(e, `missing type "${n.join(",")}" for keyword "${r}"`);
                }
              }
            }
          })(e, e.dataTypes);
        }
      })(e, t);
    }
    i.block(() => {
      for (const e of m.rules) g(e);
      g(m.post);
    });
  } else {
    i.block(() => I(e, "$ref", m.all.$ref.definition));
  }
}
function T(e, t) {
  const {
    gen: n,
    schema: r,
    opts: {
      useDefaults: i
    }
  } = e;
  if (i) {
    a.assignDefaults(e, t.type);
  }
  n.block(() => {
    for (const n of t.rules) if (o.shouldUseRule(r, n)) {
      I(e, n.keyword, n.definition, t.type);
    }
  });
}
function S(e, t) {
  return e.includes(t) || "integer" === t && e.includes("number");
}
function x(e, t) {
  t += ` at "${e.schemaEnv.baseId + e.errSchemaPath}" (strictTypes)`;
  h.checkStrictMode(e, t, e.opts.strictTypes);
}
exports.validateFunctionCode = function (e) {
  if (_(e) && (v(e), y(e))) {
    (function (e) {
      const {
        schema: t,
        opts: n,
        gen: r
      } = e;
      m(e, () => {
        if (n.$comment && t.$comment) {
          E(e);
        }
        (function (e) {
          const {
            schema: t,
            opts: n
          } = e;
          if (void 0 !== t.default && n.useDefaults && n.strictSchema) {
            h.checkStrictMode(e, "default is ignored in the schema root");
          }
        })(e);
        r.let(p.default.vErrors, null);
        r.let(p.default.errors, 0);
        if (n.unevaluated) {
          (function (e) {
            const {
              gen: t,
              validateName: n
            } = e;
            e.evaluated = t.const("evaluated", u._`${n}.evaluated`);
            t.if(u._`${e.evaluated}.dynamicProps`, () => t.assign(u._`${e.evaluated}.props`, u._`undefined`));
            t.if(u._`${e.evaluated}.dynamicItems`, () => t.assign(u._`${e.evaluated}.items`, u._`undefined`));
          })(e);
        }
        b(e);
        (function (e) {
          const {
            gen: t,
            schemaEnv: n,
            validateName: r,
            ValidationError: i,
            opts: o
          } = e;
          if (n.$async) {
            t.if(u._`${p.default.errors} === 0`, () => t.return(p.default.data), () => t.throw(u._`new ${i}(${p.default.vErrors})`));
          } else {
            t.assign(u._`${r}.errors`, p.default.vErrors);
            if (o.unevaluated) {
              (function ({
                gen: e,
                evaluated: t,
                props: n,
                items: r
              }) {
                if (n instanceof u.Name) {
                  e.assign(u._`${t}.props`, n);
                }
                if (r instanceof u.Name) {
                  e.assign(u._`${t}.items`, r);
                }
              })(e);
            }
            t.return(u._`${p.default.errors} === 0`);
          }
        })(e);
      });
    })(e);
  } else {
    m(e, () => r.topBoolOrEmptySchema(e));
  }
};
class KeywordCxt {
  constructor(e, t, n) {
    c.validateKeywordUsage(e, t, n);
    this.gen = e.gen;
    this.allErrors = e.allErrors;
    this.keyword = n;
    this.data = e.data;
    this.schema = e.schema[n];
    this.$data = t.$data && e.opts.$data && this.schema && this.schema.$data;
    this.schemaValue = h.schemaRefOrVal(e, this.schema, n, this.$data);
    this.schemaType = t.schemaType;
    this.parentSchema = e.schema;
    this.params = {};
    this.it = e;
    this.def = t;
    if (this.$data) this.schemaCode = e.gen.const("vSchema", getData(this.$data, e));else if (this.schemaCode = this.schemaValue, !(0, c.validSchemaType)(this.schema, t.schemaType, t.allowUndefined)) throw new Error(`${n} value must be ${JSON.stringify(t.schemaType)}`);
    if ("code" in t ? t.trackErrors : !1 !== t.errors) {
      this.errsCount = e.gen.const("_errs", p.default.errors);
    }
  }
  result(e, t, n) {
    this.failResult(u.not(e), t, n);
  }
  failResult(e, t, n) {
    this.gen.if(e);
    if (n) {
      n();
    } else {
      this.error();
    }
    if (t) {
      this.gen.else();
      t();
      if (this.allErrors) {
        this.gen.endIf();
      }
    } else {
      if (this.allErrors) {
        this.gen.endIf();
      } else {
        this.gen.else();
      }
    }
  }
  pass(e, t) {
    this.failResult(u.not(e), void 0, t);
  }
  fail(e) {
    if (void 0 === e) {
      this.error();
      return void (this.allErrors || this.gen.if(!1));
    }
    this.gen.if(e);
    this.error();
    if (this.allErrors) {
      this.gen.endIf();
    } else {
      this.gen.else();
    }
  }
  fail$data(e) {
    if (!this.$data) return this.fail(e);
    const {
      schemaCode: t
    } = this;
    this.fail(u._`${t} !== undefined && (${u.or(this.invalid$data(), e)})`);
  }
  error(e, t, n) {
    if (t) {
      this.setParams(t);
      this._error(e, n);
      return void this.setParams({});
    }
    this._error(e, n);
  }
  _error(e, t) {
    (e ? f.reportExtraError : f.reportError)(this, this.def.error, t);
  }
  $dataError() {
    f.reportError(this, this.def.$dataError || f.keyword$DataError);
  }
  reset() {
    if (void 0 === this.errsCount) throw new Error('add "trackErrors" to keyword definition');
    f.resetErrorsCount(this.gen, this.errsCount);
  }
  ok(e) {
    if (this.allErrors) {
      this.gen.if(e);
    }
  }
  setParams(e, t) {
    if (t) {
      Object.assign(this.params, e);
    } else {
      this.params = e;
    }
  }
  block$data(e, t, n = u.nil) {
    this.gen.block(() => {
      this.check$data(e, n);
      t();
    });
  }
  check$data(e = u.nil, t = u.nil) {
    if (!this.$data) return;
    const {
      gen: n,
      schemaCode: r,
      schemaType: i,
      def: o
    } = this;
    n.if(u.or(u._`${r} === undefined`, t));
    if (e !== u.nil) {
      n.assign(e, !0);
    }
    if (i.length || o.validateSchema) {
      n.elseIf(this.invalid$data());
      this.$dataError();
      if (e !== u.nil) {
        n.assign(e, !1);
      }
    }
    n.else();
  }
  invalid$data() {
    const {
      gen: e,
      schemaCode: t,
      schemaType: n,
      def: r,
      it: i
    } = this;
    return u.or(function () {
      if (n.length) {
        if (!(t instanceof u.Name)) throw new Error("ajv implementation error");
        const e = Array.isArray(n) ? n : [n];
        return u._`${s.checkDataTypes(e, t, i.opts.strictNumbers, s.DataType.Wrong)}`;
      }
      return u.nil;
    }(), function () {
      if (r.validateSchema) {
        const n = e.scopeValue("validate$data", {
          ref: r.validateSchema
        });
        return u._`!${n}(${t})`;
      }
      return u.nil;
    }());
  }
  subschema(e, t) {
    const n = l.getSubschema(this.it, e);
    l.extendSubschemaData(n, this.it, e);
    l.extendSubschemaMode(n, e);
    const i = {
      ...this.it,
      ...n,
      items: void 0,
      props: void 0
    };
    (function (e, t) {
      if (_(e) && (v(e), y(e))) {
        (function (e, t) {
          const {
            schema: n,
            gen: r,
            opts: i
          } = e;
          if (i.$comment && n.$comment) {
            E(e);
          }
          (function (e) {
            const t = e.schema[e.opts.schemaId];
            if (t) {
              e.baseId = d.resolveUrl(e.opts.uriResolver, e.baseId, t);
            }
          })(e);
          (function (e) {
            if (e.schema.$async && !e.schemaEnv.$async) throw new Error("async schema in sync schema");
          })(e);
          const o = r.const("_errs", p.default.errors);
          b(e, o);
          r.var(t, u._`${o} === ${p.default.errors}`);
        })(e, t);
      } else {
        r.boolOrEmptySchema(e, t);
      }
    })(i, t);
    return i;
  }
  mergeEvaluated(e, t) {
    const {
      it: n,
      gen: r
    } = this;
    if (n.opts.unevaluated) {
      if (!0 !== n.props && void 0 !== e.props) {
        n.props = h.mergeEvaluated.props(r, e.props, n.props, t);
      }
      if (!0 !== n.items && void 0 !== e.items) {
        n.items = h.mergeEvaluated.items(r, e.items, n.items, t);
      }
    }
  }
  mergeValidEvaluated(e, t) {
    const {
      it: n,
      gen: r
    } = this;
    if (n.opts.unevaluated && (!0 !== n.props || !0 !== n.items)) {
      r.if(t, () => this.mergeEvaluated(e, u.Name));
      return !0;
    }
  }
}
function I(e, t, n, r) {
  const i = new KeywordCxt(e, n, t);
  if ("code" in n) {
    n.code(i, r);
  } else {
    if (i.$data && n.validate) {
      c.funcKeywordCode(i, n);
    } else {
      if ("macro" in n) {
        c.macroKeywordCode(i, n);
      } else {
        if (n.compile || n.validate) {
          c.funcKeywordCode(i, n);
        }
      }
    }
  }
}
exports.KeywordCxt = KeywordCxt;
const A = /^\/(?:[^~]|~0|~1)*$/;
const k = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function getData(e, {
  dataLevel: t,
  dataNames: n,
  dataPathArr: r
}) {
  let i;
  let o;
  if ("" === e) return p.default.rootData;
  if ("/" === e[0]) {
    if (!A.test(e)) throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e;
    o = p.default.rootData;
  } else {
    const s = k.exec(e);
    if (!s) throw new Error(`Invalid JSON-pointer: ${e}`);
    const a = +s[1];
    i = s[2];
    if ("#" === i) {
      if (a >= t) throw new Error(c("property/index", a));
      return r[t - a];
    }
    if (a > t) throw new Error(c("data", a));
    o = n[t - a];
    if (!i) return o;
  }
  let s = o;
  const a = i.split("/");
  for (const e of a) if (e) {
    o = u._`${o}${u.getProperty(h.unescapeJsonPointer(e))}`;
    s = u._`${s} && ${o}`;
  }
  return s;
  function c(e, n) {
    return `Cannot access ${e} ${n} levels up, current level is ${t}`;
  }
}
exports.getData = getData;