Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueCast = exports.ValueCastDereferenceError = exports.ValueCastUnknownTypeError = exports.ValueCastRecursiveTypeError = exports.ValueCastNeverTypeError = exports.ValueCastArrayUniqueItemsTypeError = exports.ValueCastReferenceTypeError = void 0;
const r = require(14350);
const i = require(8851);
const o = require(4291);
const s = require(95245);
class ValueCastReferenceTypeError extends Error {
  constructor(e) {
    super(`ValueCast: Cannot locate referenced schema with $id '${e.$ref}'`);
    this.schema = e;
  }
}
exports.ValueCastReferenceTypeError = ValueCastReferenceTypeError;
class ValueCastArrayUniqueItemsTypeError extends Error {
  constructor(e, t) {
    super("ValueCast: Array cast produced invalid data due to uniqueItems constraint");
    this.schema = e;
    this.value = t;
  }
}
exports.ValueCastArrayUniqueItemsTypeError = ValueCastArrayUniqueItemsTypeError;
class ValueCastNeverTypeError extends Error {
  constructor(e) {
    super("ValueCast: Never types cannot be cast");
    this.schema = e;
  }
}
exports.ValueCastNeverTypeError = ValueCastNeverTypeError;
class ValueCastRecursiveTypeError extends Error {
  constructor(e) {
    super("ValueCast.Recursive: Cannot cast recursive schemas");
    this.schema = e;
  }
}
exports.ValueCastRecursiveTypeError = ValueCastRecursiveTypeError;
class ValueCastUnknownTypeError extends Error {
  constructor(e) {
    super("ValueCast: Unknown type");
    this.schema = e;
  }
}
exports.ValueCastUnknownTypeError = ValueCastUnknownTypeError;
class ValueCastDereferenceError extends Error {
  constructor(e) {
    super(`ValueCast: Unable to dereference schema with $id '${e.$ref}'`);
    this.schema = e;
  }
}
var h;
var f;
exports.ValueCastDereferenceError = ValueCastDereferenceError;
(function (e) {
  function t(e, t, n) {
    if ("Object" === e[r.Kind] && "object" == typeof n && null !== n) {
      const i = e;
      const s = Object.keys(n);
      const a = globalThis.Object.entries(i.properties);
      const [c, l] = [1 / a.length, a.length];
      return a.reduce((e, [i, a]) => e + (("Literal" === a[r.Kind] && a.const === n[i] ? l : 0) + (o.ValueCheck.Check(a, t, n[i]) ? c : 0) + (s.includes(i) ? c : 0)), 0);
    }
    return o.ValueCheck.Check(e, t, n) ? 1 : 0;
  }
  e.Create = function (e, n, r) {
    if (void 0 !== e.default) return e.default;
    {
      const i = function (e, n, r) {
        let [i, o] = [e.anyOf[0], 0];
        for (const s of e.anyOf) {
          const e = t(s, n, r);
          if (e > o) {
            i = s;
            o = e;
          }
        }
        return i;
      }(e, n, r);
      return f.Cast(i, n, r);
    }
  };
})(h || (h = {}));
(function (e) {
  function t(e) {
    return "object" == typeof e && null !== e && !globalThis.Array.isArray(e);
  }
  function n(e) {
    return "number" == typeof e && !isNaN(e);
  }
  function a(e, u, f) {
    const m = function (e) {
      return "string" == typeof e;
    }(e.$id) ? [...u, e] : u;
    const g = e;
    switch (e[r.Kind]) {
      case "Any":
      case "Date":
      case "Symbol":
      case "TemplateLiteral":
      case "Undefined":
      case "Uint8Array":
      case "Unknown":
      case "Void":
        return function (e, t, n) {
          return o.ValueCheck.Check(e, t, n) ? s.ValueClone.Clone(n) : i.ValueCreate.Create(e, t);
        }(g, m, f);
      case "Array":
        return function (e, t, r) {
          if (o.ValueCheck.Check(e, t, r)) return s.ValueClone.Clone(r);
          const l = function (e) {
            return "object" == typeof e && globalThis.Array.isArray(e);
          }(r) ? s.ValueClone.Clone(r) : i.ValueCreate.Create(e, t);
          const u = n(e.minItems) && l.length < e.minItems ? [...l, ...globalThis.Array.from({
            length: e.minItems - l.length
          }, () => null)] : l;
          const p = (n(e.maxItems) && u.length > e.maxItems ? u.slice(0, e.maxItems) : u).map(n => a(e.items, t, n));
          if (!0 !== e.uniqueItems) return p;
          const d = [...new Set(p)];
          if (!o.ValueCheck.Check(e, t, d)) throw new ValueCastArrayUniqueItemsTypeError(e, d);
          return d;
        }(g, m, f);
      case "BigInt":
      case "Boolean":
      case "Function":
      case "Integer":
      case "Literal":
      case "Null":
      case "Number":
      case "Promise":
      case "String":
        return function (e, t, n) {
          return o.ValueCheck.Check(e, t, n) ? n : i.ValueCreate.Create(e, t);
        }(g, m, f);
      case "Constructor":
        return function (e, t, n) {
          if (o.ValueCheck.Check(e, t, n)) return i.ValueCreate.Create(e, t);
          const r = new Set(e.returns.required || []);
          const s = function () {};
          for (const [i, o] of globalThis.Object.entries(e.returns.properties)) if (r.has(i) || void 0 !== n.prototype[i]) {
            s.prototype[i] = a(o, t, n.prototype[i]);
          }
          return s;
        }(g, m, f);
      case "Intersect":
        return function (e, n, r) {
          const s = i.ValueCreate.Create(e, n);
          const a = t(s) && t(r) ? {
            ...s,
            ...r
          } : r;
          return o.ValueCheck.Check(e, n, a) ? a : i.ValueCreate.Create(e, n);
        }(g, m, f);
      case "Never":
        return function (e, t, n) {
          throw new ValueCastNeverTypeError(e);
        }(g);
      case "Not":
        return function (e, t, n) {
          return o.ValueCheck.Check(e, t, n) ? n : i.ValueCreate.Create(e.allOf[1], t);
        }(g, m, f);
      case "Object":
        return function (e, t, n) {
          if (o.ValueCheck.Check(e, t, n)) return n;
          if (null === n || "object" != typeof n) return i.ValueCreate.Create(e, t);
          const r = new Set(e.required || []);
          const s = {};
          for (const [i, o] of globalThis.Object.entries(e.properties)) if (r.has(i) || void 0 !== n[i]) {
            s[i] = a(o, t, n[i]);
          }
          if ("object" == typeof e.additionalProperties) {
            const r = globalThis.Object.getOwnPropertyNames(e.properties);
            for (const i of globalThis.Object.getOwnPropertyNames(n)) if (r.includes(i)) {
              s[i] = a(e.additionalProperties, t, n[i]);
            }
          }
          return s;
        }(g, m, f);
      case "Record":
        return function (e, t, n) {
          if (o.ValueCheck.Check(e, t, n)) return s.ValueClone.Clone(n);
          if (null === n || "object" != typeof n || globalThis.Array.isArray(n) || n instanceof globalThis.Date) return i.ValueCreate.Create(e, t);
          const r = globalThis.Object.getOwnPropertyNames(e.patternProperties)[0];
          const c = e.patternProperties[r];
          const l = {};
          for (const [e, r] of globalThis.Object.entries(n)) l[e] = a(c, t, r);
          return l;
        }(g, m, f);
      case "Ref":
        return function (e, t, n) {
          const r = t.findIndex(t => t.$id === e.$ref);
          if (-1 === r) throw new ValueCastDereferenceError(e);
          return a(t[r], t, n);
        }(g, m, f);
      case "This":
        return function (e, t, n) {
          const r = t.findIndex(t => t.$id === e.$ref);
          if (-1 === r) throw new ValueCastDereferenceError(e);
          return a(t[r], t, n);
        }(g, m, f);
      case "Tuple":
        return function (e, t, n) {
          return o.ValueCheck.Check(e, t, n) ? s.ValueClone.Clone(n) : globalThis.Array.isArray(n) ? void 0 === e.items ? [] : e.items.map((e, r) => a(e, t, n[r])) : i.ValueCreate.Create(e, t);
        }(g, m, f);
      case "Union":
        return function (e, t, n) {
          return o.ValueCheck.Check(e, t, n) ? s.ValueClone.Clone(n) : h.Create(e, t, n);
        }(g, m, f);
      default:
        if (!r.TypeRegistry.Has(g[r.Kind])) throw new ValueCastUnknownTypeError(g);
        return function (e, t, n) {
          return o.ValueCheck.Check(e, t, n) ? s.ValueClone.Clone(n) : i.ValueCreate.Create(e, t);
        }(g, m, f);
    }
  }
  e.Visit = a;
  e.Cast = function (e, t, n) {
    return a(e, t, s.ValueClone.Clone(n));
  };
})(f = exports.ValueCast || (exports.ValueCast = {}));