Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueCheck = exports.ValueCheckDereferenceError = exports.ValueCheckUnknownTypeError = void 0;
const r = require(14350);
const i = require(85007);
const o = require(97540);
class ValueCheckUnknownTypeError extends Error {
  constructor(e) {
    super("ValueCheck: " + (e[r.Kind] ? `Unknown type '${e[r.Kind]}'` : "Unknown type"));
    this.schema = e;
  }
}
exports.ValueCheckUnknownTypeError = ValueCheckUnknownTypeError;
class ValueCheckDereferenceError extends Error {
  constructor(e) {
    super(`ValueCheck: Unable to dereference schema with $id '${e.$ref}'`);
    this.schema = e;
  }
}
exports.ValueCheckDereferenceError = ValueCheckDereferenceError;
(function (e) {
  function t(e) {
    return "string" == typeof e;
  }
  function n(e) {
    return void 0 !== e;
  }
  function c(e, t) {
    return i.TypeSystem.ExactOptionalPropertyTypes ? t in e : void 0 !== e[t];
  }
  function l(e) {
    const t = "object" == typeof e && null !== e;
    return i.TypeSystem.AllowArrayObjects ? t : t && !globalThis.Array.isArray(e);
  }
  function u(e) {
    const t = "number" == typeof e;
    return i.TypeSystem.AllowNaN ? t : t && globalThis.Number.isFinite(e);
  }
  function p(e, d, h) {
    const f = n(e.$id) ? [...d, e] : d;
    const m = e;
    switch (m[r.Kind]) {
      case "Any":
      case "Unknown":
        return !0;
      case "Array":
        return function (e, t, r) {
          return !!globalThis.Array.isArray(r) && (!n(e.minItems) || r.length >= e.minItems) && (!n(e.maxItems) || r.length <= e.maxItems) && !(!0 === e.uniqueItems && !function () {
            const e = new Set();
            for (const t of r) {
              const n = o.ValueHash.Create(t);
              if (e.has(n)) return !1;
              e.add(n);
            }
            return !0;
          }()) && r.every(n => p(e.items, t, n));
        }(m, f, h);
      case "BigInt":
        return function (e, t, r) {
          return !(!function (e) {
            return "bigint" == typeof e;
          }(r) || n(e.multipleOf) && r % e.multipleOf !== globalThis.BigInt(0) || n(e.exclusiveMinimum) && !(r > e.exclusiveMinimum) || n(e.exclusiveMaximum) && !(r < e.exclusiveMaximum) || n(e.minimum) && !(r >= e.minimum) || n(e.maximum) && !(r <= e.maximum));
        }(m, 0, h);
      case "Boolean":
        return function (e, t, n) {
          return "boolean" == typeof n;
        }(0, 0, h);
      case "Constructor":
        return function (e, t, n) {
          return p(e.returns, t, n.prototype);
        }(m, f, h);
      case "Date":
        return function (e, t, r) {
          return r instanceof globalThis.Date && !!u(r.getTime()) && (!n(e.exclusiveMinimumTimestamp) || r.getTime() > e.exclusiveMinimumTimestamp) && (!n(e.exclusiveMaximumTimestamp) || r.getTime() < e.exclusiveMaximumTimestamp) && (!n(e.minimumTimestamp) || r.getTime() >= e.minimumTimestamp) && (!n(e.maximumTimestamp) || r.getTime() <= e.maximumTimestamp);
        }(m, 0, h);
      case "Function":
        return function (e, t, n) {
          return "function" == typeof n;
        }(0, 0, h);
      case "Integer":
        return function (e, t, r) {
          return !(!function (e) {
            return globalThis.Number.isInteger(e);
          }(r) || n(e.multipleOf) && r % e.multipleOf != 0 || n(e.exclusiveMinimum) && !(r > e.exclusiveMinimum) || n(e.exclusiveMaximum) && !(r < e.exclusiveMaximum) || n(e.minimum) && !(r >= e.minimum) || n(e.maximum) && !(r <= e.maximum));
        }(m, 0, h);
      case "Intersect":
        return function (e, t, n) {
          const i = e.allOf.every(e => p(e, t, n));
          if (!1 === e.unevaluatedProperties) {
            const t = new RegExp(r.KeyResolver.ResolvePattern(e));
            const o = globalThis.Object.getOwnPropertyNames(n).every(e => t.test(e));
            return i && o;
          }
          if (r.TypeGuard.TSchema(e.unevaluatedProperties)) {
            const o = new RegExp(r.KeyResolver.ResolvePattern(e));
            const s = globalThis.Object.getOwnPropertyNames(n).every(r => o.test(r) || p(e.unevaluatedProperties, t, n[r]));
            return i && s;
          }
          return i;
        }(m, f, h);
      case "Literal":
        return function (e, t, n) {
          return n === e.const;
        }(m, 0, h);
      case "Never":
        return !1;
      case "Not":
        return function (e, t, n) {
          return !p(e.allOf[0].not, t, n) && p(e.allOf[1], t, n);
        }(m, f, h);
      case "Null":
        return function (e, t, n) {
          return null === n;
        }(0, 0, h);
      case "Number":
        return function (e, t, r) {
          return !(!u(r) || n(e.multipleOf) && r % e.multipleOf != 0 || n(e.exclusiveMinimum) && !(r > e.exclusiveMinimum) || n(e.exclusiveMaximum) && !(r < e.exclusiveMaximum) || n(e.minimum) && !(r >= e.minimum) || n(e.maximum) && !(r <= e.maximum));
        }(m, 0, h);
      case "Object":
        return function (e, t, i) {
          if (!l(i)) return !1;
          if (n(e.minProperties) && !(globalThis.Object.getOwnPropertyNames(i).length >= e.minProperties)) return !1;
          if (n(e.maxProperties) && !(globalThis.Object.getOwnPropertyNames(i).length <= e.maxProperties)) return !1;
          const o = globalThis.Object.getOwnPropertyNames(e.properties);
          for (const n of o) {
            const o = e.properties[n];
            if (e.required && e.required.includes(n)) {
              if (!p(o, t, i[n])) return !1;
              if (r.ExtendsUndefined.Check(o)) return n in i;
            } else if (c(i, n) && !p(o, t, i[n])) return !1;
          }
          if (!1 === e.additionalProperties) {
            const t = globalThis.Object.getOwnPropertyNames(i);
            return !(!e.required || e.required.length !== o.length || t.length !== o.length) || t.every(e => o.includes(e));
          }
          return "object" != typeof e.additionalProperties || globalThis.Object.getOwnPropertyNames(i).every(n => o.includes(n) || p(e.additionalProperties, t, i[n]));
        }(m, f, h);
      case "Promise":
        return function (e, t, n) {
          return "object" == typeof n && "function" == typeof n.then;
        }(0, 0, h);
      case "Record":
        return function (e, t, r) {
          if (!function (e) {
            return l(e) && !(e instanceof globalThis.Date) && !(e instanceof globalThis.Uint8Array);
          }(r)) return !1;
          if (n(e.minProperties) && !(globalThis.Object.getOwnPropertyNames(r).length >= e.minProperties)) return !1;
          if (n(e.maxProperties) && !(globalThis.Object.getOwnPropertyNames(r).length <= e.maxProperties)) return !1;
          const [i, o] = globalThis.Object.entries(e.patternProperties)[0];
          const s = new RegExp(i);
          return globalThis.Object.entries(r).every(([n, r]) => s.test(n) ? p(o, t, r) : "object" == typeof e.additionalProperties ? p(e.additionalProperties, t, r) : !1 !== e.additionalProperties);
        }(m, f, h);
      case "Ref":
        return function (e, t, n) {
          const r = t.findIndex(t => t.$id === e.$ref);
          if (-1 === r) throw new ValueCheckDereferenceError(e);
          return p(t[r], t, n);
        }(m, f, h);
      case "String":
        return function (e, i, o) {
          return !!t(o) && (!n(e.minLength) || o.length >= e.minLength) && (!n(e.maxLength) || o.length <= e.maxLength) && !(n(e.pattern) && !new RegExp(e.pattern).test(o)) && (!n(e.format) || !!r.FormatRegistry.Has(e.format) && r.FormatRegistry.Get(e.format)(o));
        }(m, 0, h);
      case "Symbol":
        return function (e, t, n) {
          return "symbol" == typeof n;
        }(0, 0, h);
      case "TemplateLiteral":
        return function (e, n, r) {
          return !!t(r) && new RegExp(e.pattern).test(r);
        }(m, 0, h);
      case "This":
        return function (e, t, n) {
          const r = t.findIndex(t => t.$id === e.$ref);
          if (-1 === r) throw new ValueCheckDereferenceError(e);
          return p(t[r], t, n);
        }(m, f, h);
      case "Tuple":
        return function (e, t, n) {
          if (!globalThis.Array.isArray(n)) return !1;
          if (void 0 === e.items && 0 !== n.length) return !1;
          if (n.length !== e.maxItems) return !1;
          if (!e.items) return !0;
          for (let r = 0; r < e.items.length; r++) if (!p(e.items[r], t, n[r])) return !1;
          return !0;
        }(m, f, h);
      case "Undefined":
        return function (e, t, n) {
          return void 0 === n;
        }(0, 0, h);
      case "Union":
        return function (e, t, n) {
          return e.anyOf.some(e => p(e, t, n));
        }(m, f, h);
      case "Uint8Array":
        return function (e, t, r) {
          return r instanceof globalThis.Uint8Array && (!n(e.maxByteLength) || r.length <= e.maxByteLength) && (!n(e.minByteLength) || r.length >= e.minByteLength);
        }(m, 0, h);
      case "Void":
        return function (e, t, n) {
          return function (e) {
            const t = void 0 === e;
            return i.TypeSystem.AllowVoidNull ? t || null === e : t;
          }(n);
        }(0, 0, h);
      default:
        if (!r.TypeRegistry.Has(m[r.Kind])) throw new ValueCheckUnknownTypeError(m);
        return function (e, t, n) {
          return !!r.TypeRegistry.Has(e[r.Kind]) && r.TypeRegistry.Get(e[r.Kind])(e, n);
        }(m, 0, h);
    }
  }
  e.Check = function (e, t, n) {
    return p(e, t, n);
  };
})(exports.ValueCheck || (exports.ValueCheck = {}));