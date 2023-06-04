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
var f;
var m;
var g;
var y;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.Type = exports.StandardType = exports.ExtendedTypeBuilder = exports.StandardTypeBuilder = exports.TypeBuilder = exports.TemplateLiteralDslParser = exports.TemplateLiteralGenerator = exports.TemplateLiteralFinite = exports.TemplateLiteralParser = exports.TemplateLiteralParserError = exports.TemplateLiteralResolver = exports.TemplateLiteralPattern = exports.UnionResolver = exports.KeyArrayResolver = exports.KeyResolver = exports.ObjectMap = exports.IndexedAccessor = exports.TypeClone = exports.TypeExtends = exports.TypeExtendsResult = exports.ExtendsUndefined = exports.TypeGuard = exports.TypeGuardUnknownTypeError = exports.FormatRegistry = exports.TypeRegistry = exports.PatternStringExact = exports.PatternNumberExact = exports.PatternBooleanExact = exports.PatternString = exports.PatternNumber = exports.PatternBoolean = exports.Kind = exports.Hint = exports.Modifier = void 0;
exports.Modifier = Symbol.for("TypeBox.Modifier");
exports.Hint = Symbol.for("TypeBox.Hint");
exports.Kind = Symbol.for("TypeBox.Kind");
exports.PatternBoolean = "(true|false)";
exports.PatternNumber = "(0|[1-9][0-9]*)";
exports.PatternString = "(.*)";
exports.PatternBooleanExact = `^${exports.PatternBoolean}$`;
exports.PatternNumberExact = `^${exports.PatternNumber}$`;
exports.PatternStringExact = `^${exports.PatternString}$`;
(function (e) {
  const t = new Map();
  e.Entries = function () {
    return new Map(t);
  };
  e.Clear = function () {
    return t.clear();
  };
  e.Has = function (e) {
    return t.has(e);
  };
  e.Set = function (e, n) {
    t.set(e, n);
  };
  e.Get = function (e) {
    return t.get(e);
  };
})(n = exports.TypeRegistry || (exports.TypeRegistry = {}));
(function (e) {
  const t = new Map();
  e.Entries = function () {
    return new Map(t);
  };
  e.Clear = function () {
    return t.clear();
  };
  e.Has = function (e) {
    return t.has(e);
  };
  e.Set = function (e, n) {
    t.set(e, n);
  };
  e.Get = function (e) {
    return t.get(e);
  };
})(exports.FormatRegistry || (exports.FormatRegistry = {}));
class TypeGuardUnknownTypeError extends Error {
  constructor(e) {
    super("TypeGuard: Unknown type");
    this.schema = e;
  }
}
exports.TypeGuardUnknownTypeError = TypeGuardUnknownTypeError;
(function (e) {
  function r(e) {
    return "object" == typeof e && null !== e && !Array.isArray(e);
  }
  function i(e) {
    return "object" == typeof e && null !== e && Array.isArray(e);
  }
  function o(e) {
    try {
      new RegExp(e);
      return !0;
    } catch {
      return !1;
    }
  }
  function s(e) {
    if ("string" != typeof e) return !1;
    for (let t = 0; t < e.length; t++) {
      const n = e.charCodeAt(t);
      if (n >= 7 && n <= 13 || 27 === n || 127 === n) return !1;
    }
    return !0;
  }
  function a(e) {
    return d(e) || G(e);
  }
  function c(e) {
    return "string" == typeof e;
  }
  function l(e) {
    return "number" == typeof e && globalThis.Number.isFinite(e);
  }
  function u(e) {
    return void 0 === e || void 0 !== e && function (e) {
      return "bigint" == typeof e;
    }(e);
  }
  function p(e) {
    return void 0 === e || void 0 !== e && l(e);
  }
  function d(e) {
    return void 0 === e || void 0 !== e && function (e) {
      return "boolean" == typeof e;
    }(e);
  }
  function h(e) {
    return void 0 === e || void 0 !== e && c(e);
  }
  function f(e) {
    return T(e) && "Any" === e[exports.Kind] && h(e.$id);
  }
  function m(e) {
    return T(e) && "Array" === e[exports.Kind] && "array" === e.type && h(e.$id) && G(e.items) && p(e.minItems) && p(e.maxItems) && d(e.uniqueItems);
  }
  function g(e) {
    return T(e) && "BigInt" === e[exports.Kind] && "null" === e.type && "BigInt" === e.typeOf && h(e.$id) && u(e.multipleOf) && u(e.minimum) && u(e.maximum) && u(e.exclusiveMinimum) && u(e.exclusiveMaximum);
  }
  function y(e) {
    return T(e) && "Boolean" === e[exports.Kind] && "boolean" === e.type && h(e.$id);
  }
  function _(e) {
    if (!(T(e) && "Constructor" === e[exports.Kind] && "object" === e.type && "Constructor" === e.instanceOf && h(e.$id) && i(e.parameters) && G(e.returns))) return !1;
    for (const t of e.parameters) if (!G(t)) return !1;
    return !0;
  }
  function v(e) {
    return T(e) && "Date" === e[exports.Kind] && "object" === e.type && "Date" === e.instanceOf && h(e.$id) && p(e.minimumTimestamp) && p(e.maximumTimestamp) && p(e.exclusiveMinimumTimestamp) && p(e.exclusiveMaximumTimestamp);
  }
  function b(e) {
    if (!(T(e) && "Function" === e[exports.Kind] && "object" === e.type && "Function" === e.instanceOf && h(e.$id) && i(e.parameters) && G(e.returns))) return !1;
    for (const t of e.parameters) if (!G(t)) return !1;
    return !0;
  }
  function E(e) {
    return T(e) && "Integer" === e[exports.Kind] && "integer" === e.type && h(e.$id) && p(e.multipleOf) && p(e.minimum) && p(e.maximum) && p(e.exclusiveMinimum) && p(e.exclusiveMaximum);
  }
  function w(e) {
    if (!(T(e) && "Intersect" === e[exports.Kind] && i(e.allOf) && h(e.type) && (d(e.unevaluatedProperties) || (n = e.unevaluatedProperties, void 0 === n || G(n))) && h(e.$id))) return !1;
    var n;
    if ("type" in e && "object" !== e.type) return !1;
    for (const t of e.allOf) if (!G(t)) return !1;
    return !0;
  }
  function T(e) {
    return r(e) && exports.Kind in e && "string" == typeof e[exports.Kind];
  }
  function S(e) {
    return T(e) && "Literal" === e[exports.Kind] && h(e.$id) && "string" == typeof e.const;
  }
  function x(e) {
    return T(e) && "Literal" === e[exports.Kind] && h(e.$id) && "number" == typeof e.const;
  }
  function C(e) {
    return T(e) && "Literal" === e[exports.Kind] && h(e.$id) && "boolean" == typeof e.const;
  }
  function I(e) {
    return S(e) || x(e) || C(e);
  }
  function A(e) {
    return T(e) && "Never" === e[exports.Kind] && r(e.not) && 0 === globalThis.Object.getOwnPropertyNames(e.not).length;
  }
  function k(e) {
    return T(e) && "Not" === e[exports.Kind] && i(e.allOf) && 2 === e.allOf.length && r(e.allOf[0]) && G(e.allOf[0].not) && G(e.allOf[1]);
  }
  function P(e) {
    return T(e) && "Null" === e[exports.Kind] && "null" === e.type && h(e.$id);
  }
  function N(e) {
    return T(e) && "Number" === e[exports.Kind] && "number" === e.type && h(e.$id) && p(e.multipleOf) && p(e.minimum) && p(e.maximum) && p(e.exclusiveMinimum) && p(e.exclusiveMaximum);
  }
  function O(e) {
    if (!(T(e) && "Object" === e[exports.Kind] && "object" === e.type && h(e.$id) && r(e.properties) && a(e.additionalProperties) && p(e.minProperties) && p(e.maxProperties))) return !1;
    for (const [t, n] of Object.entries(e.properties)) {
      if (!s(t)) return !1;
      if (!G(n)) return !1;
    }
    return !0;
  }
  function R(e) {
    return T(e) && "Promise" === e[exports.Kind] && "object" === e.type && "Promise" === e.instanceOf && h(e.$id) && G(e.item);
  }
  function M(e) {
    if (!(T(e) && "Record" === e[exports.Kind] && "object" === e.type && h(e.$id) && a(e.additionalProperties) && r(e.patternProperties))) return !1;
    const n = Object.keys(e.patternProperties);
    return 1 === n.length && !!o(n[0]) && !!G(e.patternProperties[n[0]]);
  }
  function L(e) {
    return T(e) && "Ref" === e[exports.Kind] && h(e.$id) && c(e.$ref);
  }
  function D(e) {
    return T(e) && "String" === e[exports.Kind] && "string" === e.type && h(e.$id) && p(e.minLength) && p(e.maxLength) && (void 0 === (n = e.pattern) || void 0 !== n && c(n) && s(n) && o(n)) && function (e) {
      return void 0 === e || void 0 !== e && c(e) && s(e);
    }(e.format);
    var n;
  }
  function B(e) {
    return T(e) && "Symbol" === e[exports.Kind] && "null" === e.type && "Symbol" === e.typeOf && h(e.$id);
  }
  function F(e) {
    return T(e) && "TemplateLiteral" === e[exports.Kind] && "string" === e.type && c(e.pattern) && "^" === e.pattern[0] && "$" === e.pattern[e.pattern.length - 1];
  }
  function j(e) {
    return T(e) && "This" === e[exports.Kind] && h(e.$id) && c(e.$ref);
  }
  function U(e) {
    if (!(T(e) && "Tuple" === e[exports.Kind] && "array" === e.type && h(e.$id) && l(e.minItems) && l(e.maxItems) && e.minItems === e.maxItems)) return !1;
    if (void 0 === e.items && void 0 === e.additionalItems && 0 === e.minItems) return !0;
    if (!i(e.items)) return !1;
    for (const t of e.items) if (!G(t)) return !1;
    return !0;
  }
  function $(e) {
    return T(e) && "Undefined" === e[exports.Kind] && "null" === e.type && "Undefined" === e.typeOf && h(e.$id);
  }
  function V(e) {
    if (!(T(e) && "Union" === e[exports.Kind] && i(e.anyOf) && h(e.$id))) return !1;
    for (const t of e.anyOf) if (!G(t)) return !1;
    return !0;
  }
  function H(e) {
    return T(e) && "Uint8Array" === e[exports.Kind] && "object" === e.type && h(e.$id) && "Uint8Array" === e.instanceOf && p(e.minByteLength) && p(e.maxByteLength);
  }
  function q(e) {
    return T(e) && "Unknown" === e[exports.Kind] && h(e.$id);
  }
  function z(e) {
    return T(e) && "Unsafe" === e[exports.Kind];
  }
  function K(e) {
    return T(e) && "Void" === e[exports.Kind] && "null" === e.type && "Void" === e.typeOf && h(e.$id);
  }
  function G(e) {
    return "object" == typeof e && (f(e) || m(e) || y(e) || g(e) || _(e) || v(e) || b(e) || E(e) || w(e) || I(e) || A(e) || k(e) || P(e) || N(e) || O(e) || R(e) || M(e) || L(e) || D(e) || B(e) || F(e) || j(e) || U(e) || $(e) || V(e) || H(e) || q(e) || z(e) || K(e) || T(e) && n.Has(e[exports.Kind]));
  }
  e.TAny = f;
  e.TArray = m;
  e.TBigInt = g;
  e.TBoolean = y;
  e.TConstructor = _;
  e.TDate = v;
  e.TFunction = b;
  e.TInteger = E;
  e.TIntersect = w;
  e.TKind = T;
  e.TLiteralString = S;
  e.TLiteralNumber = x;
  e.TLiteralBoolean = C;
  e.TLiteral = I;
  e.TNever = A;
  e.TNot = k;
  e.TNull = P;
  e.TNumber = N;
  e.TObject = O;
  e.TPromise = R;
  e.TRecord = M;
  e.TRef = L;
  e.TString = D;
  e.TSymbol = B;
  e.TTemplateLiteral = F;
  e.TThis = j;
  e.TTuple = U;
  e.TUndefined = $;
  e.TUnionLiteral = function (e) {
    return V(e) && e.anyOf.every(e => S(e) || x(e));
  };
  e.TUnion = V;
  e.TUint8Array = H;
  e.TUnknown = q;
  e.TUnsafe = z;
  e.TVoid = K;
  e.TReadonlyOptional = function (e) {
    return r(e) && "ReadonlyOptional" === e[exports.Modifier];
  };
  e.TReadonly = function (e) {
    return r(e) && "Readonly" === e[exports.Modifier];
  };
  e.TOptional = function (e) {
    return r(e) && "Optional" === e[exports.Modifier];
  };
  e.TSchema = G;
})(r = exports.TypeGuard || (exports.TypeGuard = {}));
(exports.ExtendsUndefined || (exports.ExtendsUndefined = {})).Check = function e(n) {
  return "Undefined" === n[exports.Kind] || "Union" === n[exports.Kind] && n.anyOf.some(t => e(t));
};
(function (e) {
  e[e.Union = 0] = "Union";
  e[e.True = 1] = "True";
  e[e.False = 2] = "False";
})(i = exports.TypeExtendsResult || (exports.TypeExtendsResult = {}));
(function (e) {
  function n(e) {
    return e === i.False ? i.False : i.True;
  }
  function o(e, t) {
    return i.True;
  }
  function s(e, t) {
    return r.TLiteral(e) && "boolean" == typeof e.const || r.TBoolean(e) ? i.True : i.False;
  }
  function a(e, t) {
    return r.TLiteral(e) && "number" == typeof e.const || r.TNumber(e) || r.TInteger(e) ? i.True : i.False;
  }
  function c(e, t) {
    return t.allOf.every(t => A(e, t) === i.True) ? i.True : i.False;
  }
  function l(e) {
    return "string" == typeof e.const;
  }
  function u(e) {
    return "number" == typeof e.const;
  }
  function p(e, t) {
    return i.False;
  }
  function d(e, t) {
    return r.TLiteral(e) && u(e) || r.TNumber(e) || r.TInteger(e) ? i.True : i.False;
  }
  function f(e, t) {
    return globalThis.Object.keys(e.properties).length === t;
  }
  function m(e) {
    return v(e);
  }
  function g(e) {
    return f(e, 0) || f(e, 1) && "description" in e.properties && r.TUnion(e.properties.description) && 2 === e.properties.description.anyOf.length && (r.TString(e.properties.description.anyOf[0]) && r.TUndefined(e.properties.description.anyOf[1]) || r.TString(e.properties.description.anyOf[1]) && r.TUndefined(e.properties.description.anyOf[0]));
  }
  function y(e) {
    return f(e, 0);
  }
  function _(e) {
    return f(e, 0);
  }
  function v(e) {
    const r = exports.Type.Number();
    return f(e, 0) || f(e, 1) && "length" in e.properties && n(A(e.properties.length, r)) === i.True;
  }
  function b(e, t) {
    return A(e, t) === i.False || r.TOptional(e) && !r.TOptional(t) ? i.False : i.True;
  }
  function E(e, o) {
    return r.TUnknown(e) ? i.False : r.TAny(e) ? i.Union : r.TNever(e) || r.TLiteral(e) && l(e) && m(o) || r.TLiteral(e) && u(e) && y(o) || r.TLiteral(e) && "boolean" == typeof e.const && _(o) || r.TSymbol(e) && g(o) || r.TBigInt(e) && f(o, 0) || r.TString(e) && m(o) || r.TSymbol(e) && g(o) || r.TNumber(e) && y(o) || r.TInteger(e) && y(o) || r.TBoolean(e) && _(o) || r.TUint8Array(e) && function (e) {
      return v(e);
    }(o) || r.TDate(e) && function (e) {
      return f(e, 0);
    }(o) || r.TConstructor(e) && function (e) {
      return f(e, 0);
    }(o) || r.TFunction(e) && function (e) {
      const r = exports.Type.Number();
      return f(e, 0) || f(e, 1) && "length" in e.properties && n(A(e.properties.length, r)) === i.True;
    }(o) ? i.True : r.TRecord(e) && r.TString(w(e)) ? "Record" === o[exports.Hint] ? i.True : i.False : r.TRecord(e) && r.TNumber(w(e)) && f(o, 0) ? i.True : i.False;
  }
  function w(e) {
    if (exports.PatternNumberExact in e.patternProperties) return exports.Type.Number();
    if (exports.PatternStringExact in e.patternProperties) return exports.Type.String();
    throw Error("TypeExtends: Cannot get record key");
  }
  function T(e) {
    if (exports.PatternNumberExact in e.patternProperties) return e.patternProperties[exports.PatternNumberExact];
    if (exports.PatternStringExact in e.patternProperties) return e.patternProperties[exports.PatternStringExact];
    throw Error("TypeExtends: Cannot get record value");
  }
  function S(e, t) {
    const o = w(t);
    const s = T(t);
    if (r.TLiteral(e) && l(e) && r.TNumber(o) && n(A(e, s)) === i.True) return i.True;
    if (r.TUint8Array(e) && r.TNumber(o)) return A(e, s);
    if (r.TString(e) && r.TNumber(o)) return A(e, s);
    if (r.TArray(e) && r.TNumber(o)) return A(e, s);
    if (r.TObject(e)) {
      for (const t of globalThis.Object.keys(e.properties)) if (b(s, e.properties[t]) === i.False) return i.False;
      return i.True;
    }
    return i.False;
  }
  function x(e, t) {
    return r.TLiteral(e) && "string" == typeof e.const || r.TString(e) ? i.True : i.False;
  }
  function C(e, t) {
    return t.anyOf.some(t => A(e, t) === i.True) ? i.True : i.False;
  }
  function I(e, t) {
    return i.True;
  }
  function A(e, l) {
    if (r.TTemplateLiteral(e)) return A(h.Resolve(e), l);
    if (r.TTemplateLiteral(l)) return A(e, h.Resolve(l));
    if (r.TAny(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) && t.anyOf.some(e => r.TAny(e) || r.TUnknown(e)) ? i.True : r.TUnion(t) ? i.Union : r.TUnknown(t) || r.TAny(t) ? i.True : i.Union;
    }(e, l);
    if (r.TArray(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) && v(t) ? i.True : r.TArray(t) ? n(A(e.items, t.items)) : i.False;
    }(e, l);
    if (r.TBigInt(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TBigInt(t) ? i.True : i.False;
    }(e, l);
    if (r.TBoolean(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TBoolean(t) ? i.True : i.False;
    }(e, l);
    if (r.TConstructor(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TConstructor(t) ? e.parameters.length > t.parameters.length ? i.False : e.parameters.every((e, r) => n(A(t.parameters[r], e)) === i.True) ? n(A(e.returns, t.returns)) : i.False : i.False;
    }(e, l);
    if (r.TDate(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TDate(t) ? i.True : i.False;
    }(e, l);
    if (r.TFunction(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TFunction(t) ? e.parameters.length > t.parameters.length ? i.False : e.parameters.every((e, r) => n(A(t.parameters[r], e)) === i.True) ? n(A(e.returns, t.returns)) : i.False : i.False;
    }(e, l);
    if (r.TInteger(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TInteger(t) || r.TNumber(t) ? i.True : i.False;
    }(e, l);
    if (r.TIntersect(e)) return function (e, t) {
      return e.allOf.some(e => A(e, t) === i.True) ? i.True : i.False;
    }(e, l);
    if (r.TLiteral(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TString(t) ? x(e) : r.TNumber(t) ? d(e) : r.TInteger(t) ? a(e) : r.TBoolean(t) ? s(e) : r.TLiteral(t) && t.const === e.const ? i.True : i.False;
    }(e, l);
    if (r.TNever(e)) return i.True;
    if (r.TNull(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TNull(t) ? i.True : i.False;
    }(e, l);
    if (r.TNumber(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TInteger(t) || r.TNumber(t) ? i.True : i.False;
    }(e, l);
    if (r.TObject(e)) return function (e, t) {
      if (r.TIntersect(t)) return c(e, t);
      if (r.TUnion(t)) return C(e, t);
      if (r.TUnknown(t)) return I();
      if (r.TAny(t)) return o();
      if (r.TRecord(t)) return S(e, t);
      if (!r.TObject(t)) return i.False;
      for (const n of globalThis.Object.keys(t.properties)) {
        if (!(n in e.properties)) return i.False;
        if (b(e.properties[n], t.properties[n]) === i.False) return i.False;
      }
      return i.True;
    }(e, l);
    if (r.TRecord(e)) return function (e, t) {
      const n = T(e);
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? A(n, T(t)) : i.False;
    }(e, l);
    if (r.TString(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TString(t) ? i.True : i.False;
    }(e, l);
    if (r.TSymbol(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TSymbol(t) ? i.True : i.False;
    }(e, l);
    if (r.TTuple(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) && v(t) || r.TArray(t) && function (e, t) {
        return r.TArray(t) && void 0 !== e.items && e.items.every(e => A(e, t.items) === i.True);
      }(e, t) ? i.True : r.TTuple(t) ? void 0 === e.items && void 0 !== t.items || void 0 !== e.items && void 0 === t.items ? i.False : void 0 === e.items && void 0 === t.items || e.items.every((e, n) => A(e, t.items[n]) === i.True) ? i.True : i.False : i.False;
    }(e, l);
    if (r.TPromise(e)) return function (e, s) {
      return r.TIntersect(s) ? c(e, s) : r.TUnion(s) ? C(e, s) : r.TUnknown(s) ? I() : r.TAny(s) ? o() : r.TObject(s) && function (e) {
        const r = exports.Type.Function([exports.Type.Any()], exports.Type.Any());
        return f(e, 0) || f(e, 1) && "then" in e.properties && n(A(e.properties.then, r)) === i.True;
      }(s) ? i.True : r.TPromise(s) ? n(A(e.item, s.item)) : i.False;
    }(e, l);
    if (r.TUint8Array(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TUint8Array(t) ? i.True : i.False;
    }(e, l);
    if (r.TUndefined(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TNever(t) ? p() : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TRecord(t) ? S(e, t) : r.TVoid(t) ? function (e, t) {
        return r.TUndefined(e) || r.TUndefined(e) ? i.True : i.False;
      }(e) : r.TUndefined(t) ? i.True : i.False;
    }(e, l);
    if (r.TUnion(e)) return function (e, t) {
      return e.anyOf.every(e => A(e, t) === i.True) ? i.True : i.False;
    }(e, l);
    if (r.TUnknown(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TAny(t) ? o() : r.TString(t) ? x(e) : r.TNumber(t) ? d(e) : r.TInteger(t) ? a(e) : r.TBoolean(t) ? s(e) : r.TArray(t) || r.TTuple(t) ? function (e, t) {
        return r.TUnknown(e) ? i.False : r.TAny(e) ? i.Union : r.TNever(e) ? i.True : i.False;
      }(e) : r.TObject(t) ? E(e, t) : r.TUnknown(t) ? i.True : i.False;
    }(e, l);
    if (r.TVoid(e)) return function (e, t) {
      return r.TIntersect(t) ? c(e, t) : r.TUnion(t) ? C(e, t) : r.TUnknown(t) ? I() : r.TAny(t) ? o() : r.TObject(t) ? E(e, t) : r.TVoid(t) ? i.True : i.False;
    }(e, l);
    throw Error(`TypeExtends: Unknown left type operand '${e[exports.Kind]}'`);
  }
  e.Extends = function (e, t) {
    return A(e, t);
  };
})(o = exports.TypeExtends || (exports.TypeExtends = {}));
(function (e) {
  function t(e) {
    return function (e) {
      return globalThis.Array.isArray(e);
    }(e) ? function (e) {
      return e.map(e => t(e));
    }(e) : function (e) {
      return "object" == typeof e && null !== e;
    }(e) ? function (e) {
      return {
        ...globalThis.Object.getOwnPropertyNames(e).reduce((n, r) => ({
          ...n,
          [r]: t(e[r])
        }), {}),
        ...globalThis.Object.getOwnPropertySymbols(e).reduce((n, r) => ({
          ...n,
          [r]: t(e[r])
        }), {})
      };
    }(e) : e;
  }
  e.Clone = function (e, n) {
    return {
      ...t(e),
      ...n
    };
  };
})(s = exports.TypeClone || (exports.TypeClone = {}));
(function (e) {
  function n(e, r) {
    return "Intersect" === e[exports.Kind] ? function (e, r) {
      const i = e.allOf.reduce((e, i) => {
        const o = n(i, r);
        return "Never" === o[exports.Kind] ? e : [...e, o];
      }, []);
      return exports.Type.Intersect(i);
    }(e, r) : "Union" === e[exports.Kind] ? function (e, r) {
      const i = e.anyOf.map(e => n(e, r));
      return exports.Type.Union(i);
    }(e, r) : "Object" === e[exports.Kind] ? function (e, n) {
      const r = e.properties[n];
      return void 0 === r ? exports.Type.Never() : exports.Type.Union([r]);
    }(e, r) : "Tuple" === e[exports.Kind] ? function (e, n) {
      const r = e.items;
      if (void 0 === r) return exports.Type.Never();
      const i = r[n];
      return void 0 === i ? exports.Type.Never() : i;
    }(e, r) : exports.Type.Never();
  }
  e.Resolve = function (e, r, i = {}) {
    return exports.Type.Union(r.map(t => n(e, t.toString())), i);
  };
})(a = exports.IndexedAccessor || (exports.IndexedAccessor = {}));
(function (e) {
  function n(e, r) {
    return "Intersect" === e[exports.Kind] ? function (e, r) {
      return exports.Type.Intersect(e.allOf.map(e => n(e, r)), {
        ...e
      });
    }(e, r) : "Union" === e[exports.Kind] ? function (e, r) {
      return exports.Type.Union(e.anyOf.map(e => n(e, r)), {
        ...e
      });
    }(e, r) : "Object" === e[exports.Kind] ? function (e, t) {
      return t(e);
    }(e, r) : e;
  }
  e.Map = function (e, t, r) {
    return {
      ...n(s.Clone(e, {}), t),
      ...r
    };
  };
})(c = exports.ObjectMap || (exports.ObjectMap = {}));
(function (e) {
  function t(e, n) {
    return r.TIntersect(e) ? function (e, n) {
      return e.allOf.reduce((e, r) => [...e, ...t(r, n)], []);
    }(e, n) : r.TUnion(e) ? function (e, n) {
      const r = e.anyOf.map(e => t(e, n));
      return [...r.reduce((e, t) => t.map(t => r.every(e => e.includes(t)) ? e.add(t) : e)[0], new Set())];
    }(e, n) : r.TObject(e) ? function (e, t) {
      return globalThis.Object.keys(e.properties);
    }(e) : r.TRecord(e) ? function (e, t) {
      return t.includePatterns ? globalThis.Object.keys(e.patternProperties) : [];
    }(e, n) : [];
  }
  function n(e, n) {
    return [...new Set(t(e, n))];
  }
  e.ResolveKeys = n;
  e.ResolvePattern = function (e) {
    return `^(${n(e, {
      includePatterns: !0
    }).map(e => `(${function (e) {
      return "^" === e[0] && "$" === e[e.length - 1] ? e.slice(1, e.length - 1) : e;
    }(e)})`).join("|")})$`;
  };
})(l = exports.KeyResolver || (exports.KeyResolver = {}));
(function (e) {
  e.Resolve = function (e) {
    if (globalThis.Array.isArray(e)) return e;
    if (r.TUnionLiteral(e)) return e.anyOf.map(e => e.const.toString());
    if (r.TLiteral(e)) return [e.const];
    if (r.TTemplateLiteral(e)) {
      const t = f.ParseExact(e.pattern);
      if (!m.Check(t)) throw Error("KeyArrayResolver: Cannot resolve keys from infinite template expression");
      return [...g.Generate(t)];
    }
    return [];
  };
})(u = exports.KeyArrayResolver || (exports.KeyArrayResolver = {}));
(function (e) {
  function* n(e) {
    for (const r of e.anyOf) if ("Union" === r[exports.Kind]) {
      yield* n(r);
    } else {
      yield r;
    }
  }
  e.Resolve = function (e) {
    return exports.Type.Union([...n(e)], {
      ...e
    });
  };
})(p = exports.UnionResolver || (exports.UnionResolver = {}));
(function (e) {
  function n(e, i) {
    if (r.TTemplateLiteral(e)) return e.pattern.slice(1, e.pattern.length - 1);
    if (r.TUnion(e)) return `(${e.anyOf.map(e => n(e, i)).join("|")})`;
    if (r.TNumber(e)) return `${i}${exports.PatternNumber}`;
    if (r.TInteger(e)) return `${i}${exports.PatternNumber}`;
    if (r.TBigInt(e)) return `${i}${exports.PatternNumber}`;
    if (r.TString(e)) return `${i}${exports.PatternString}`;
    if (r.TLiteral(e)) return `${i}${(o = e.const.toString(), o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))}`;
    if (r.TBoolean(e)) return `${i}${exports.PatternBoolean}`;
    throw r.TNever(e) ? Error("TemplateLiteralPattern: TemplateLiteral cannot operate on types of TNever") : Error(`TemplateLiteralPattern: Unexpected Kind '${e[exports.Kind]}'`);
    var o;
  }
  e.Create = function (e) {
    return `^${e.map(e => n(e, "")).join("")}$`;
  };
})(d = exports.TemplateLiteralPattern || (exports.TemplateLiteralPattern = {}));
(function (e) {
  e.Resolve = function (e) {
    const n = f.ParseExact(e.pattern);
    if (!m.Check(n)) return exports.Type.String();
    const r = [...g.Generate(n)].map(e => exports.Type.Literal(e));
    return exports.Type.Union(r);
  };
})(h = exports.TemplateLiteralResolver || (exports.TemplateLiteralResolver = {}));
class TemplateLiteralParserError extends Error {
  constructor(e) {
    super(e);
  }
}
exports.TemplateLiteralParserError = TemplateLiteralParserError;
(function (e) {
  function t(e, t, n) {
    return e[t] === n && 92 !== e.charCodeAt(t - 1);
  }
  function n(e, n) {
    return t(e, n, "(");
  }
  function r(e, n) {
    return t(e, n, ")");
  }
  function i(e, n) {
    return t(e, n, "|");
  }
  function o(e) {
    return function (e) {
      if (!n(e, 0) || !r(e, e.length - 1)) return !1;
      let t = 0;
      for (let i = 0; i < e.length; i++) {
        if (n(e, i)) {
          t += 1;
        }
        if (r(e, i)) {
          t -= 1;
        }
        if (0 === t && i !== e.length - 1) return !1;
      }
      return !0;
    }(e) ? o(function (e) {
      return e.slice(1, e.length - 1);
    }(e)) : function (e) {
      let t = 0;
      for (let o = 0; o < e.length; o++) {
        if (n(e, o)) {
          t += 1;
        }
        if (r(e, o)) {
          t -= 1;
        }
        if (i(e, o) && 0 === t) return !0;
      }
      return !1;
    }(e) ? function (e) {
      let [t, s] = [0, 0];
      const a = [];
      for (let c = 0; c < e.length; c++) {
        if (n(e, c)) {
          t += 1;
        }
        if (r(e, c)) {
          t -= 1;
        }
        if (i(e, c) && 0 === t) {
          const t = e.slice(s, c);
          if (t.length > 0) {
            a.push(o(t));
          }
          s = c + 1;
        }
      }
      const c = e.slice(s);
      if (c.length > 0) {
        a.push(o(c));
      }
      return 0 === a.length ? {
        type: "const",
        const: ""
      } : 1 === a.length ? a[0] : {
        type: "or",
        expr: a
      };
    }(e) : function (e) {
      for (let t = 0; t < e.length; t++) if (n(e, t)) return !0;
      return !1;
    }(e) ? function (e) {
      function t(e, t) {
        if (!n(e, t)) throw new TemplateLiteralParserError("TemplateLiteralParser: Index must point to open parens");
        let i = 0;
        for (let o = t; o < e.length; o++) {
          if (n(e, o)) {
            i += 1;
          }
          if (r(e, o)) {
            i -= 1;
          }
          if (0 === i) return [t, o];
        }
        throw new TemplateLiteralParserError("TemplateLiteralParser: Unclosed group parens in expression");
      }
      function i(e, t) {
        for (let r = t; r < e.length; r++) if (n(e, r)) return [t, r];
        return [t, e.length];
      }
      const s = [];
      for (let r = 0; r < e.length; r++) if (n(e, r)) {
        const [n, i] = t(e, r);
        const a = e.slice(n, i + 1);
        s.push(o(a));
        r = i;
      } else {
        const [t, n] = i(e, r);
        const a = e.slice(t, n);
        if (a.length > 0) {
          s.push(o(a));
        }
        r = n - 1;
      }
      return 0 === s.length ? {
        type: "const",
        const: ""
      } : 1 === s.length ? s[0] : {
        type: "and",
        expr: s
      };
    }(e) : {
      type: "const",
      const: e
    };
  }
  e.Parse = o;
  e.ParseExact = function (e) {
    return o(e.slice(1, e.length - 1));
  };
})(f = exports.TemplateLiteralParser || (exports.TemplateLiteralParser = {}));
(function (e) {
  e.Check = function e(t) {
    if (function (e) {
      return "or" === e.type && 2 === e.expr.length && "const" === e.expr[0].type && "true" === e.expr[0].const && "const" === e.expr[1].type && "false" === e.expr[1].const;
    }(t)) return !0;
    if (function (e) {
      return "or" === e.type && 2 === e.expr.length && "const" === e.expr[0].type && "0" === e.expr[0].const && "const" === e.expr[1].type && "[1-9][0-9]*" === e.expr[1].const;
    }(t) || function (e) {
      return "const" === e.type && ".*" === e.const;
    }(t)) return !1;
    if ("and" === t.type) return t.expr.every(t => e(t));
    if ("or" === t.type) return t.expr.every(t => e(t));
    if ("const" === t.type) return !0;
    throw Error("TemplateLiteralFinite: Unknown expression type");
  };
})(m = exports.TemplateLiteralFinite || (exports.TemplateLiteralFinite = {}));
(function (e) {
  function* t(e) {
    if (1 === e.length) return yield* e[0];
    for (const n of e[0]) for (const r of t(e.slice(1))) yield `${n}${r}`;
  }
  function* n(e) {
    return yield* t(e.expr.map(e => [...r(e)]));
  }
  function* r(e) {
    if ("and" === e.type) return yield* n(e);
    if ("or" === e.type) return yield* function* (e) {
      for (const t of e.expr) yield* r(t);
    }(e);
    if ("const" === e.type) return yield* function* (e) {
      return yield e.const;
    }(e);
    throw Error("TemplateLiteralGenerator: Unknown expression");
  }
  e.Generate = r;
})(g = exports.TemplateLiteralGenerator || (exports.TemplateLiteralGenerator = {}));
(function (e) {
  function* n(e) {
    const n = e.trim().replace(/"|'/g, "");
    if ("boolean" === n) return yield exports.Type.Boolean();
    if ("number" === n) return yield exports.Type.Number();
    if ("bigint" === n) return yield exports.Type.BigInt();
    if ("string" === n) return yield exports.Type.String();
    const r = n.split("|").map(e => exports.Type.Literal(e.trim()));
    return yield 0 === r.length ? exports.Type.Never() : 1 === r.length ? r[0] : exports.Type.Union(r);
  }
  function* r(e) {
    if ("{" !== e[1]) {
      const n = exports.Type.Literal("$");
      const r = i(e.slice(1));
      return yield* [n, ...r];
    }
    for (let t = 2; t < e.length; t++) if ("}" === e[t]) {
      const r = n(e.slice(2, t));
      const o = i(e.slice(t + 1));
      return yield* [...r, ...o];
    }
    yield exports.Type.Literal(e);
  }
  function* i(e) {
    for (let n = 0; n < e.length; n++) if ("$" === e[n]) {
      const i = exports.Type.Literal(e.slice(0, n));
      const o = r(e.slice(n));
      return yield* [i, ...o];
    }
    yield exports.Type.Literal(e);
  }
  e.Parse = function (e) {
    return [...i(e)];
  };
})(y = exports.TemplateLiteralDslParser || (exports.TemplateLiteralDslParser = {}));
let b = 0;
class TypeBuilder {
  Create(e) {
    return e;
  }
  Strict(e) {
    return JSON.parse(JSON.stringify(e));
  }
}
exports.TypeBuilder = TypeBuilder;
class StandardTypeBuilder extends TypeBuilder {
  Optional(e) {
    return {
      [exports.Modifier]: "Optional",
      ...s.Clone(e, {})
    };
  }
  ReadonlyOptional(e) {
    return {
      [exports.Modifier]: "ReadonlyOptional",
      ...s.Clone(e, {})
    };
  }
  Readonly(e) {
    return {
      [exports.Modifier]: "Readonly",
      ...e
    };
  }
  Any(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Any"
    });
  }
  Array(e, n = {}) {
    return this.Create({
      ...n,
      [exports.Kind]: "Array",
      type: "array",
      items: s.Clone(e, {})
    });
  }
  Boolean(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Boolean",
      type: "boolean"
    });
  }
  Composite(e, n) {
    const r = exports.Type.Intersect(e, {});
    const i = l.ResolveKeys(r, {
      includePatterns: !1
    }).reduce((e, n) => ({
      ...e,
      [n]: exports.Type.Index(r, [n])
    }), {});
    return exports.Type.Object(i, n);
  }
  Enum(e, n = {}) {
    const r = globalThis.Object.keys(e).filter(e => isNaN(e)).map(t => e[t]).map(e => "string" == typeof e ? {
      [exports.Kind]: "Literal",
      type: "string",
      const: e
    } : {
      [exports.Kind]: "Literal",
      type: "number",
      const: e
    });
    return this.Create({
      ...n,
      [exports.Kind]: "Union",
      anyOf: r
    });
  }
  Extends(e, t, n, r, a = {}) {
    switch (o.Extends(e, t)) {
      case i.Union:
        return this.Union([s.Clone(n, a), s.Clone(r, a)]);
      case i.True:
        return s.Clone(n, a);
      case i.False:
        return s.Clone(r, a);
    }
  }
  Exclude(e, t, n = {}) {
    if (r.TTemplateLiteral(e)) return this.Exclude(h.Resolve(e), t, n);
    if (r.TTemplateLiteral(t)) return this.Exclude(e, h.Resolve(t), n);
    if (r.TUnion(e)) {
      const r = e.anyOf.filter(e => o.Extends(e, t) === i.False);
      return 1 === r.length ? s.Clone(r[0], n) : this.Union(r, n);
    }
    return o.Extends(e, t) !== i.False ? this.Never(n) : s.Clone(e, n);
  }
  Extract(e, t, n = {}) {
    if (r.TTemplateLiteral(e)) return this.Extract(h.Resolve(e), t, n);
    if (r.TTemplateLiteral(t)) return this.Extract(e, h.Resolve(t), n);
    if (r.TUnion(e)) {
      const r = e.anyOf.filter(e => o.Extends(e, t) !== i.False);
      return 1 === r.length ? s.Clone(r[0], n) : this.Union(r, n);
    }
    return o.Extends(e, t) !== i.False ? s.Clone(e, n) : this.Never(n);
  }
  Index(e, t, n = {}) {
    if (r.TArray(e) && r.TNumber(t)) return s.Clone(e.items, n);
    if (r.TTuple(e) && r.TNumber(t)) {
      const t = (void 0 === e.items ? [] : e.items).map(e => s.Clone(e, {}));
      return this.Union(t, n);
    }
    {
      const r = u.Resolve(t);
      const i = s.Clone(e, {});
      return a.Resolve(i, r, n);
    }
  }
  Integer(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Integer",
      type: "integer"
    });
  }
  Intersect(e, n = {}) {
    if (0 === e.length) return exports.Type.Never();
    if (1 === e.length) return s.Clone(e[0], n);
    const i = e.every(e => r.TObject(e));
    const o = e.map(e => s.Clone(e, {}));
    const a = r.TSchema(n.unevaluatedProperties) ? {
      unevaluatedProperties: s.Clone(n.unevaluatedProperties, {})
    } : {};
    return !1 === n.unevaluatedProperties || r.TSchema(n.unevaluatedProperties) || i ? this.Create({
      ...n,
      ...a,
      [exports.Kind]: "Intersect",
      type: "object",
      allOf: o
    }) : this.Create({
      ...n,
      ...a,
      [exports.Kind]: "Intersect",
      allOf: o
    });
  }
  KeyOf(e, n = {}) {
    if (r.TRecord(e)) {
      const r = Object.getOwnPropertyNames(e.patternProperties)[0];
      if (r === exports.PatternNumberExact) return this.Number(n);
      if (r === exports.PatternStringExact) return this.String(n);
      throw Error("StandardTypeBuilder: Unable to resolve key type from Record key pattern");
    }
    if (r.TTuple(e)) {
      const r = (void 0 === e.items ? [] : e.items).map((e, n) => exports.Type.Literal(n));
      return this.Union(r, n);
    }
    if (r.TArray(e)) return this.Number(n);
    {
      const t = l.ResolveKeys(e, {
        includePatterns: !1
      });
      if (0 === t.length) return this.Never(n);
      const r = t.map(e => this.Literal(e));
      return this.Union(r, n);
    }
  }
  Literal(e, n = {}) {
    return this.Create({
      ...n,
      [exports.Kind]: "Literal",
      const: e,
      type: typeof e
    });
  }
  Never(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Never",
      not: {}
    });
  }
  Not(e, n, r) {
    return this.Create({
      ...r,
      [exports.Kind]: "Not",
      allOf: [{
        not: s.Clone(e, {})
      }, s.Clone(n, {})]
    });
  }
  Null(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Null",
      type: "null"
    });
  }
  Number(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Number",
      type: "number"
    });
  }
  Object(e, n = {}) {
    const i = globalThis.Object.getOwnPropertyNames(e);
    const o = i.filter(t => r.TOptional(e[t]) || r.TReadonlyOptional(e[t]));
    const a = i.filter(e => !o.includes(e));
    const c = r.TSchema(n.additionalProperties) ? {
      additionalProperties: s.Clone(n.additionalProperties, {})
    } : {};
    const l = i.reduce((t, n) => ({
      ...t,
      [n]: s.Clone(e[n], {})
    }), {});
    return a.length > 0 ? this.Create({
      ...n,
      ...c,
      [exports.Kind]: "Object",
      type: "object",
      properties: l,
      required: a
    }) : this.Create({
      ...n,
      ...c,
      [exports.Kind]: "Object",
      type: "object",
      properties: l
    });
  }
  Omit(e, t, n = {}) {
    const r = u.Resolve(t);
    return c.Map(s.Clone(e, {}), e => {
      if (e.required) {
        e.required = e.required.filter(e => !r.includes(e));
        if (0 === e.required.length) {
          delete e.required;
        }
      }
      for (const t of globalThis.Object.keys(e.properties)) if (r.includes(t)) {
        delete e.properties[t];
      }
      return this.Create(e);
    }, n);
  }
  Partial(e, n = {}) {
    return c.Map(s.Clone(e, {}), e => (delete e.required, globalThis.Object.keys(e.properties).forEach(n => function (e) {
      switch (e[exports.Modifier]) {
        case "ReadonlyOptional":
        case "Readonly":
          e[exports.Modifier] = "ReadonlyOptional";
          break;
        default:
          e[exports.Modifier] = "Optional";
      }
    }(e.properties[n])), e), n);
  }
  Pick(e, t, n = {}) {
    const r = u.Resolve(t);
    return c.Map(s.Clone(e, {}), e => {
      if (e.required) {
        e.required = e.required.filter(e => r.includes(e));
        if (0 === e.required.length) {
          delete e.required;
        }
      }
      for (const t of globalThis.Object.keys(e.properties)) if (r.includes(t)) {
        delete e.properties[t];
      }
      return this.Create(e);
    }, n);
  }
  Record(e, n, i = {}) {
    if (r.TTemplateLiteral(e)) {
      const r = f.ParseExact(e.pattern);
      return m.Check(r) ? this.Object([...g.Generate(r)].reduce((e, t) => ({
        ...e,
        [t]: s.Clone(n, {})
      }), {}), i) : this.Create({
        ...i,
        [exports.Kind]: "Record",
        type: "object",
        patternProperties: {
          [e.pattern]: s.Clone(n, {})
        }
      });
    }
    if (r.TUnion(e)) {
      const o = p.Resolve(e);
      if (r.TUnionLiteral(o)) {
        const e = o.anyOf.reduce((e, t) => ({
          ...e,
          [t.const]: s.Clone(n, {})
        }), {});
        return this.Object(e, {
          ...i,
          [exports.Hint]: "Record"
        });
      }
      throw Error("TypeBuilder: Record key of type union contains non-literal types");
    }
    if (r.TLiteral(e)) {
      if ("string" == typeof e.const || "number" == typeof e.const) return this.Object({
        [e.const]: s.Clone(n, {})
      }, i);
      throw Error("TypeBuilder: Record key of type literal is not of type string or number");
    }
    if (r.TInteger(e) || r.TNumber(e)) {
      const e = exports.PatternNumberExact;
      return this.Create({
        ...i,
        [exports.Kind]: "Record",
        type: "object",
        patternProperties: {
          [e]: s.Clone(n, {})
        }
      });
    }
    if (r.TString(e)) {
      const r = void 0 === e.pattern ? exports.PatternStringExact : e.pattern;
      return this.Create({
        ...i,
        [exports.Kind]: "Record",
        type: "object",
        patternProperties: {
          [r]: s.Clone(n, {})
        }
      });
    }
    throw Error("StandardTypeBuilder: Record key is an invalid type");
  }
  Recursive(e, n = {}) {
    if (void 0 === n.$id) {
      n.$id = "T" + b++;
    }
    const r = e({
      [exports.Kind]: "This",
      $ref: `${n.$id}`
    });
    r.$id = n.$id;
    return this.Create({
      ...n,
      [exports.Hint]: "Recursive",
      ...r
    });
  }
  Ref(e, n = {}) {
    if (void 0 === e.$id) throw Error("StandardTypeBuilder.Ref: Target type must specify an $id");
    return this.Create({
      ...n,
      [exports.Kind]: "Ref",
      $ref: e.$id
    });
  }
  Required(e, n = {}) {
    return c.Map(s.Clone(e, {}), e => (e.required = globalThis.Object.keys(e.properties), globalThis.Object.keys(e.properties).forEach(n => function (e) {
      switch (e[exports.Modifier]) {
        case "ReadonlyOptional":
        case "Readonly":
          e[exports.Modifier] = "Readonly";
          break;
        default:
          delete e[exports.Modifier];
      }
    }(e.properties[n])), e), n);
  }
  Rest(e) {
    return r.TTuple(e) ? void 0 === e.items ? [] : e.items.map(e => s.Clone(e, {})) : [s.Clone(e, {})];
  }
  String(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "String",
      type: "string"
    });
  }
  TemplateLiteral(e, n = {}) {
    const r = "string" == typeof e ? d.Create(y.Parse(e)) : d.Create(e);
    return this.Create({
      ...n,
      [exports.Kind]: "TemplateLiteral",
      type: "string",
      pattern: r
    });
  }
  Tuple(e, n = {}) {
    const [r, i, o] = [!1, e.length, e.length];
    const a = e.map(e => s.Clone(e, {}));
    const c = e.length > 0 ? {
      ...n,
      [exports.Kind]: "Tuple",
      type: "array",
      items: a,
      additionalItems: r,
      minItems: i,
      maxItems: o
    } : {
      ...n,
      [exports.Kind]: "Tuple",
      type: "array",
      minItems: i,
      maxItems: o
    };
    return this.Create(c);
  }
  Union(e, n = {}) {
    if (r.TTemplateLiteral(e)) return h.Resolve(e);
    {
      const r = e;
      if (0 === r.length) return this.Never(n);
      if (1 === r.length) return this.Create(s.Clone(r[0], n));
      const i = r.map(e => s.Clone(e, {}));
      return this.Create({
        ...n,
        [exports.Kind]: "Union",
        anyOf: i
      });
    }
  }
  Unknown(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Unknown"
    });
  }
  Unsafe(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: e[exports.Kind] || "Unsafe"
    });
  }
}
exports.StandardTypeBuilder = StandardTypeBuilder;
class ExtendedTypeBuilder extends StandardTypeBuilder {
  BigInt(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "BigInt",
      type: "null",
      typeOf: "BigInt"
    });
  }
  ConstructorParameters(e, t = {}) {
    return this.Tuple([...e.parameters], {
      ...t
    });
  }
  Constructor(e, n, r) {
    const i = s.Clone(n, {});
    const o = e.map(e => s.Clone(e, {}));
    return this.Create({
      ...r,
      [exports.Kind]: "Constructor",
      type: "object",
      instanceOf: "Constructor",
      parameters: o,
      returns: i
    });
  }
  Date(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Date",
      type: "object",
      instanceOf: "Date"
    });
  }
  Function(e, n, r) {
    const i = s.Clone(n, {});
    const o = e.map(e => s.Clone(e, {}));
    return this.Create({
      ...r,
      [exports.Kind]: "Function",
      type: "object",
      instanceOf: "Function",
      parameters: o,
      returns: i
    });
  }
  InstanceType(e, t = {}) {
    return s.Clone(e.returns, t);
  }
  Parameters(e, t = {}) {
    return this.Tuple(e.parameters, {
      ...t
    });
  }
  Promise(e, n = {}) {
    return this.Create({
      ...n,
      [exports.Kind]: "Promise",
      type: "object",
      instanceOf: "Promise",
      item: s.Clone(e, {})
    });
  }
  RegEx(e, n = {}) {
    return this.Create({
      ...n,
      [exports.Kind]: "String",
      type: "string",
      pattern: e.source
    });
  }
  ReturnType(e, t = {}) {
    return s.Clone(e.returns, t);
  }
  Symbol(e) {
    return this.Create({
      ...e,
      [exports.Kind]: "Symbol",
      type: "null",
      typeOf: "Symbol"
    });
  }
  Undefined(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Undefined",
      type: "null",
      typeOf: "Undefined"
    });
  }
  Uint8Array(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Uint8Array",
      type: "object",
      instanceOf: "Uint8Array"
    });
  }
  Void(e = {}) {
    return this.Create({
      ...e,
      [exports.Kind]: "Void",
      type: "null",
      typeOf: "Void"
    });
  }
}
exports.ExtendedTypeBuilder = ExtendedTypeBuilder;
exports.StandardType = new StandardTypeBuilder();
exports.Type = new ExtendedTypeBuilder();