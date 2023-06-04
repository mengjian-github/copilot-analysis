Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
const r = require(76776);
const i = require(64063);
const o = require(49461);
const s = new Set(["type", "format", "pattern", "maxLength", "minLength", "maxProperties", "minProperties", "maxItems", "minItems", "maximum", "minimum", "uniqueItems", "multipleOf", "required", "enum", "const"]);
exports.inlineRef = function (e, t = !0) {
  return "boolean" == typeof e || (!0 === t ? !c(e) : !!t && l(e) <= t);
};
const a = new Set(["$ref", "$recursiveRef", "$recursiveAnchor", "$dynamicRef", "$dynamicAnchor"]);
function c(e) {
  for (const t in e) {
    if (a.has(t)) return !0;
    const n = e[t];
    if (Array.isArray(n) && n.some(c)) return !0;
    if ("object" == typeof n && c(n)) return !0;
  }
  return !1;
}
function l(e) {
  let t = 0;
  for (const n in e) {
    if ("$ref" === n) return 1 / 0;
    t++;
    if (!s.has(n) && ("object" == typeof e[n] && (0, r.eachItem)(e[n], e => t += l(e)), t === 1 / 0)) return 1 / 0;
  }
  return t;
}
function getFullPath(e, t = "", n) {
  if (!1 !== n) {
    t = normalizeId(t);
  }
  const r = e.parse(t);
  return _getFullPath(e, r);
}
function _getFullPath(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
exports.getFullPath = getFullPath;
exports._getFullPath = _getFullPath;
const d = /#\/?$/;
function normalizeId(e) {
  return e ? e.replace(d, "") : "";
}
exports.normalizeId = normalizeId;
exports.resolveUrl = function (e, t, n) {
  n = normalizeId(n);
  return e.resolve(t, n);
};
const f = /^[a-z_][-a-z0-9._]*$/i;
exports.getSchemaRefs = function (e, t) {
  if ("boolean" == typeof e) return {};
  const {
    schemaId: n,
    uriResolver: r
  } = this.opts;
  const s = normalizeId(e[n] || t);
  const a = {
    "": s
  };
  const c = getFullPath(r, s, !1);
  const l = {};
  const p = new Set();
  o(e, {
    allKeys: !0
  }, (e, t, r, i) => {
    if (void 0 === i) return;
    const o = c + t;
    let s = a[i];
    function u(t) {
      const n = this.opts.uriResolver.resolve;
      t = normalizeId(s ? n(s, t) : t);
      if (p.has(t)) throw m(t);
      p.add(t);
      let r = this.refs[t];
      if ("string" == typeof r) {
        r = this.refs[r];
      }
      if ("object" == typeof r) {
        d(e, r.schema, t);
      } else {
        if (t !== normalizeId(o)) {
          if ("#" === t[0]) {
            d(e, l[t], t);
            l[t] = e;
          } else {
            this.refs[t] = o;
          }
        }
      }
      return t;
    }
    function g(e) {
      if ("string" == typeof e) {
        if (!f.test(e)) throw new Error(`invalid anchor "${e}"`);
        u.call(this, `#${e}`);
      }
    }
    if ("string" == typeof e[n]) {
      s = u.call(this, e[n]);
    }
    g.call(this, e.$anchor);
    g.call(this, e.$dynamicAnchor);
    a[t] = s;
  });
  return l;
  function d(e, t, n) {
    if (void 0 !== t && !i(e, t)) throw m(n);
  }
  function m(e) {
    return new Error(`reference "${e}" resolves to more than one schema`);
  }
};