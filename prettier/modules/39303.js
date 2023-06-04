Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueConvert = exports.ValueConvertDereferenceError = exports.ValueConvertUnknownTypeError = void 0;
const r = require(14350);
const i = require(95245);
const o = require(4291);
class ValueConvertUnknownTypeError extends Error {
  constructor(e) {
    super("ValueConvert: Unknown type");
    this.schema = e;
  }
}
exports.ValueConvertUnknownTypeError = ValueConvertUnknownTypeError;
class ValueConvertDereferenceError extends Error {
  constructor(e) {
    super(`ValueConvert: Unable to dereference schema with $id '${e.$ref}'`);
    this.schema = e;
  }
}
exports.ValueConvertDereferenceError = ValueConvertDereferenceError;
(function (e) {
  function t(e) {
    return "object" == typeof e && globalThis.Array.isArray(e);
  }
  function n(e) {
    return "string" == typeof e;
  }
  function c(e) {
    return "bigint" == typeof e;
  }
  function l(e) {
    return "number" == typeof e && !isNaN(e);
  }
  function u(e) {
    return n(e) && !isNaN(e) && !isNaN(parseFloat(e));
  }
  function p(e) {
    return !0 === e || l(e) && 1 === e || c(e) && e === globalThis.BigInt("1") || n(e) && ("true" === e.toLowerCase() || "1" === e);
  }
  function d(e) {
    return !1 === e || l(e) && 0 === e || c(e) && e === globalThis.BigInt("0") || n(e) && ("false" === e.toLowerCase() || "0" === e);
  }
  function h(e) {
    return !!p(e) || !d(e) && e;
  }
  function f(e) {
    return function (e) {
      return c(e) || function (e) {
        return "boolean" == typeof e;
      }(e) || l(e);
    }(e) ? e.toString() : function (e) {
      return "symbol" == typeof e;
    }(e) && void 0 !== e.description ? e.description.toString() : e;
  }
  function m(e) {
    return u(e) ? parseFloat(e) : p(e) ? 1 : d(e) ? 0 : e;
  }
  function g(e, c, y) {
    const _ = n(e.$id) ? [...c, e] : c;
    const v = e;
    switch (e[r.Kind]) {
      case "Any":
      case "Function":
      case "Intersect":
      case "Never":
      case "Promise":
      case "Symbol":
      case "TemplateLiteral":
      case "Uint8Array":
      case "Unknown":
      case "Void":
        return function (e, t, n) {
          return n;
        }(0, 0, y);
      case "Array":
        return function (e, n, r) {
          return t(r) ? r.map(t => g(e.items, n, t)) : r;
        }(v, _, y);
      case "BigInt":
        return function (e, t, n) {
          return function (e) {
            return u(e) ? globalThis.BigInt(parseInt(e)) : l(e) ? globalThis.BigInt(0 | e) : d(e) ? 0 : p(e) ? 1 : e;
          }(n);
        }(0, 0, y);
      case "Boolean":
        return function (e, t, n) {
          return h(n);
        }(0, 0, y);
      case "Constructor":
        return function (e, t, n) {
          return i.ValueClone.Clone(n);
        }(0, 0, y);
      case "Date":
        return function (e, t, r) {
          return function (e) {
            return function (e) {
              return "object" == typeof e && e instanceof globalThis.Date;
            }(e) ? e : l(e) ? new globalThis.Date(e) : p(e) ? new globalThis.Date(1) : d(e) ? new globalThis.Date(0) : u(e) ? new globalThis.Date(parseInt(e)) : function (e) {
              return n(e) && /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)?$/i.test(e);
            }(e) ? new globalThis.Date(`1970-01-01T${e}.000Z`) : function (e) {
              return n(e) && /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i.test(e);
            }(e) ? new globalThis.Date(`1970-01-01T${e}`) : function (e) {
              return n(e) && /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)?$/i.test(e);
            }(e) ? new globalThis.Date(`${e}.000Z`) : function (e) {
              return n(e) && /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i.test(e);
            }(e) ? new globalThis.Date(e) : function (e) {
              return n(e) && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(e);
            }(e) ? new globalThis.Date(`${e}T00:00:00.000Z`) : e;
          }(r);
        }(0, 0, y);
      case "Integer":
        return function (e, t, n) {
          return function (e) {
            return u(e) ? parseInt(e) : l(e) ? 0 | e : p(e) ? 1 : d(e) ? 0 : e;
          }(n);
        }(0, 0, y);
      case "Literal":
        return function (e, t, n) {
          return function (e, t) {
            return "string" == typeof e.const ? function (e, t) {
              const n = f(e);
              return n === t ? n : e;
            }(t, e.const) : "number" == typeof e.const ? function (e, t) {
              const n = m(e);
              return n === t ? n : e;
            }(t, e.const) : "boolean" == typeof e.const ? function (e, t) {
              const n = h(e);
              return n === t ? n : e;
            }(t, e.const) : i.ValueClone.Clone(t);
          }(e, n);
        }(v, 0, y);
      case "Null":
        return function (e, t, r) {
          return function (e) {
            return n(e) && "null" === e.toLowerCase() ? null : e;
          }(r);
        }(0, 0, y);
      case "Number":
        return function (e, t, n) {
          return m(n);
        }(0, 0, y);
      case "Object":
        return function (e, t, n) {
          return function (e) {
            return "object" == typeof e && null !== e && !globalThis.Array.isArray(e);
          }(n) ? globalThis.Object.keys(e.properties).reduce((r, i) => void 0 !== n[i] ? {
            ...r,
            [i]: g(e.properties[i], t, n[i])
          } : {
            ...r
          }, n) : n;
        }(v, _, y);
      case "Record":
        return function (e, t, n) {
          const r = globalThis.Object.getOwnPropertyNames(e.patternProperties)[0];
          const i = e.patternProperties[r];
          const o = {};
          for (const [e, r] of globalThis.Object.entries(n)) o[e] = g(i, t, r);
          return o;
        }(v, _, y);
      case "Ref":
        return function (e, t, n) {
          const r = t.findIndex(t => t.$id === e.$ref);
          if (-1 === r) throw new ValueConvertDereferenceError(e);
          return g(t[r], t, n);
        }(v, _, y);
      case "String":
        return function (e, t, n) {
          return f(n);
        }(0, 0, y);
      case "This":
        return function (e, t, n) {
          const r = t.findIndex(t => t.$id === e.$ref);
          if (-1 === r) throw new ValueConvertDereferenceError(e);
          return g(t[r], t, n);
        }(v, _, y);
      case "Tuple":
        return function (e, n, r) {
          return t(r) && void 0 !== e.items ? r.map((t, r) => r < e.items.length ? g(e.items[r], n, t) : t) : r;
        }(v, _, y);
      case "Undefined":
        return function (e, t, r) {
          return function (e) {
            return n(e) && "undefined" === e ? void 0 : e;
          }(r);
        }(0, 0, y);
      case "Union":
        return function (e, t, n) {
          for (const r of e.anyOf) {
            const e = g(r, t, n);
            if (o.ValueCheck.Check(r, t, e)) return e;
          }
          return n;
        }(v, _, y);
      default:
        if (!r.TypeRegistry.Has(v[r.Kind])) throw new ValueConvertUnknownTypeError(v);
        return function (e, t, n) {
          return n;
        }(0, 0, y);
    }
  }
  e.Visit = g;
  e.Convert = function (e, t, n) {
    return g(e, t, i.ValueClone.Clone(n));
  };
})(exports.ValueConvert || (exports.ValueConvert = {}));