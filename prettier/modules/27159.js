Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
var r = require(74815);
Object.defineProperty(exports, "KeywordCxt", {
  enumerable: !0,
  get: function () {
    return r.KeywordCxt;
  }
});
var i = require(93487);
Object.defineProperty(exports, "_", {
  enumerable: !0,
  get: function () {
    return i._;
  }
});
Object.defineProperty(exports, "str", {
  enumerable: !0,
  get: function () {
    return i.str;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: !0,
  get: function () {
    return i.stringify;
  }
});
Object.defineProperty(exports, "nil", {
  enumerable: !0,
  get: function () {
    return i.nil;
  }
});
Object.defineProperty(exports, "Name", {
  enumerable: !0,
  get: function () {
    return i.Name;
  }
});
Object.defineProperty(exports, "CodeGen", {
  enumerable: !0,
  get: function () {
    return i.CodeGen;
  }
});
const o = require(67426);
const s = require(6646);
const a = require(13141);
const c = require(25173);
const l = require(93487);
const u = require(32531);
const p = require(50453);
const d = require(76776);
const h = require(64775);
const f = require(43589);
const m = (e, t) => new RegExp(e, t);
m.code = "new RegExp";
const g = ["removeAdditional", "useDefaults", "coerceTypes"];
const y = new Set(["validate", "serialize", "parse", "wrapper", "root", "schema", "keyword", "pattern", "formats", "validate$data", "func", "obj", "Error"]);
const _ = {
  errorDataPath: "",
  format: "`validateFormats: false` can be used instead.",
  nullable: '"nullable" keyword is supported by default.',
  jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
  extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
  missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
  processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
  sourceCode: "Use option `code: {source: true}`",
  strictDefaults: "It is default now, see option `strict`.",
  strictKeywords: "It is default now, see option `strict`.",
  uniqueItems: '"uniqueItems" keyword is always validated.',
  unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
  cache: "Map is used as cache, schema object as key.",
  serialize: "Map is used as cache, schema object as key.",
  ajvErrors: "It is default now."
};
const v = {
  ignoreKeywordsWithRef: "",
  jsPropertySyntax: "",
  unicode: '"minLength"/"maxLength" account for unicode characters by default.'
};
function b(e) {
  var t;
  var n;
  var r;
  var i;
  var o;
  var s;
  var a;
  var c;
  var l;
  var u;
  var p;
  var d;
  var h;
  var g;
  var y;
  var _;
  var v;
  var b;
  var E;
  var w;
  var T;
  var S;
  var x;
  var C;
  var I;
  const A = e.strict;
  const k = null === (t = e.code) || void 0 === t ? void 0 : t.optimize;
  const P = !0 === k || void 0 === k ? 1 : k || 0;
  const N = null !== (r = null === (n = e.code) || void 0 === n ? void 0 : n.regExp) && void 0 !== r ? r : m;
  const O = null !== (i = e.uriResolver) && void 0 !== i ? i : f.default;
  return {
    strictSchema: null === (s = null !== (o = e.strictSchema) && void 0 !== o ? o : A) || void 0 === s || s,
    strictNumbers: null === (c = null !== (a = e.strictNumbers) && void 0 !== a ? a : A) || void 0 === c || c,
    strictTypes: null !== (u = null !== (l = e.strictTypes) && void 0 !== l ? l : A) && void 0 !== u ? u : "log",
    strictTuples: null !== (d = null !== (p = e.strictTuples) && void 0 !== p ? p : A) && void 0 !== d ? d : "log",
    strictRequired: null !== (g = null !== (h = e.strictRequired) && void 0 !== h ? h : A) && void 0 !== g && g,
    code: e.code ? {
      ...e.code,
      optimize: P,
      regExp: N
    } : {
      optimize: P,
      regExp: N
    },
    loopRequired: null !== (y = e.loopRequired) && void 0 !== y ? y : 200,
    loopEnum: null !== (_ = e.loopEnum) && void 0 !== _ ? _ : 200,
    meta: null === (v = e.meta) || void 0 === v || v,
    messages: null === (b = e.messages) || void 0 === b || b,
    inlineRefs: null === (E = e.inlineRefs) || void 0 === E || E,
    schemaId: null !== (w = e.schemaId) && void 0 !== w ? w : "$id",
    addUsedSchema: null === (T = e.addUsedSchema) || void 0 === T || T,
    validateSchema: null === (S = e.validateSchema) || void 0 === S || S,
    validateFormats: null === (x = e.validateFormats) || void 0 === x || x,
    unicodeRegExp: null === (C = e.unicodeRegExp) || void 0 === C || C,
    int32range: null === (I = e.int32range) || void 0 === I || I,
    uriResolver: O
  };
}
class E {
  constructor(e = {}) {
    this.schemas = {};
    this.refs = {};
    this.formats = {};
    this._compilations = new Set();
    this._loading = {};
    this._cache = new Map();
    e = this.opts = {
      ...e,
      ...b(e)
    };
    const {
      es5: t,
      lines: n
    } = this.opts.code;
    this.scope = new l.ValueScope({
      scope: {},
      prefixes: y,
      es5: t,
      lines: n
    });
    this.logger = function (e) {
      if (!1 === e) return A;
      if (void 0 === e) return console;
      if (e.log && e.warn && e.error) return e;
      throw new Error("logger must implement log, warn and error methods");
    }(e.logger);
    const r = e.validateFormats;
    e.validateFormats = !1;
    this.RULES = a.getRules();
    w.call(this, _, e, "NOT SUPPORTED");
    w.call(this, v, e, "DEPRECATED", "warn");
    this._metaOpts = I.call(this);
    if (e.formats) {
      x.call(this);
    }
    this._addVocabularies();
    this._addDefaultMetaSchema();
    if (e.keywords) {
      C.call(this, e.keywords);
    }
    if ("object" == typeof e.meta) {
      this.addMetaSchema(e.meta);
    }
    S.call(this);
    e.validateFormats = r;
  }
  _addVocabularies() {
    this.addKeyword("$async");
  }
  _addDefaultMetaSchema() {
    const {
      $data: e,
      meta: t,
      schemaId: n
    } = this.opts;
    let r = h;
    if ("id" === n) {
      r = {
        ...h
      };
      r.id = r.$id;
      delete r.$id;
    }
    if (t && e) {
      this.addMetaSchema(r, r[n], !1);
    }
  }
  defaultMeta() {
    const {
      meta: e,
      schemaId: t
    } = this.opts;
    return this.opts.defaultMeta = "object" == typeof e ? e[t] || e : void 0;
  }
  validate(e, t) {
    let n;
    if ("string" == typeof e) {
      n = this.getSchema(e);
      if (!n) throw new Error(`no schema with key or ref "${e}"`);
    } else n = this.compile(e);
    const r = n(t);
    if ("$async" in n) {
      this.errors = n.errors;
    }
    return r;
  }
  compile(e, t) {
    const n = this._addSchema(e, t);
    return n.validate || this._compileSchemaEnv(n);
  }
  compileAsync(e, t) {
    if ("function" != typeof this.opts.loadSchema) throw new Error("options.loadSchema should be a function");
    const {
      loadSchema: n
    } = this.opts;
    return r.call(this, e, t);
    async function r(e, t) {
      await i.call(this, e.$schema);
      const n = this._addSchema(e, t);
      return n.validate || o.call(this, n);
    }
    async function i(e) {
      if (e && !this.getSchema(e)) {
        await r.call(this, {
          $ref: e
        }, !0);
      }
    }
    async function o(e) {
      try {
        return this._compileSchemaEnv(e);
      } catch (t) {
        if (!(t instanceof s.default)) throw t;
        a.call(this, t);
        await c.call(this, t.missingSchema);
        return o.call(this, e);
      }
    }
    function a({
      missingSchema: e,
      missingRef: t
    }) {
      if (this.refs[e]) throw new Error(`AnySchema ${e} is loaded but ${t} cannot be resolved`);
    }
    async function c(e) {
      const n = await l.call(this, e);
      if (this.refs[e]) {
        await i.call(this, n.$schema);
      }
      if (this.refs[e]) {
        this.addSchema(n, e, t);
      }
    }
    async function l(e) {
      const t = this._loading[e];
      if (t) return t;
      try {
        return await (this._loading[e] = n(e));
      } finally {
        delete this._loading[e];
      }
    }
  }
  addSchema(e, t, n, r = this.opts.validateSchema) {
    if (Array.isArray(e)) {
      for (const t of e) this.addSchema(t, void 0, n, r);
      return this;
    }
    let i;
    if ("object" == typeof e) {
      const {
        schemaId: t
      } = this.opts;
      i = e[t];
      if (void 0 !== i && "string" != typeof i) throw new Error(`schema ${t} must be string`);
    }
    t = u.normalizeId(t || i);
    this._checkUnique(t);
    this.schemas[t] = this._addSchema(e, n, t, r, !0);
    return this;
  }
  addMetaSchema(e, t, n = this.opts.validateSchema) {
    this.addSchema(e, t, !0, n);
    return this;
  }
  validateSchema(e, t) {
    if ("boolean" == typeof e) return !0;
    let n;
    n = e.$schema;
    if (void 0 !== n && "string" != typeof n) throw new Error("$schema must be a string");
    n = n || this.opts.defaultMeta || this.defaultMeta();
    if (!n) return this.logger.warn("meta-schema not available"), this.errors = null, !0;
    const r = this.validate(n, e);
    if (!r && t) {
      const e = "schema is invalid: " + this.errorsText();
      if ("log" !== this.opts.validateSchema) throw new Error(e);
      this.logger.error(e);
    }
    return r;
  }
  getSchema(e) {
    let t;
    for (; "string" == typeof (t = T.call(this, e));) e = t;
    if (void 0 === t) {
      const {
        schemaId: n
      } = this.opts;
      const r = new c.SchemaEnv({
        schema: {},
        schemaId: n
      });
      t = c.resolveSchema.call(this, r, e);
      if (!t) return;
      this.refs[e] = t;
    }
    return t.validate || this._compileSchemaEnv(t);
  }
  removeSchema(e) {
    if (e instanceof RegExp) {
      this._removeAllSchemas(this.schemas, e);
      this._removeAllSchemas(this.refs, e);
      return this;
    }
    switch (typeof e) {
      case "undefined":
        this._removeAllSchemas(this.schemas);
        this._removeAllSchemas(this.refs);
        this._cache.clear();
        return this;
      case "string":
        {
          const t = T.call(this, e);
          if ("object" == typeof t) {
            this._cache.delete(t.schema);
          }
          delete this.schemas[e];
          delete this.refs[e];
          return this;
        }
      case "object":
        {
          const t = e;
          this._cache.delete(t);
          let n = e[this.opts.schemaId];
          if (n) {
            n = u.normalizeId(n);
            delete this.schemas[n];
            delete this.refs[n];
          }
          return this;
        }
      default:
        throw new Error("ajv.removeSchema: invalid parameter");
    }
  }
  addVocabulary(e) {
    for (const t of e) this.addKeyword(t);
    return this;
  }
  addKeyword(e, t) {
    let n;
    if ("string" == typeof e) {
      n = e;
      if ("object" == typeof t) {
        this.logger.warn("these parameters are deprecated, see docs for addKeyword");
        t.keyword = n;
      }
    } else {
      if ("object" != typeof e || void 0 !== t) throw new Error("invalid addKeywords parameters");
      n = (t = e).keyword;
      if (Array.isArray(n) && !n.length) throw new Error("addKeywords: keyword must be string or non-empty array");
    }
    P.call(this, n, t);
    if (!t) return (0, d.eachItem)(n, e => N.call(this, e)), this;
    R.call(this, t);
    const r = {
      ...t,
      type: p.getJSONTypes(t.type),
      schemaType: p.getJSONTypes(t.schemaType)
    };
    d.eachItem(n, 0 === r.type.length ? e => N.call(this, e, r) : e => r.type.forEach(t => N.call(this, e, r, t)));
    return this;
  }
  getKeyword(e) {
    const t = this.RULES.all[e];
    return "object" == typeof t ? t.definition : !!t;
  }
  removeKeyword(e) {
    const {
      RULES: t
    } = this;
    delete t.keywords[e];
    delete t.all[e];
    for (const n of t.rules) {
      const t = n.rules.findIndex(t => t.keyword === e);
      if (t >= 0) {
        n.rules.splice(t, 1);
      }
    }
    return this;
  }
  addFormat(e, t) {
    if ("string" == typeof t) {
      t = new RegExp(t);
    }
    this.formats[e] = t;
    return this;
  }
  errorsText(e = this.errors, {
    separator: t = ", ",
    dataVar: n = "data"
  } = {}) {
    return e && 0 !== e.length ? e.map(e => `${n}${e.instancePath} ${e.message}`).reduce((e, n) => e + t + n) : "No errors";
  }
  $dataMetaSchema(e, t) {
    const n = this.RULES.all;
    e = JSON.parse(JSON.stringify(e));
    for (const r of t) {
      const t = r.split("/").slice(1);
      let i = e;
      for (const e of t) i = i[e];
      for (const e in n) {
        const t = n[e];
        if ("object" != typeof t) continue;
        const {
          $data: r
        } = t.definition;
        const o = i[e];
        if (r && o) {
          i[e] = L(o);
        }
      }
    }
    return e;
  }
  _removeAllSchemas(e, t) {
    for (const n in e) {
      const r = e[n];
      if (t && !t.test(n)) {
        if ("string" == typeof r) {
          delete e[n];
        } else {
          if (r && !r.meta) {
            this._cache.delete(r.schema);
            delete e[n];
          }
        }
      }
    }
  }
  _addSchema(e, t, n, r = this.opts.validateSchema, i = this.opts.addUsedSchema) {
    let o;
    const {
      schemaId: s
    } = this.opts;
    if ("object" == typeof e) o = e[s];else {
      if (this.opts.jtd) throw new Error("schema must be object");
      if ("boolean" != typeof e) throw new Error("schema must be object or boolean");
    }
    let a = this._cache.get(e);
    if (void 0 !== a) return a;
    n = u.normalizeId(o || n);
    const l = u.getSchemaRefs.call(this, e, n);
    a = new c.SchemaEnv({
      schema: e,
      schemaId: s,
      meta: t,
      baseId: n,
      localRefs: l
    });
    this._cache.set(a.schema, a);
    if (i && !n.startsWith("#")) {
      if (n) {
        this._checkUnique(n);
      }
      this.refs[n] = a;
    }
    if (r) {
      this.validateSchema(e, !0);
    }
    return a;
  }
  _checkUnique(e) {
    if (this.schemas[e] || this.refs[e]) throw new Error(`schema with key or id "${e}" already exists`);
  }
  _compileSchemaEnv(e) {
    if (e.meta) {
      this._compileMetaSchema(e);
    } else {
      c.compileSchema.call(this, e);
    }
    if (!e.validate) throw new Error("ajv implementation error");
    return e.validate;
  }
  _compileMetaSchema(e) {
    const t = this.opts;
    this.opts = this._metaOpts;
    try {
      c.compileSchema.call(this, e);
    } finally {
      this.opts = t;
    }
  }
}
function w(e, t, n, r = "error") {
  for (const i in e) {
    const o = i;
    if (o in t) {
      this.logger[r](`${n}: option ${i}. ${e[o]}`);
    }
  }
}
function T(e) {
  e = u.normalizeId(e);
  return this.schemas[e] || this.refs[e];
}
function S() {
  const e = this.opts.schemas;
  if (e) if (Array.isArray(e)) this.addSchema(e);else for (const t in e) this.addSchema(e[t], t);
}
function x() {
  for (const e in this.opts.formats) {
    const t = this.opts.formats[e];
    if (t) {
      this.addFormat(e, t);
    }
  }
}
function C(e) {
  if (Array.isArray(e)) this.addVocabulary(e);else {
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const t in e) {
      const n = e[t];
      if (n.keyword) {
        n.keyword = t;
      }
      this.addKeyword(n);
    }
  }
}
function I() {
  const e = {
    ...this.opts
  };
  for (const t of g) delete e[t];
  return e;
}
exports.default = E;
E.ValidationError = o.default;
E.MissingRefError = s.default;
const A = {
  log() {},
  warn() {},
  error() {}
};
const k = /^[a-z_$][a-z0-9_$:-]*$/i;
function P(e, t) {
  const {
    RULES: n
  } = this;
  d.eachItem(e, e => {
    if (n.keywords[e]) throw new Error(`Keyword ${e} is already defined`);
    if (!k.test(e)) throw new Error(`Keyword ${e} has invalid name`);
  });
  if (t && t.$data && !("code" in t) && !("validate" in t)) throw new Error('$data keyword must have "code" or "validate" function');
}
function N(e, t, n) {
  var r;
  const i = null == t ? void 0 : t.post;
  if (n && i) throw new Error('keyword with "post" flag cannot have "type"');
  const {
    RULES: o
  } = this;
  let s = i ? o.post : o.rules.find(({
    type: e
  }) => e === n);
  if (s) {
    s = {
      type: n,
      rules: []
    };
    o.rules.push(s);
  }
  o.keywords[e] = !0;
  if (!t) return;
  const a = {
    keyword: e,
    definition: {
      ...t,
      type: p.getJSONTypes(t.type),
      schemaType: p.getJSONTypes(t.schemaType)
    }
  };
  if (t.before) {
    O.call(this, s, a, t.before);
  } else {
    s.rules.push(a);
  }
  o.all[e] = a;
  if (null === (r = t.implements) || void 0 === r) {
    r.forEach(e => this.addKeyword(e));
  }
}
function O(e, t, n) {
  const r = e.rules.findIndex(e => e.keyword === n);
  if (r >= 0) {
    e.rules.splice(r, 0, t);
  } else {
    e.rules.push(t);
    this.logger.warn(`rule ${n} is not defined`);
  }
}
function R(e) {
  let {
    metaSchema: t
  } = e;
  if (void 0 !== t) {
    if (e.$data && this.opts.$data) {
      t = L(t);
    }
    e.validateSchema = this.compile(t, !0);
  }
}
const M = {
  $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
};
function L(e) {
  return {
    anyOf: [e, M]
  };
}