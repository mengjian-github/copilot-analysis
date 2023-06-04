Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
const r = require(93487);
const i = require(67426);
const o = require(22141);
const s = require(32531);
const a = require(76776);
const c = require(74815);
class SchemaEnv {
  constructor(e) {
    var t;
    let n;
    this.refs = {};
    this.dynamicAnchors = {};
    if ("object" == typeof e.schema) {
      n = e.schema;
    }
    this.schema = e.schema;
    this.schemaId = e.schemaId;
    this.root = e.root || this;
    this.baseId = null !== (t = e.baseId) && void 0 !== t ? t : s.normalizeId(null == n ? void 0 : n[e.schemaId || "$id"]);
    this.schemaPath = e.schemaPath;
    this.localRefs = e.localRefs;
    this.meta = e.meta;
    this.$async = null == n ? void 0 : n.$async;
    this.refs = {};
  }
}
function compileSchema(e) {
  const t = getCompilingSchema.call(this, e);
  if (t) return t;
  const n = s.getFullPath(this.opts.uriResolver, e.root.baseId);
  const {
    es5: a,
    lines: l
  } = this.opts.code;
  const {
    ownProperties: u
  } = this.opts;
  const p = new r.CodeGen(this.scope, {
    es5: a,
    lines: l,
    ownProperties: u
  });
  let h;
  if (e.$async) {
    h = p.scopeValue("Error", {
      ref: i.default,
      code: r._`require("ajv/dist/runtime/validation_error").default`
    });
  }
  const f = p.scopeName("validate");
  e.validateName = f;
  const m = {
    gen: p,
    allErrors: this.opts.allErrors,
    data: o.default.data,
    parentData: o.default.parentData,
    parentDataProperty: o.default.parentDataProperty,
    dataNames: [o.default.data],
    dataPathArr: [r.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: new Set(),
    topSchemaRef: p.scopeValue("schema", !0 === this.opts.code.source ? {
      ref: e.schema,
      code: r.stringify(e.schema)
    } : {
      ref: e.schema
    }),
    validateName: f,
    ValidationError: h,
    schema: e.schema,
    schemaEnv: e,
    rootId: n,
    baseId: e.baseId || n,
    schemaPath: r.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: r._`""`,
    opts: this.opts,
    self: this
  };
  let g;
  try {
    this._compilations.add(e);
    c.validateFunctionCode(m);
    p.optimize(this.opts.code.optimize);
    const t = p.toString();
    g = `${p.scopeRefs(o.default.scope)}return ${t}`;
    if (this.opts.code.process) {
      g = this.opts.code.process(g, e);
    }
    const n = new Function(`${o.default.self}`, `${o.default.scope}`, g)(this, this.scope.get());
    this.scope.value(f, {
      ref: n
    });
    n.errors = null;
    n.schema = e.schema;
    n.schemaEnv = e;
    if (e.$async) {
      n.$async = !0;
    }
    if (!0 === this.opts.code.source) {
      n.source = {
        validateName: f,
        validateCode: t,
        scopeValues: p._values
      };
    }
    if (this.opts.unevaluated) {
      const {
        props: e,
        items: t
      } = m;
      n.evaluated = {
        props: e instanceof r.Name ? void 0 : e,
        items: t instanceof r.Name ? void 0 : t,
        dynamicProps: e instanceof r.Name,
        dynamicItems: t instanceof r.Name
      }, n.source && (n.source.evaluated = (0, r.stringify)(n.evaluated));
    }
    e.validate = n;
    return e;
  } catch (t) {
    throw delete e.validate, delete e.validateName, g && this.logger.error("Error compiling schema, function code:", g), t;
  } finally {
    this._compilations.delete(e);
  }
}
function p(e) {
  return s.inlineRef(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : compileSchema.call(this, e);
}
function getCompilingSchema(e) {
  for (const r of this._compilations) {
    n = e;
    if ((t = r).schema === n.schema && t.root === n.root && t.baseId === n.baseId) return r;
  }
  var t;
  var n;
}
function h(e, t) {
  let n;
  for (; "string" == typeof (n = this.refs[t]);) t = n;
  return n || this.schemas[t] || resolveSchema.call(this, e, t);
}
function resolveSchema(e, t) {
  const n = this.opts.uriResolver.parse(t);
  const r = s._getFullPath(this.opts.uriResolver, n);
  let i = s.getFullPath(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && r === i) return g.call(this, n, e);
  const o = s.normalizeId(r);
  const a = this.refs[o] || this.schemas[o];
  if ("string" == typeof a) {
    const t = resolveSchema.call(this, e, a);
    if ("object" != typeof (null == t ? void 0 : t.schema)) return;
    return g.call(this, n, t);
  }
  if ("object" == typeof (null == a ? void 0 : a.schema)) {
    if (a.validate) {
      compileSchema.call(this, a);
    }
    if (o === (0, s.normalizeId)(t)) {
      const {
          schema: t
        } = a,
        {
          schemaId: n
        } = this.opts,
        r = t[n];
      return r && (i = (0, s.resolveUrl)(this.opts.uriResolver, i, r)), new SchemaEnv({
        schema: t,
        schemaId: n,
        root: e,
        baseId: i
      });
    }
    return g.call(this, n, a);
  }
}
exports.SchemaEnv = SchemaEnv;
exports.compileSchema = compileSchema;
exports.resolveRef = function (e, t, n) {
  var r;
  n = s.resolveUrl(this.opts.uriResolver, t, n);
  const i = e.refs[n];
  if (i) return i;
  let o = h.call(this, e, n);
  if (void 0 === o) {
    const i = null === (r = e.localRefs) || void 0 === r ? void 0 : r[n];
    const {
      schemaId: s
    } = this.opts;
    if (i) {
      o = new SchemaEnv({
        schema: i,
        schemaId: s,
        root: e,
        baseId: t
      });
    }
  }
  return void 0 !== o ? e.refs[n] = p.call(this, o) : void 0;
};
exports.getCompilingSchema = getCompilingSchema;
exports.resolveSchema = resolveSchema;
const m = new Set(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
function g(e, {
  baseId: t,
  schema: n,
  root: r
}) {
  var i;
  if ("/" !== (null === (i = e.fragment) || void 0 === i ? void 0 : i[0])) return;
  for (const r of e.fragment.slice(1).split("/")) {
    if ("boolean" == typeof n) return;
    const e = n[a.unescapeFragment(r)];
    if (void 0 === e) return;
    const i = "object" == typeof (n = e) && n[this.opts.schemaId];
    if (!m.has(r) && i) {
      t = s.resolveUrl(this.opts.uriResolver, t, i);
    }
  }
  let o;
  if ("boolean" != typeof n && n.$ref && !a.schemaHasRulesButRef(n, this.RULES)) {
    const e = s.resolveUrl(this.opts.uriResolver, t, n.$ref);
    o = resolveSchema.call(this, r, e);
  }
  const {
    schemaId: c
  } = this.opts;
  o = o || new SchemaEnv({
    schema: n,
    schemaId: c,
    root: r,
    baseId: t
  });
  return o.schema !== o.root.schema ? o : void 0;
}