Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueCreate = exports.ValueCreateDereferenceError = exports.ValueCreateTempateLiteralTypeError = exports.ValueCreateIntersectTypeError = exports.ValueCreateNeverTypeError = exports.ValueCreateUnknownTypeError = void 0;
const r = require(14350);
const i = require(4291);
class ValueCreateUnknownTypeError extends Error {
  constructor(e) {
    super("ValueCreate: Unknown type");
    this.schema = e;
  }
}
exports.ValueCreateUnknownTypeError = ValueCreateUnknownTypeError;
class ValueCreateNeverTypeError extends Error {
  constructor(e) {
    super("ValueCreate: Never types cannot be created");
    this.schema = e;
  }
}
exports.ValueCreateNeverTypeError = ValueCreateNeverTypeError;
class ValueCreateIntersectTypeError extends Error {
  constructor(e) {
    super("ValueCreate: Intersect produced invalid value. Consider using a default value.");
    this.schema = e;
  }
}
exports.ValueCreateIntersectTypeError = ValueCreateIntersectTypeError;
class ValueCreateTempateLiteralTypeError extends Error {
  constructor(e) {
    super("ValueCreate: Can only create template literal values from patterns that produce finite sequences. Consider using a default value.");
    this.schema = e;
  }
}
exports.ValueCreateTempateLiteralTypeError = ValueCreateTempateLiteralTypeError;
class ValueCreateDereferenceError extends Error {
  constructor(e) {
    super(`ValueCreate: Unable to dereference schema with $id '${e.$ref}'`);
    this.schema = e;
  }
}
exports.ValueCreateDereferenceError = ValueCreateDereferenceError;
(function (e) {
  function t(u, p) {
    const d = "string" == typeof u.$id ? [...p, u] : p;
    const h = u;
    switch (h[r.Kind]) {
      case "Any":
      case "Unknown":
        return function (e, t) {
          return "default" in e ? e.default : {};
        }(h);
      case "Array":
        return function (t, n) {
          if (!0 === t.uniqueItems && void 0 === t.default) throw new Error("ValueCreate.Array: Arrays with uniqueItems require a default value");
          return "default" in t ? t.default : void 0 !== t.minItems ? globalThis.Array.from({
            length: t.minItems
          }).map(r => e.Create(t.items, n)) : [];
        }(h, d);
      case "BigInt":
        return function (e, t) {
          return "default" in e ? e.default : globalThis.BigInt(0);
        }(h);
      case "Boolean":
        return function (e, t) {
          return "default" in e && e.default;
        }(h);
      case "Constructor":
        return function (t, n) {
          if ("default" in t) return t.default;
          {
            const r = e.Create(t.returns, n);
            return "object" != typeof r || globalThis.Array.isArray(r) ? class {} : class {
              constructor() {
                for (const [e, t] of globalThis.Object.entries(r)) this[e] = t;
              }
            };
          }
        }(h, d);
      case "Date":
        return function (e, t) {
          return "default" in e ? e.default : void 0 !== e.minimumTimestamp ? new globalThis.Date(e.minimumTimestamp) : new globalThis.Date(0);
        }(h);
      case "Function":
        return function (t, n) {
          return "default" in t ? t.default : () => e.Create(t.returns, n);
        }(h, d);
      case "Integer":
      case "Number":
        return function (e, t) {
          return "default" in e ? e.default : void 0 !== e.minimum ? e.minimum : 0;
        }(h);
      case "Intersect":
        return function (e, n) {
          if ("default" in e) return e.default;
          {
            const r = e.allOf.reduce((e, r) => {
              const i = t(r, n);
              return "object" == typeof i ? {
                ...e,
                ...i
              } : i;
            }, {});
            if (!i.ValueCheck.Check(e, n, r)) throw new ValueCreateIntersectTypeError(e);
            return r;
          }
        }(h, d);
      case "Literal":
        return function (e, t) {
          return "default" in e ? e.default : e.const;
        }(h);
      case "Never":
        return function (e, t) {
          throw new ValueCreateNeverTypeError(e);
        }(h);
      case "Not":
        return function (e, n) {
          return "default" in e ? e.default : t(e.allOf[1], n);
        }(h, d);
      case "Null":
        return function (e, t) {
          return "default" in e ? e.default : null;
        }(h);
      case "Object":
        return function (t, n) {
          if ("default" in t) return t.default;
          {
            const r = new Set(t.required);
            return t.default || globalThis.Object.entries(t.properties).reduce((t, [i, o]) => r.has(i) ? {
              ...t,
              [i]: e.Create(o, n)
            } : {
              ...t
            }, {});
          }
        }(h, d);
      case "Promise":
        return function (t, n) {
          return "default" in t ? t.default : globalThis.Promise.resolve(e.Create(t.item, n));
        }(h, d);
      case "Record":
        return function (e, t) {
          const [i, o] = globalThis.Object.entries(e.patternProperties)[0];
          return "default" in e ? e.default : i !== r.PatternStringExact && i !== r.PatternNumberExact ? i.slice(1, i.length - 1).split("|").reduce((e, r) => ({
            ...e,
            [r]: n(o, t)
          }), {}) : {};
        }(h, d);
      case "Ref":
        return function (e, n) {
          if ("default" in e) return e.default;
          {
            const r = n.findIndex(t => t.$id === e.$id);
            if (-1 === r) throw new ValueCreateDereferenceError(e);
            return t(n[r], n);
          }
        }(h, d);
      case "String":
        return function (e, t) {
          if (void 0 !== e.pattern) {
            if ("default" in e) return e.default;
            throw new Error("ValueCreate.String: String types with patterns must specify a default value");
          }
          if (void 0 !== e.format) {
            if ("default" in e) return e.default;
            throw new Error("ValueCreate.String: String types with formats must specify a default value");
          }
          return "default" in e ? e.default : void 0 !== e.minLength ? globalThis.Array.from({
            length: e.minLength
          }).map(() => ".").join("") : "";
        }(h);
      case "Symbol":
        return function (e, t) {
          return "default" in e ? e.default : "value" in e ? globalThis.Symbol.for(e.value) : globalThis.Symbol();
        }(h);
      case "TemplateLiteral":
        return function (e, t) {
          if ("default" in e) return e.default;
          const n = r.TemplateLiteralParser.ParseExact(e.pattern);
          if (!r.TemplateLiteralFinite.Check(n)) throw new ValueCreateTempateLiteralTypeError(e);
          return r.TemplateLiteralGenerator.Generate(n).next().value;
        }(h);
      case "This":
        return function (e, n) {
          if ("default" in e) return e.default;
          {
            const r = n.findIndex(t => t.$id === e.$id);
            if (-1 === r) throw new ValueCreateDereferenceError(e);
            return t(n[r], n);
          }
        }(h, d);
      case "Tuple":
        return function (t, n) {
          return "default" in t ? t.default : void 0 === t.items ? [] : globalThis.Array.from({
            length: t.minItems
          }).map((r, i) => e.Create(t.items[i], n));
        }(h, d);
      case "Undefined":
      case "Void":
        return function (e, t) {
          return "default" in e ? e.default : void 0;
        }(h);
      case "Union":
        return function (t, n) {
          if ("default" in t) return t.default;
          if (0 === t.anyOf.length) throw new Error("ValueCreate.Union: Cannot create Union with zero variants");
          return e.Create(t.anyOf[0], n);
        }(h, d);
      case "Uint8Array":
        return function (e, t) {
          return "default" in e ? e.default : void 0 !== e.minByteLength ? new globalThis.Uint8Array(e.minByteLength) : new globalThis.Uint8Array(0);
        }(h);
      default:
        if (!r.TypeRegistry.Has(h[r.Kind])) throw new ValueCreateUnknownTypeError(h);
        return function (e, t) {
          if ("default" in e) return e.default;
          throw new Error("ValueCreate.UserDefined: User defined types must specify a default value");
        }(h);
    }
  }
  function n(e, n) {
    return t(e, n);
  }
  e.Visit = t;
  e.Create = n;
})(exports.ValueCreate || (exports.ValueCreate = {}));